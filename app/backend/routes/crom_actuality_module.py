from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg

from utils.crom_actuality.crom_diagnosis_actuality import calculate_diagnosis_actuality
from utils.crom_actuality.crom_sarcomaBoard_actuality import calculate_sarcoma_board_actuality
from utils.crom_actuality.crom_hyperthermia_actuality import calculate_hyperthermia_actuality
from utils.crom_actuality.crom_systemicTherapy_actuality import calculate_systemic_therapy_actuality
from utils.crom_actuality.crom_radiologyTherapy_actuality import calculate_radiology_therapy_actuality
from utils.crom_actuality.crom_surgery_actuality import calculate_surgery_actuality
from utils.crom_actuality.crom_pathology_actuality import calculate_pathology_actuality
from utils.crom_actuality.crom_radiologyExam_actuality import calculate_radiology_exam_actuality

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

            result = calculate_systemic_therapy_actuality(dict(row))

            return {
                "module": "systemicTherapy",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/patients/{patient_id}/actuality/radiologyTherapy")
def get_radiologyTherapy_actuality(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_radiology_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Radiology Therapy-Modul nicht gefunden")

            result = calculate_radiology_therapy_actuality(dict(row))

            return {
                "module": "radiologytherapy",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/patients/{patient_id}/actuality/surgery")
def get_surgery_actuality(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_surgeries WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Surgery-Modul nicht gefunden")

            result = calculate_surgery_actuality(dict(row))

            return {
                "module": "surgery",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/patients/{patient_id}/actuality/pathology")
def get_pathology_actuality(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_pathologies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Pathology-Modul nicht gefunden")

            result = calculate_pathology_actuality(dict(row))

            return {
                "module": "pathology",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/patients/{patient_id}/actuality/radiologyExam")
def get_radiologyExam_actuality(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_radiology_exams WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Radiology Exam-Modul nicht gefunden")

            result = calculate_radiology_exam_actuality(dict(row))

            return {
                "module": "Radiology Exam",
                "actuality_score": result.get("actuality_score", 0),
                "details": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patients/{patient_id}/actuality-patient")
def get_actuality_patient(patient_id: int):
    module_functions = [
        ("diagnosis", "SELECT * FROM croms_diagnoses WHERE patient_id = :pid LIMIT 1", calculate_diagnosis_actuality),
        ("sarcoma_board", "SELECT * FROM croms_sarcoma_boards WHERE patient_id = :pid LIMIT 1", calculate_sarcoma_board_actuality),
        ("hyperthermia_therapy", "SELECT * FROM croms_hyperthermia_therapies WHERE patient_id = :pid LIMIT 1", calculate_hyperthermia_actuality),
        ("systemic_therapy", "SELECT * FROM croms_systemic_therapies WHERE patient_id = :pid LIMIT 1", calculate_systemic_therapy_actuality),
        ("radiology_therapy", "SELECT * FROM croms_radiology_therapies WHERE patient_id = :pid LIMIT 1", calculate_radiology_therapy_actuality),
        ("surgery", "SELECT * FROM croms_surgeries WHERE patient_id = :pid LIMIT 1", calculate_surgery_actuality),
        ("pathology", "SELECT * FROM croms_pathologies WHERE patient_id = :pid LIMIT 1", calculate_pathology_actuality),
        ("radiology_exam", "SELECT * FROM croms_radiology_exams WHERE patient_id = :pid LIMIT 1", calculate_radiology_exam_actuality),
    ]

    overview = []

    try:
        with engine_pg.connect() as conn:
            for name, query, validator in module_functions:
                row = conn.execute(text(query), {"pid": patient_id}).mappings().fetchone()
                if row:
                    result = validator(dict(row))  
                    overview.append({
                        "name": name,
                        "actuality": result.get("actuality_score", 0)
                    })
                else:
                    overview.append({
                        "name": name,
                        "actuality": None,
                        "reason": "no data"
                    })

        return {"patient_id": patient_id, "modules": overview}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
