from sqlalchemy.orm import Session, sessionmaker
from db.engine import engine_meta
from models_meta import Alert
from datetime import datetime
import httpx
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

# .env laden für Gmail-Zugangsdaten
load_dotenv()
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

SessionMeta = sessionmaker(autocommit=False, autoflush=False, bind=engine_meta)

# Mapping für Flag-Werte
FLAG_SEVERITY = {
    "ok": 0,
    "yellow flag": 1,
    "red flag": 2
}

# Mail-Versand
def send_email_alert(to_email: str, subject: str, content: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.set_content(content)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

# Vergleichsfunktion
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

# Hauptfunktion: Alert-Logik
async def process_alerts():
    print(f"Alert-Check gestartet um {datetime.utcnow()}")
    async with httpx.AsyncClient() as client:
        db: Session = SessionMeta()
        alerts = db.query(Alert).filter(Alert.active == True).all()

        for alert in alerts:
            try:
                # Patientendaten abrufen
                url = f"http://localhost:8000/api/patient-quality/{alert.patient_external_code}"
                response = await client.get(url)
                if response.status_code != 200:
                    print(f"Fehler beim Abrufen von Patient {alert.patient_external_code}")
                    continue

                data = response.json()
                source = alert.source or "croms"
                submodule = alert.module[len(source) + 1:] if alert.module.startswith(source + "_") else alert.module

                if source not in data:
                    print(f"Quelle {source} nicht im Patientendatensatz")
                    print(f"Modul-Check → Source: {source}, Submodule: {submodule}")
                    print(f"Verfügbare Module: {list(data[source].keys())}")
                    continue            

                module_data = data[source].get(submodule)
                if not module_data:                    
                    print(f"Keine Daten für Modul {submodule}")
                    continue

                # Alert-Typ 1: Metrik-Check
                if alert.metric:
                    if alert.metric == "flag":
                        raw_flag = module_data.get("flag", "ok")
                        metric_value = FLAG_SEVERITY.get(raw_flag, -1)
                    else:
                        metric_value = module_data.get(alert.metric)

                    if check_alert_condition(metric_value, alert.threshold, alert.condition):
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
                        alert.last_triggered = datetime.utcnow()
                        db.commit()
                        continue

                # Alert-Typ 2 & 3: Feldprüfungen (missing / Vergleichswert)
                if alert.field:
                    detail_data = None
                    try:
                        if source == "croms":
                            module_url_map = {
                                "diagnoses": f"http://localhost:8000/api/diagnoses/patient/{data['crom_id']}",
                                "radiology_exams": f"http://localhost:8000/api/radiology-exams/patient/{data['crom_id']}",
                                "radiology_therapies": f"http://localhost:8000/api/radiology-therapy/patient/{data['crom_id']}",
                                "sarcoma_boards": f"http://localhost:8000/api/sarcoma-board/patient/{data['crom_id']}",
                                "systemic_therapies": f"http://localhost:8000/api/systemic-therapy/patient/{data['crom_id']}",
                                "surgeries": f"http://localhost:8000/api/surgery/patient/{data['crom_id']}",
                                "pathologies": f"http://localhost:8000/api/pathology/patient/{data['crom_id']}",
                                "hyperthermia_therapies": f"http://localhost:8000/api/hyperthermia-therapies/patient/{data['crom_id']}",                                
                            }
                            url_detail = module_url_map.get(submodule)
                        elif source == "proms":
                            if submodule == "eq5d":
                                url_detail = f"http://localhost:8000/api/proms/eq5d/by-external-code/{data['patient_id']}"
                            elif submodule == "proms_biopsy":
                                url_detail = f"http://localhost:8000/api/proms/biopsy/by-external-code/{data['patient_id']}"
                            else:
                                url_detail = None
                        else:
                            url_detail = None

                        if url_detail:
                            detail_response = await client.get(url_detail)
                            if detail_response.status_code == 200:
                                detail_data = detail_response.json()
                                if isinstance(detail_data, list) and len(detail_data) > 0:
                                    detail_data = detail_data[0]
                            else:
                                print(f"Fehler beim Abruf der Detaildaten für Modul {submodule} → Status {detail_response.status_code}")
                        else:
                            print(f"Kein Detail-Endpoint definiert für {submodule}")
                    except Exception as e:
                        print(f"Fehler beim Laden von Detaildaten für {submodule}: {e}")

                    if detail_data:
                        entries = detail_data if isinstance(detail_data, list) else [detail_data]
                        
                        for entry in entries:
                            field_value = entry.get(alert.field)
                            print(f"Prüfe {alert.field} in Datensatz vom {entry.get('date')} → {field_value}")
                            
                            # missing-Fall
                            if alert.condition in ["missing", "is_null", "null", "is_null_if"] and (field_value is None or field_value == ""):
                                subject = f"[Alert] Patient {alert.patient_external_code}: {submodule} – Feld {alert.field} fehlt"
                                body = (
                                    f"Ein Pflichtfeld fehlt:\n\n"
                                    f"Patient: {alert.patient_external_code}\n"
                                    f"Modul: {submodule}\n"
                                    f"Feld: {alert.field}\n"
                                    f"Datum: {entry.get('date')}\n"
                                    f"Meldung: {alert.message or 'Kein spezifischer Hinweis'}"
                                )
                                send_email_alert(alert.email, subject, body)
                                alert.last_triggered = datetime.utcnow()
                                db.commit()
                                break  
                            
                            # Vergleichsfall ==
                            elif alert.condition == "==" and field_value is not None and str(field_value).lower() == str(alert.value).lower():
                                subject = f"[Alert] Patient {alert.patient_external_code}: {submodule} – {alert.field} == {alert.value}"
                                body = (
                                    f"Ein Wert wurde erkannt:\n\n"
                                    f"Patient: {alert.patient_external_code}\n"
                                    f"Modul: {submodule}\n"
                                    f"Feld: {alert.field}\n"
                                    f"Datum: {entry.get('date')}\n"
                                    f"Aktueller Wert: {field_value}\n"
                                    f"Bedingung: {alert.condition} {alert.value}\n"
                                    f"Meldung: {alert.message or 'Kein spezifischer Hinweis'}"
                                )
                                send_email_alert(alert.email, subject, body)
                                alert.last_triggered = datetime.utcnow()
                                db.commit()
                                break  


            except Exception as e:
                print(f"Fehler bei Alert {alert.id}: {e}")

        db.close()