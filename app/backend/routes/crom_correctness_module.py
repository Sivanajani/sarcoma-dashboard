from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg

from utils.crom_correctness.crom_diagnosis_correctness import validate_diagnosis_correctness
from utils.crom_correctness.crom_sarcomaBoard_correctness import validate_sarcoma_board_correctness
from utils.crom_correctness.crom_hyperthermia_correctness import validate_hyperthermia_correctness
from utils.crom_correctness.crom_systemicTherapies_correctness import validate_systemic_therapy_correctness
from utils.crom_correctness.crom_shared_rules import compute_correctness_result, fetch_birth_date 
from utils.crom_correctness.crom_radiologyTherapies_correctness import validate_radiology_therapy_correctness


router = APIRouter(prefix="/api")


@router.get("/patients/{patient_id}/correctness/diagnosis")
def get_diagnosis_correctness(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_diagnoses WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Diagnosemodul nicht gefunden")

            birth_date = fetch_birth_date(conn, patient_id)
            return compute_correctness_result(dict(row), validate_diagnosis_correctness, birth_date, "diagnosis")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patients/{patient_id}/correctness/sarcoma-board")
def get_sarcoma_board_correctness(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_sarcoma_boards WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="SarcomaBoard-Modul nicht gefunden")

            birth_date = fetch_birth_date(conn, patient_id)
            return compute_correctness_result(dict(row), validate_sarcoma_board_correctness, birth_date, "sarcoma_board")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patients/{patient_id}/correctness/hyperthermia")
def get_hyperthermia_correctness(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_hyperthermia_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Hyperthermia-Modul nicht gefunden")

            birth_date = fetch_birth_date(conn, patient_id)
            return compute_correctness_result(dict(row), validate_hyperthermia_correctness, birth_date, "hyperthermia")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patients/{patient_id}/correctness/systemic-therapy")
def get_systemic_therapy_correctness(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_systemic_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="SystemicTherapy-Modul nicht gefunden")

            birth_date = fetch_birth_date(conn, patient_id)
            return compute_correctness_result(dict(row), validate_systemic_therapy_correctness, birth_date, "systemic_therapy")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@router.get("/patients/{patient_id}/correctness/radiology-therapy")
def get_radiology_therapy_correctness(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_radiology_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="RadiologyTherapy-Modul nicht gefunden")

            birth_date = fetch_birth_date(conn, patient_id)
            return compute_correctness_result(dict(row), validate_radiology_therapy_correctness, birth_date, "radiology_therapy")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
