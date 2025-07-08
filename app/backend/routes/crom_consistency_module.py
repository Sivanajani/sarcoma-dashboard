from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg

from utils.croms_consistency.crom_diagnosis_consistency import check_consistency_diagnosis
from utils.croms_consistency.crom_sarcomaBoard_consistency import check_consistency_sarcoma_board
from utils.croms_consistency.crom_hyperthermia_consistency import check_consistency_hyperthermia
from utils.croms_consistency.crom_systemicTherapies_consistency import check_consistency_systemic_therapy
from utils.croms_consistency.crom_radiologyTherapies_consistency import check_consistency_radiology_therapy

router = APIRouter(prefix="/api")


def compute_consistency_result(entry: dict, validation_fn, module_name: str = "") -> dict:
    # Ergebnis der Validierung abrufen
    result = validation_fn(entry)

    # result = dict mit key = Regelname, value = True (bestanden) oder False (nicht bestanden) oder None (nicht prüfbar)
    relevant_rules = {
        key: value
        for key, value in result.items()
        if value is not None
    }

    passed_rules = sum(1 for v in relevant_rules.values() if v is True)
    total_rules = len(relevant_rules)
    percent = round((passed_rules / total_rules) * 100, 2) if total_rules > 0 else None

    return {
        "module": module_name,
        "passed": passed_rules,
        "total": total_rules,
        "percent": percent,
        "rule_results": result  # enthält auch ggf. nicht relevante (None) Regeln
    }


@router.get("/patients/{patient_id}/consistency/diagnosis")
def get_diagnosis_consistency(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_diagnoses WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Diagnosemodul nicht gefunden")

            return compute_consistency_result(dict(row), check_consistency_diagnosis, "diagnosis")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patients/{patient_id}/consistency/sarcoma-board")
def get_sarcoma_board_consistency(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_sarcoma_boards WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="SarcomaBoard-Modul nicht gefunden")

            return compute_consistency_result(dict(row), check_consistency_sarcoma_board, "sarcoma_board")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/patients/{patient_id}/consistency/hyperthermia")
def get_hyperthermia_consistency(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_hyperthermia_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Hyperthermia Therapies-Modul nicht gefunden")

            return compute_consistency_result(dict(row), check_consistency_hyperthermia, "hyperthermia_therapies")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/patients/{patient_id}/consistency/systemic_therapy")
def get_systemic_therapy_consistency(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_systemic_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Systemic Therapy Therapies-Modul nicht gefunden")

            return compute_consistency_result(dict(row), check_consistency_systemic_therapy, "systemic_therapy")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/patients/{patient_id}/consistency/radiology_therapy")
def get_radiology_therapy_consistency(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM croms_radiology_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Radiology Therapy Modul nicht gefunden")

            return compute_consistency_result(dict(row), check_consistency_radiology_therapy, "radiology_therapy")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
