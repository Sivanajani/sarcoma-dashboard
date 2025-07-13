from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models import CROMDiagnosis
from datetime import datetime
from schemas import DiagnosisRead, DiagnosisUpdate

router = APIRouter(prefix="/api/diagnoses", tags=["diagnoses"])


@router.get("/patient/{patient_id}", response_model=list[DiagnosisRead])
def get_diagnoses_by_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(CROMDiagnosis).filter(CROMDiagnosis.patient_id == patient_id).all()
    return results


@router.put("/{entry_id}", response_model=DiagnosisRead)
def update_diagnoses_entry(entry_id: int, entry_data: DiagnosisUpdate, db: Session = Depends(get_db)):
    entry = db.query(CROMDiagnosis).filter(CROMDiagnosis.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry