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


def determine_flag(scores: list[float]) -> str | None:
    has_red = any(score < 40 for score in scores)
    has_yellow = any(40 <= score < 75 for score in scores)
    if has_red:
        return "red"
    elif has_yellow:
        return "yellow"
    return "green"


@router.get("/patients/actuality-overview")
def get_avgactuality_overview():
    try:
        with engine_pg.connect() as conn:
            patients = conn.execute(text("SELECT id FROM croms_patients")).fetchall()
            result_list = []

            for patient in patients:
                pid = patient[0]                
                scores = []
                modules = [
                    ("diagnosis", "croms_diagnoses", calculate_diagnosis_actuality),
                    ("sarcoma_board", "croms_sarcoma_boards", calculate_sarcoma_board_actuality ),
                    ("hyperthermia", "croms_hyperthermia_therapies", calculate_hyperthermia_actuality ),
                    ("systemic_therapy", "croms_systemic_therapies", calculate_systemic_therapy_actuality ),
                    ("radiology_therapy", "croms_radiology_therapies", calculate_radiology_therapy_actuality ),
                    ("surgery", "croms_surgeries", calculate_surgery_actuality ),
                    ("pathologies", "croms_pathologies", calculate_pathology_actuality ),
                    ("radiology_exam", "croms_radiology_exams", calculate_radiology_exam_actuality ),
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
                        result = validate_fn(dict(row))
                        if isinstance(result.get("actuality_score"), (int, float)):
                            scores.append(result["actuality_score"])
                    except Exception as e:
                        continue

                avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
                flag = determine_flag(scores)

                result_list.append({
                    "patient_id": pid,
                    "average_actuality": avg_score,
                    "modules_checked": len(scores),
                    "flag": flag
                })

            return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
