from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models import CROMPatient
from datetime import datetime
from schemas import CROMPatientRead, CROMPatientUpdate

router = APIRouter(prefix="/api/patient", tags=["patient"])


@router.get("/patient/{patient_id}", response_model=list[CROMPatientRead])
def get_patient_by_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(CROMPatient).filter(CROMPatient.patient_id == patient_id).all()
    return results


@router.put("/{entry_id}", response_model=CROMPatientRead)
def update_patient_entry(entry_id: int, entry_data: CROMPatientUpdate, db: Session = Depends(get_db)):
    entry = db.query(CROMPatient).filter(CROMPatient.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry
