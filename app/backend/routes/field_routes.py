from fastapi import APIRouter, HTTPException
from sqlalchemy.inspection import inspect
from models import (
    CROMDiagnosis, CROMPathology, CROMSurgery, CROMRadiologyExam, CROMRadiologyTherapy,
    CROMSarcomaBoard, CROMSystemicTherapy, CROMHyperthermiaTherapy
)
from models_prom import Eq5d, Biopsy

router = APIRouter(prefix="/api/fields", tags=["fields"])

MODEL_MAP = {
    "croms": {
        "diagnoses": CROMDiagnosis,
        "pathologies": CROMPathology,
        "surgeries": CROMSurgery,
        "radiology_exams": CROMRadiologyExam,
        "radiology_therapies": CROMRadiologyTherapy,
        "sarcoma_boards": CROMSarcomaBoard,
        "systemic_therapies": CROMSystemicTherapy,
        "hyperthermia_therapies": CROMHyperthermiaTherapy,
    },
    "proms": {
        "eq5d": Eq5d,
        "proms_biopsy": Biopsy,
    },
}


@router.get("/{source}/{module}")
def get_all_fields(source: str, module: str):
    if source not in MODEL_MAP:
        raise HTTPException(status_code=400, detail="Ungültige Quelle")
    if module not in MODEL_MAP[source]:
        raise HTTPException(status_code=400, detail="Unbekanntes Modul")

    model_class = MODEL_MAP[source][module]
    excluded_fields ={
        "id", "row_id", "pid", "biopsy_row_id", "biopsy_pid",
        "patient_id", "created_at", "updated_at", "update_at"
    }
    columns = [
        column.key for column in inspect(model_class).columns
        if column.key not in excluded_fields]
    return columns
