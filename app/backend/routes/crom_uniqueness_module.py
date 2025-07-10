from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from utils.crom_uniqueness.crom_diagnoses_uniqueness import calculate_diagnosis_uniqueness, calculate_diagnosis_uniqueness_per_patient
from utils.crom_uniqueness.crom_surgeries_uniqueness import calculate_surgery_uniqueness, calculate_surgery_uniqueness_per_patient
from utils.crom_uniqueness.crom_pathologies_uniqueness import calculate_pathology_uniqueness, calculate_pathology_uniqueness_per_patient
from utils.crom_uniqueness.crom_radiologyExams_uniqueness import calculate_radiology_exam_uniqueness, calculate_radiology_exam_uniqueness_per_patient
from utils.crom_uniqueness.crom_radiology_therapies_uniqueness import calculate_radiology_therapy_uniqueness, calculate_radiology_therapy_uniqueness_per_patient
from utils.crom_uniqueness.crom_sarcoma_boards_uniqueness import calculate_sarcoma_board_uniqueness, calculate_sarcoma_board_uniqueness_per_patient
from utils.crom_uniqueness.crom_systemic_therapies_uniqueness import calculate_systemic_therapy_uniqueness, calculate_systemic_therapy_uniqueness_per_patient
from utils.crom_uniqueness.crom_hyperthermia_uniqueness import calculate_hyperthermia_uniqueness, calculate_hyperthermia_uniqueness_per_patient
from utils.crom_uniqueness.uniqueness_summary import get_uniqueness_summary_for_patient

router = APIRouter()

@router.get("/uniqueness/diagnosis")
def get_uniqueness_diagnosis(db: Session = Depends(get_db)):
    return calculate_diagnosis_uniqueness(db)


@router.get("/uniqueness/diagnosis/patient")
def get_diagnosis_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_diagnosis_uniqueness_per_patient(db)


@router.get("/uniqueness/surgery")
def get_uniqueness_surgery(db: Session = Depends(get_db)):
    return calculate_surgery_uniqueness(db)

@router.get("/uniqueness/surgery/patient")
def get_surgery_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_surgery_uniqueness_per_patient(db)


@router.get("/uniqueness/pathologies")
def get_uniqueness_pathologies(db: Session = Depends(get_db)):
    return calculate_pathology_uniqueness(db)

@router.get("/uniqueness/surgery/pathologies/patient")
def get_pathologies_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_pathology_uniqueness_per_patient(db)


@router.get("/uniqueness/radiologyExams")
def get_uniqueness_radiologyExams(db: Session = Depends(get_db)):
    return calculate_radiology_exam_uniqueness(db)

@router.get("/uniqueness/surgery/radiologyExams/patient")
def get_pathologies_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_radiology_exam_uniqueness_per_patient(db)

@router.get("/uniqueness/radiologyTherapies")
def get_uniqueness_radiology_therapies(db: Session = Depends(get_db)):
    return calculate_radiology_therapy_uniqueness(db)   

@router.get("/uniqueness/radiologyTherapies/patient")
def get_radiology_therapies_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_radiology_therapy_uniqueness_per_patient(db)

@router.get("/uniqueness/sarcomaBoards")
def get_uniqueness_sarcoma_boards(db: Session = Depends(get_db)):
    return calculate_sarcoma_board_uniqueness(db)

@router.get("/uniqueness/sarcomaBoards/patient")
def get_sarcoma_boards_uniqueness_per_patient(db: Session = Depends(get_db  )):
    return calculate_sarcoma_board_uniqueness_per_patient(db)   

@router.get("/uniqueness/systemicTherapies")
def get_uniqueness_systemic_therapies(db: Session = Depends(get_db)):
    return calculate_systemic_therapy_uniqueness(db)

@router.get("/uniqueness/systemicTherapies/patient")
def get_systemic_therapies_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_systemic_therapy_uniqueness_per_patient(db)    

@router.get("/uniqueness/hyperthermiaTherapies")
def get_uniqueness_hyperthermia_therapies(db: Session = Depends(get_db)):
    return calculate_hyperthermia_uniqueness(db)

@router.get("/uniqueness/hyperthermiaTherapies/patient")
def get_hyperthermia_therapies_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_hyperthermia_uniqueness_per_patient(db)


@router.get("/uniqueness/patient/{patient_id}")
def get_patient_wide_uniqueness(patient_id: int, db: Session = Depends(get_db)):
    return get_uniqueness_summary_for_patient(patient_id, db)
