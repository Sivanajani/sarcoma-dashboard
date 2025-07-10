from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from utils.crom_uniqueness.crom_diagnoses_uniqueness import calculate_diagnosis_uniqueness, calculate_diagnosis_uniqueness_per_patient

router = APIRouter()

@router.get("/uniqueness/diagnosis")
def get_uniqueness_diagnosis(db: Session = Depends(get_db)):
    return calculate_diagnosis_uniqueness(db)


@router.get("/uniqueness/diagnosis/patient")
def get_diagnosis_uniqueness_per_patient(db: Session = Depends(get_db)):
    return calculate_diagnosis_uniqueness_per_patient(db)
