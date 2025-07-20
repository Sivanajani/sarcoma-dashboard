from fastapi import APIRouter
from sqlalchemy import text
from db.engine import engine_prom
from utils.prom_actuality.prom_actuality import check_prom_aktualitaet

router = APIRouter()

@router.get("/api/proms/actuality-overview")
def prom_actuality_overview():
    try:
        with engine_prom.connect() as conn:
            # Daten aus allen relevanten Modulen abrufen
            eq5d_data = conn.execute(text("SELECT pid, date AS record_date FROM eq5d")).mappings().all()
            biopsy_data = conn.execute(text("SELECT biopsy_pid as pid, biopsy_date as record_date FROM proms_biopsy")).mappings().all()

            # Alle Einträge zusammenführen
            all_entries = []

            for row in eq5d_data:
                all_entries.append({
                    "pid": row["pid"],
                    "record_date": row["record_date"],
                    "module": "eq5d"
                })

            for row in biopsy_data:
                all_entries.append({
                    "pid": row["pid"],
                    "record_date": row["record_date"],
                    "module": "biopsy"
                })

            # Gruppieren nach pid
            patient_aktualitaet = {}
            for entry in all_entries:
                result = check_prom_aktualitaet(entry["record_date"], entry["module"])
                pid = entry["pid"]
                if pid not in patient_aktualitaet:
                    patient_aktualitaet[pid] = []

                patient_aktualitaet[pid].append(result["aktualitaet_prozent"])

            # Durchschnitt berechnen
            avg_actuality_per_pid = []
            for pid, values in patient_aktualitaet.items():
                valid_values = [v for v in values if v is not None]
                avg = round(sum(valid_values) / len(valid_values)) if valid_values else None
                avg_actuality_per_pid.append({
                    "patient_id": pid,
                    "average_actuality": avg
                })

            return avg_actuality_per_pid

    except Exception as e:
        return {"error": str(e)}
