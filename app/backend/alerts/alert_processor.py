from sqlalchemy.orm import Session
from db.engine import engine_meta
from models_meta import Alert
from datetime import datetime
import httpx
import smtplib
from email.message import EmailMessage
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()  # Lädt automatisch die .env-Datei im Projektverzeichnis

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


SessionMeta = sessionmaker(autocommit=False, autoflush=False, bind=engine_meta)


# Flag-Schweregrade als Zahlen abbilden
FLAG_SEVERITY = {
    "ok": 0,
    "yellow flag": 1,
    "red flag": 2
}


def send_email_alert(to_email: str, subject: str, content: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.set_content(content)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

def check_alert_condition(value: float, threshold: float, condition: str) -> bool:
    if value is None:
        return False
    if condition == "<":
        return value < threshold
    elif condition == "<=":
        return value <= threshold
    elif condition == ">":
        return value > threshold
    elif condition == ">=":
        return value >= threshold
    elif condition == "==":
        return value == threshold
    return False

async def process_alerts():
    print(f"📡 Alert-Check gestartet um {datetime.utcnow()}")
    async with httpx.AsyncClient() as client:
        db: Session = SessionMeta()
        alerts = db.query(Alert).filter(Alert.active == True).all()

        for alert in alerts:
            try:
                url = f"http://localhost:8000/api/patient-quality/{alert.patient_external_code}"
                response = await client.get(url)
                if response.status_code != 200:
                    print(f"Fehler beim Abrufen von Patient {alert.patient_external_code}")
                    continue

                data = response.json()

                # Modul (z. B. "croms_diagnoses") aufspalten
                main_category, submodule = alert.module.split("_", 1)

                if main_category not in data:
                    print(f"Modul {main_category} nicht im Patientendatensatz")
                    continue

                module_data = data[main_category].get(submodule)
                if not module_data:
                    print(f"Keine Daten für Modul {submodule}")
                    continue

                if alert.metric == "flag":
                    raw_flag = module_data.get("flag", "ok")
                    metric_value = FLAG_SEVERITY.get(raw_flag, -1)  # -1 für unbekannte Werte
                else:
                    metric_value = module_data.get(alert.metric)

                
                if check_alert_condition(metric_value, alert.threshold, alert.condition):
                    # E-Mail versenden
                    subject = f"[Alert] Patient {alert.patient_external_code}: {submodule} – {alert.metric} {alert.condition} {alert.threshold}"
                    body = (
                        f"Der Schwellenwert wurde überschritten:\n\n"
                        f"Patient: {alert.patient_external_code}\n"
                        f"Modul: {submodule}\n"
                        f"Metrik: {alert.metric}\n"
                        f"Aktueller Wert: {metric_value}\n"
                        f"Bedingung: {alert.condition} {alert.threshold}\n"
                    )
                    send_email_alert(alert.email, subject, body)

                    # Zeitstempel aktualisieren
                    alert.last_triggered = datetime.utcnow()
                    db.commit()

            except Exception as e:
                print(f"Fehler bei Alert {alert.id}: {e}")

        db.close()