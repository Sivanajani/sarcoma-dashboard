from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models import CROMHyperthermiaTherapy
from datetime import datetime
from schemas import HyperthermiaTherapyRead, HyperthermiaTherapyUpdate

router = APIRouter(prefix="/api/hyperthermia-therapies", tags=["hyperthermia-therapies"])


@router.get("/patient/{patient_id}", response_model=list[HyperthermiaTherapyRead])
def get_hyperthermia_therapies_by_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(CROMHyperthermiaTherapy).filter(CROMHyperthermiaTherapy.patient_id == patient_id).all()
    return results


@router.put("/{entry_id}", response_model=HyperthermiaTherapyRead)
def update_hyperthermia_therapies_entry(entry_id: int, entry_data: HyperthermiaTherapyUpdate, db: Session = Depends(get_db)):
    entry = db.query(CROMHyperthermiaTherapy).filter(CROMHyperthermiaTherapy.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry
