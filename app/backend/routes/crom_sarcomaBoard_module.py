from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models import CROMSarcomaBoard
from datetime import datetime
from schemas import SarcomaBoardRead, SarcomaBoardUpdate

router = APIRouter(prefix="/api/sarcoma-board", tags=["sarcoma-board"])


@router.get("/patient/{patient_id}", response_model=list[SarcomaBoardRead])
def get_sarcoma_board_by_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(CROMSarcomaBoard).filter(CROMSarcomaBoard.patient_id == patient_id).all()
    return results


@router.put("/{entry_id}", response_model=SarcomaBoardRead)
def update_sarcoma_board_entry(entry_id: int, entry_data: SarcomaBoardUpdate, db: Session = Depends(get_db)):
    entry = db.query(CROMSarcomaBoard).filter(CROMSarcomaBoard.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry
