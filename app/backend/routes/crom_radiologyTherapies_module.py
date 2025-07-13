from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models import CROMRadiologyTherapy
from datetime import datetime
from schemas import RadiologyTherapyRead, RadiologyTherapyUpdate

router = APIRouter(prefix="/api/radiology-therapy", tags=["radiology-therapy"])


@router.get("/patient/{patient_id}", response_model=list[RadiologyTherapyRead])
def get_radiology_therapy_by_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(CROMRadiologyTherapy).filter(CROMRadiologyTherapy.patient_id == patient_id).all()
    return results


@router.put("/{entry_id}", response_model=RadiologyTherapyRead)
def update_radiology_therapy_entry(entry_id: int, entry_data: RadiologyTherapyUpdate, db: Session = Depends(get_db)):
    entry = db.query(CROMRadiologyTherapy).filter(CROMRadiologyTherapy.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry