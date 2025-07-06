from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg

from utils.crom_correctness.crom_shared_rules import compute_correctness_result, fetch_birth_date
from utils.crom_correctness.crom_diagnosis_correctness import validate_diagnosis_correctness
from utils.crom_correctness.crom_sarcomaBoard_correctness import validate_sarcoma_board_correctness
from utils.crom_correctness.crom_hyperthermia_correctness import validate_hyperthermia_correctness
from utils.crom_correctness.crom_systemicTherapies_correctness import validate_systemic_therapy_correctness
from utils.crom_correctness.crom_radiologyTherapies_correctness import validate_radiology_therapy_correctness
from utils.crom_correctness.crom_surgeries_correctness import validate_surgery_correctness
from utils.crom_correctness.croms_pathologies_correctness import validate_pathology_correctness
from utils.crom_correctness.crom_radiologyexams_correctness import validate_radiology_exam_correctness
from utils.crom_correctness.crom_reference_data import REFERENCE_DATA

router = APIRouter(prefix="/api")


def determine_flag(scores: list[float]) -> str | None:
    has_red = any(score < 40 for score in scores)
    has_yellow = any(40 <= score < 75 for score in scores)
    if has_red:
        return "red"
    elif has_yellow:
        return "yellow"
    return "green"


@router.get("/patients/correctness-overview")
def get_avgcorrectness_overview():
    try:
        with engine_pg.connect() as conn:
            patients = conn.execute(text("SELECT id FROM croms_patients")).fetchall()
            result_list = []

            for patient in patients:
                pid = patient[0]
                birth_date = fetch_birth_date(conn, pid)
                scores = []
                modules = [
                    ("diagnosis", "croms_diagnoses", validate_diagnosis_correctness),
                    ("sarcoma_board", "croms_sarcoma_boards", validate_sarcoma_board_correctness),
                    ("hyperthermia", "croms_hyperthermia_therapies", validate_hyperthermia_correctness),
                    ("systemic_therapy", "croms_systemic_therapies", validate_systemic_therapy_correctness),
                    ("radiology_therapy", "croms_radiology_therapies", validate_radiology_therapy_correctness),
                    ("surgery", "croms_surgeries", validate_surgery_correctness),
                    ("pathologies", "croms_pathologies", validate_pathology_correctness),
                    ("radiology_exam", "croms_radiology_exams", validate_radiology_exam_correctness),
                ]              

                for module_name, table, validate_fn in modules:

                    row = conn.execute(
                        text(f"SELECT * FROM {table} WHERE patient_id = :pid LIMIT 1"),
                        {"pid": pid}
                    ).mappings().fetchone()

                    if not row:
                        #print(f"Kein Eintrag für {module_name}")
                        continue
                    
                    try:
                        result = compute_correctness_result(dict(row), validate_fn, birth_date, module_name)
                        if isinstance(result.get("percent"), (int, float)):
                            scores.append(result["percent"])
                    except Exception as e:
                        continue

                avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
                flag = determine_flag(scores)

                result_list.append({
                    "patient_id": pid,
                    "average_correctness": avg_score,
                    "modules_checked": len(scores),
                    "flag": flag
                })

            return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
