from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from db.engine import engine_prom
from db.session import get_prom_db
from models_prom import Biopsy
from schemas import PromsBiopsyRead, PromsBiopsyUpdate

router = APIRouter(prefix="/api", tags=["biopsy"])

@router.get("/proms/biopsy/by-external-code/{pid}")
def get_biopsy_entries_by_external_pid(pid: str):
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(
                text("""
                    SELECT * FROM proms_biopsy
                    WHERE biopsy_pid = :pid
                    ORDER BY biopsy_date ASC
                """),
                {"pid": pid}
            )
            rows = result.mappings().all()
        return [dict(row) for row in rows]
    except Exception as e:
        return {"error": str(e)}
    
# GET: Alle Biopsy-Einträge für einen Patienten (über PID)
@router.get("/biopsy/by-pid/{pid}", response_model=list[PromsBiopsyRead])
def get_biopsy_by_pid(pid: str, db: Session = Depends(get_prom_db)):
    results = db.query(Biopsy).filter(Biopsy.biopsy_pid == pid).order_by(Biopsy.biopsy_date.asc()).all()
    return results

# PUT: Biopsy-Eintrag aktualisieren
@router.put("/biopsy/{entry_id}", response_model=PromsBiopsyRead)
def update_biopsy_entry(entry_id: int, entry_data: PromsBiopsyUpdate, db: Session = Depends(get_prom_db)):
    entry = db.query(Biopsy).filter(Biopsy.biopsy_row_id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    
    for field, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry