from fastapi import APIRouter
from sqlalchemy import text
from db.engine import engine_prom

router = APIRouter()

@router.get("/api/proms/biopsy/by-external-code/{pid}")
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