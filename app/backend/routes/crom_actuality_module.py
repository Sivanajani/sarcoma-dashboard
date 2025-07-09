from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg

from utils.crom_actuality.crom_diagnosis_actuality import calculate_diagnosis_actuality

router = APIRouter(prefix="/api")


@router.get("/patients/{patient_id}/actuality/diagnosis")
def get_diagnosis_actuality(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_diagnoses WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Diagnosis-Modul nicht gefunden")

            result = calculate_diagnosis_actuality(dict(row))

            return {
                "module": "diagnosis",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
