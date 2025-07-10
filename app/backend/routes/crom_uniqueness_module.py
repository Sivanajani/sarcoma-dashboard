from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from utils.crom_uniqueness.crom_diagnoses_uniqueness import calculate_diagnosis_uniqueness, calculate_diagnosis_uniqueness_per_patient
from utils.crom_uniqueness.crom_surgeries_uniqueness import calculate_surgery_uniqueness, calculate_surgery_uniqueness_per_patient
from utils.crom_uniqueness.crom_pathologies_uniqueness import calculate_pathology_uniqueness, calculate_pathology_uniqueness_per_patient

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

@router.get("/uniqueness/surgery/pathologies")
def get_pathologies_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_pathology_uniqueness_per_patient(db)