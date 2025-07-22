from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_prom_db
from models_prom import Eq5d, Biopsy
from utils.prom_consistency.biopsy_consistency import check_biopsy_consistency
from utils.prom_consistency.eq5d_consistency import check_eq5d_consistency

router = APIRouter()

# Route für Konsistenzcheck EQ5D – einzelne Person
@router.get("/api/patients/{pid}/consistency/eq5d")
def get_eq5d_consistency_for_patient(pid: str, db: Session = Depends(get_prom_db)):
    record = db.query(Eq5d).filter(Eq5d.pid == pid).order_by(Eq5d.date.desc()).first()
    if not record:
        raise HTTPException(status_code=404, detail="Kein EQ5D-Datensatz für diese PID gefunden")
    
    data = record.__dict__
    result = check_eq5d_consistency(data)
    return result

# Route für Konsistenzcheck EQ5D – alle
@router.get("/api/consistency/eq5d/all")
def get_eq5d_consistency_all(db: Session = Depends(get_prom_db)):
    records = db.query(Eq5d).all()
    results = []
    for record in records:
        data = record.__dict__
        result = check_eq5d_consistency(data)
        result["pid"] = record.pid
        result["date"] = record.date
        results.append(result)
    return results

# Route für Konsistenzcheck Biopsy – einzelne Person
@router.get("/api/patients/{pid}/consistency/biopsy")
def get_biopsy_consistency_for_patient(pid: str, db: Session = Depends(get_prom_db)):
    record = db.query(Biopsy).filter(Biopsy.biopsy_pid == pid).order_by(Biopsy.biopsy_date.desc()).first()
    if not record:
        raise HTTPException(status_code=404, detail="Kein Biopsy-Datensatz für diese PID gefunden")
    
    data = record.__dict__
    result = check_biopsy_consistency(data)
    return result

# Route für Konsistenzcheck Biopsy – alle
@router.get("/api/consistency/biopsy/all")
def get_biopsy_consistency_all(db: Session = Depends(get_prom_db)):
    records = db.query(Biopsy).all()
    results = []
    for record in records:
        data = record.__dict__
        result = check_biopsy_consistency(data)
        result["pid"] = record.biopsy_pid
        result["date"] = record.biopsy_date
        results.append(result)
    return results