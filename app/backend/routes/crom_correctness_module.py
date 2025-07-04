from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg
from utils.crom_correctness.crom_diagnosis_correctness import validate_diagnosis_correctness
from utils.crom_correctness.crom_sarcomaBoard_correctness import validate_sarcoma_board_correctness
from utils.crom_correctness.crom_hyperthermia_correctness import validate_hyperthermia_correctness

router = APIRouter(prefix="/api")

@router.get("/patients/{patient_id}/correctness/diagnosis")
def get_diagnosis_correctness(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM croms_diagnoses WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not result:
                raise HTTPException(status_code=404, detail="Diagnosemodul nicht gefunden")

            diagnosis_entry = dict(result)

            birth_result = conn.execute(
                text("SELECT birth_date FROM croms_patients WHERE id = :pid"),
                {"pid": patient_id}
            ).mappings().fetchone()

            birth_date = birth_result["birth_date"].isoformat() if birth_result and birth_result["birth_date"] else None

            result = validate_diagnosis_correctness(diagnosis_entry, birth_date)
            valid_values = [v for v in result.values() if v is not None]
            correct_count = sum(1 for v in valid_values if v)
            total_count = len(valid_values)
            percent = round((correct_count / total_count) * 100, 2) if total_count > 0 else None

            return {
                "module": "diagnosis",
                "correct": correct_count,
                "total": total_count,
                "percent": percent,
                "field_results": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patients/{patient_id}/correctness/sarcoma-board")
def get_sarcoma_board_correctness(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM croms_sarcoma_boards WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not result:
                raise HTTPException(status_code=404, detail="SarcomaBoard-Modul nicht gefunden")

            sb_entry = dict(result)

            birth_result = conn.execute(
                text("SELECT birth_date FROM croms_patients WHERE id = :pid"),
                {"pid": patient_id}
            ).mappings().fetchone()

            birth_date = birth_result["birth_date"].isoformat() if birth_result and birth_result["birth_date"] else None

            result = validate_sarcoma_board_correctness(sb_entry, birth_date)
            valid_values = [v for v in result.values() if v is not None]
            correct_count = sum(1 for v in valid_values if v)
            total_count = len(valid_values)
            percent = round((correct_count / total_count) * 100, 2) if total_count > 0 else None

            return {
                "module": "sarcoma_board",
                "correct": correct_count,
                "total": total_count,
                "percent": percent,
                "field_results": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patients/{patient_id}/correctness/hyperthermia")
def get_hyperthermia_correctness(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM croms_hyperthermia_therapies WHERE patient_id = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not result:
                raise HTTPException(status_code=404, detail="Hyperthermia-Modul nicht gefunden")

            ht_entry = dict(result)

            birth_result = conn.execute(
                text("SELECT birth_date FROM croms_patients WHERE id = :pid"),
                {"pid": patient_id}
            ).mappings().fetchone()

            birth_date = birth_result["birth_date"].isoformat() if birth_result and birth_result["birth_date"] else None

            result = validate_hyperthermia_correctness(ht_entry, birth_date)
            valid_values = [v for v in result.values() if v is not None]
            correct_count = sum(1 for v in valid_values if v)
            total_count = len(valid_values)
            percent = round((correct_count / total_count) * 100, 2) if total_count > 0 else None

            return {
                "module": "hyperthermia",
                "correct": correct_count,
                "total": total_count,
                "percent": percent,
                "field_results": result
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
