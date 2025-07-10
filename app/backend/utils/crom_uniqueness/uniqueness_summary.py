from sqlalchemy.orm import Session
from utils.crom_uniqueness.crom_diagnoses_uniqueness import calculate_diagnosis_uniqueness_per_patient
from utils.crom_uniqueness.crom_surgeries_uniqueness import calculate_surgery_uniqueness_per_patient
from utils.crom_uniqueness.crom_pathologies_uniqueness import calculate_pathology_uniqueness_per_patient
from utils.crom_uniqueness.crom_radiologyExams_uniqueness import calculate_radiology_exam_uniqueness_per_patient
from utils.crom_uniqueness.crom_radiology_therapies_uniqueness import calculate_radiology_therapy_uniqueness_per_patient
from utils.crom_uniqueness.crom_sarcoma_boards_uniqueness import calculate_sarcoma_board_uniqueness_per_patient
from utils.crom_uniqueness.crom_systemic_therapies_uniqueness import calculate_systemic_therapy_uniqueness_per_patient
from utils.crom_uniqueness.crom_hyperthermia_uniqueness import calculate_hyperthermia_uniqueness_per_patient

def get_uniqueness_summary_for_patient(patient_id: int, db: Session) -> dict:
    modules = {
        "diagnosis": calculate_diagnosis_uniqueness_per_patient,
        "surgery": calculate_surgery_uniqueness_per_patient,
        "pathology": calculate_pathology_uniqueness_per_patient,
        "radiology_exam": calculate_radiology_exam_uniqueness_per_patient,
        "radiology_therapy": calculate_radiology_therapy_uniqueness_per_patient,
        "sarcoma_board": calculate_sarcoma_board_uniqueness_per_patient,
        "systemic_therapy": calculate_systemic_therapy_uniqueness_per_patient,
        "hyperthermia_therapy": calculate_hyperthermia_uniqueness_per_patient
    }

    modules_with_duplicates = []

    for module_name, func in modules.items():
        result = func(db)
        for entry in result.get("duplicate_summary_per_patient", []):
            if entry["patient_id"] == patient_id:
                modules_with_duplicates.append({
                    "module": module_name,
                    "duplicates": entry["duplicates"]
                })

    return {
        "patient_id": patient_id,
        "modules_with_duplicates": modules_with_duplicates
    }