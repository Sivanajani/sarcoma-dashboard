from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from db.session import get_prom_db
from models_prom import Eq5d
from db.engine import engine_prom
from schemas import Eq5dRead, Eq5dUpdate

router = APIRouter(prefix="/api", tags=["eq5d"])

@router.get("/proms/eq5d/by-external-code/{pid}")
def get_eq5d_entries_by_external_pid(pid: str):
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(
                text("""
                    SELECT * FROM eq5d
                    WHERE pid = :pid
                    ORDER BY date ASC
                """),
                {"pid": pid}
            )
            rows = result.mappings().all()
        return [dict(row) for row in rows]
    except Exception as e:
        return {"error": str(e)}

# GET: Alle EQ5D-Einträge für einen Patienten (über PID)
@router.get("/eq5d/by-pid/{pid}", response_model=list[Eq5dRead])
def get_eq5d_by_pid(pid: str, db: Session = Depends(get_prom_db)):
    results = db.query(Eq5d).filter(Eq5d.pid == pid).order_by(Eq5d.date.asc()).all()
    return results

# PUT: EQ5D-Eintrag aktualisieren
@router.put("/eq5d/{entry_id}", response_model=Eq5dRead)
def update_eq5d_entry(entry_id: int, entry_data: Eq5dUpdate, db: Session = Depends(get_prom_db)):
    entry = db.query(Eq5d).filter(Eq5d.row_id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry
