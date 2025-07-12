from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models import CROMPathology
from datetime import datetime
from schemas import PathologyRead, PathologyUpdate

router = APIRouter(prefix="/api/pathology", tags=["pathology"])


@router.get("/patient/{patient_id}", response_model=list[PathologyRead])
def get_pathology_by_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(CROMPathology).filter(CROMPathology.patient_id == patient_id).all()
    return results


@router.put("/{entry_id}", response_model=PathologyRead)
def update_pathology_entry(entry_id: int, entry_data: PathologyUpdate, db: Session = Depends(get_db)):
    entry = db.query(CROMPathology).filter(CROMPathology.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry
