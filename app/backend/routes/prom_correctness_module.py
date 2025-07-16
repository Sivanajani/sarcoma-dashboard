from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_prom_db
from models_prom import Eq5d
from utils.prom_correctness.eq5d_correctness import check_eq5d_correctness

router = APIRouter()

@router.get("/api/patients/{pid}/correctness/eq5d")
def get_eq5d_correctness_for_patient(pid: int, db: Session = Depends(get_prom_db)):
    record = db.query(Eq5d).filter(Eq5d.pid == pid).order_by(Eq5d.date.desc()).first()
    if not record:
        raise HTTPException(status_code=404, detail="Kein EQ5D-Datensatz für diese PID gefunden")
    
    data = record.__dict__
    result = check_eq5d_correctness(data)
    return result


@router.get("/api/correctness/eq5d/all")
def get_eq5d_correctness_all(db: Session = Depends(get_prom_db)):
    records = db.query(Eq5d).all()
    results = []
    for record in records:
        data = record.__dict__
        result = check_eq5d_correctness(data)
        result["pid"] = record.pid
        result["date"] = record.date
        results.append(result)
    return results
