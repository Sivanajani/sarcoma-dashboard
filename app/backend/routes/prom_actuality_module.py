from fastapi import APIRouter
from sqlalchemy import text
from db.engine import engine_prom
from utils.prom_actuality.prom_actuality import check_prom_aktualitaet

router = APIRouter()

# Aktualität für alle EQ5D-Einträge
@router.get("/api/proms/eq5d/actuality")
def get_eq5d_actuality():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT * FROM eq5d"))
            rows = result.mappings().all()

        actuality_results = []
        for row in rows:
            status = check_prom_aktualitaet(row.get("date"), "eq5d")
            row_result = dict(row)
            row_result["aktualitaet_status"] = status
            actuality_results.append(row_result)

        return actuality_results

    except Exception as e:
        return {"error": str(e)}

# Aktualität für einen spezifischen EQ5D-Eintrag
@router.get("/api/proms/eq5d/actuality/{pid}")
def get_eq5d_actuality_by_pid(pid: int):
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT * FROM eq5d WHERE pid = :pid"), {"pid": pid})
            row = result.mappings().first()

        if not row:
            return {"message": f"Kein EQ5D-Datensatz für pid {pid} gefunden"}

        status = check_prom_aktualitaet(row.get("date"), "eq5d")
        row_result = dict(row)
        row_result["aktualitaet_status"] = status
        return row_result

    except Exception as e:
        return {"error": str(e)}

# Aktualität für alle Biopsy-Einträge
@router.get("/api/proms/biopsy/actuality")
def get_biopsy_actuality():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT * FROM proms_biopsy"))
            rows = result.mappings().all()

        actuality_results = []
        for row in rows:
            status = check_prom_aktualitaet(row.get("biopsy_date"), "biopsy")
            row_result = dict(row)
            row_result["aktualitaet_status"] = status
            actuality_results.append(row_result)

        return actuality_results

    except Exception as e:
        return {"error": str(e)}

# Aktualität für einen spezifischen Biopsy-Eintrag
@router.get("/api/proms/biopsy/actuality/{pid}")
def get_biopsy_actuality_by_pid(pid: int):
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM proms_biopsy WHERE biopsy_pid = :pid"), {"pid": pid}
            )
            row = result.mappings().first()

        if not row:
            return {"message": f"Kein Biopsy-Datensatz für pid {pid} gefunden"}

        status = check_prom_aktualitaet(row.get("biopsy_date"), "biopsy")
        row_result = dict(row)
        row_result["aktualitaet_status"] = status
        return row_result

    except Exception as e:
        return {"error": str(e)}