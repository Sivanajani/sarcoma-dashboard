from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg

from utils.crom_actuality.crom_diagnosis_actuality import calculate_diagnosis_actuality
from utils.crom_actuality.crom_sarcomaBoard_actuality import calculate_sarcoma_board_actuality
from utils.crom_actuality.crom_hyperthermia_actuality import calculate_hyperthermia_actuality
from utils.crom_actuality.crom_systemicTherapy_actuality import calculate_systemic_therapy_actuality

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


@router.get("/patients/{patient_id}/actuality/sarcomaBoard")
def get_sarcomaBoard_actuality(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_sarcoma_boards WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Sarcoma Board-Modul nicht gefunden")

            result = calculate_sarcoma_board_actuality(dict(row))

            return {
                "module": "sarcomaBoard",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/patients/{patient_id}/actuality/hyperthermia")
def get_hyperthermia_actuality(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_hyperthermia_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Hyperthermia-Modul nicht gefunden")

            result = calculate_hyperthermia_actuality(dict(row))

            return {
                "module": "hyperthermia",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patients/{patient_id}/actuality/systemicTherapy")
def get_systemicTherapy_actuality(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_systemic_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Systemic Therapy-Modul nicht gefunden")

            result = calculate_hyperthermia_actuality(dict(row))

            return {
                "module": "systemicTherapy",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))