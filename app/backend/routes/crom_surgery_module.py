from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models import CROMSurgery
from datetime import datetime
from schemas import SurgeryRead, SurgeryUpdate

router = APIRouter(prefix="/api/surgery", tags=["surgery"])


@router.get("/patient/{patient_id}", response_model=list[SurgeryRead])
def get_surgery_by_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(CROMSurgery).filter(CROMSurgery.patient_id == patient_id).all()
    return results


@router.put("/{entry_id}", response_model=SurgeryRead)
def update_surgery_entry(entry_id: int, entry_data: SurgeryUpdate, db: Session = Depends(get_db)):
    entry = db.query(CROMSurgery).filter(CROMSurgery.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry
