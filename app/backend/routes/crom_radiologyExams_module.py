from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models import CROMRadiologyExam
from datetime import datetime
from schemas import RadiologyExamRead, RadiologyExamUpdate

router = APIRouter(prefix="/api/radiology-exams", tags=["radiology-exams"])


@router.get("/patient/{patient_id}", response_model=list[RadiologyExamRead])
def get_radiology_exams_by_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(CROMRadiologyExam).filter(CROMRadiologyExam.patient_id == patient_id).all()
    return results


@router.put("/{entry_id}", response_model=RadiologyExamRead)
def update_radiology_exam(entry_id: int, entry_data: RadiologyExamUpdate, db: Session = Depends(get_db)):
    entry = db.query(CROMRadiologyExam).filter(CROMRadiologyExam.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")

    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry
