from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg

from utils.croms_consistency.crom_diagnosis_consistency import check_consistency_diagnosis
from utils.croms_consistency.crom_sarcomaBoard_consistency import check_consistency_sarcoma_board
from utils.croms_consistency.crom_hyperthermia_consistency import check_consistency_hyperthermia
from utils.croms_consistency.crom_systemicTherapies_consistency import check_consistency_systemic_therapy
from utils.croms_consistency.crom_radiologyTherapies_consistency import check_consistency_radiology_therapy
from utils.croms_consistency.crom_surgery_consistency import check_consistency_surgery
from utils.croms_consistency.crom_pathologies_consistency import check_consistency_pathology
from utils.croms_consistency.crom_radiologyExams_consistency import check_consistency_radiology_exam
from routes.crom_consistency_module import compute_consistency_result

router = APIRouter(prefix="/api")


def determine_flag(scores: list[float]) -> str | None:
    has_red = any(score < 40 for score in scores)
    has_yellow = any(40 <= score < 75 for score in scores)
    if has_red:
        return "red"
    elif has_yellow:
        return "yellow"
    return "green"


@router.get("/patients/consistency-overview")
def get_avgconsistency_overview():
    try:
        with engine_pg.connect() as conn:
            patients = conn.execute(text("SELECT id FROM croms_patients")).fetchall()
            result_list = []

            for patient in patients:
                pid = patient[0]                
                scores = []
                modules = [
                    ("diagnosis", "croms_diagnoses", check_consistency_diagnosis),
                    ("sarcoma_board", "croms_sarcoma_boards", check_consistency_sarcoma_board),
                    ("hyperthermia", "croms_hyperthermia_therapies", check_consistency_hyperthermia),
                    ("systemic_therapy", "croms_systemic_therapies", check_consistency_systemic_therapy),
                    ("radiology_therapy", "croms_radiology_therapies", check_consistency_radiology_therapy),
                    ("surgery", "croms_surgeries", check_consistency_surgery),
                    ("pathologies", "croms_pathologies", check_consistency_pathology),
                    ("radiology_exam", "croms_radiology_exams", check_consistency_radiology_exam),
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
                        result = compute_consistency_result(dict(row), validate_fn, module_name)
                        if isinstance(result.get("percent"), (int, float)):
                            scores.append(result["percent"])
                    except Exception as e:
                        continue

                avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
                flag = determine_flag(scores)

                result_list.append({
                    "patient_id": pid,
                    "average_consistency": avg_score,
                    "modules_checked": len(scores),
                    "flag": flag
                })

            return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
