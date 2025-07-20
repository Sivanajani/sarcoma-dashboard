# Datei: routes/prom_patients.py

from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_prom

router = APIRouter(prefix="/api/proms")

# Liste aller PROM-Patient:innen
@router.get("/patients")
def get_prom_patients():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT row_id, pid FROM personal_data"))
            patients = [
                {
                    "id": row["row_id"],
                    "patient_id": row['pid']
                }
                for row in result.mappings()
            ]
        return patients
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PROM-Patientenzahl
@router.get("/patient-count")
def get_prom_patient_count():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT COUNT(*) FROM personal_data"))
            count = result.scalar()
        return {"patient_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
