from fastapi import APIRouter
from sqlalchemy import text
from db.engine import engine_prom
from utils.prom_completeness.eq5d_completeness import calculate_eq5d_completeness
from utils.prom_completeness.biopsy_completeness import calculate_biopsy_completeness
from utils.prom_completeness.personal_completeness import calculate_personal_data_completeness

router = APIRouter()

# Get EQ5D completeness for all patients
@router.get("/api/proms/eq5d/completeness")
def get_eq5d_completeness():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT * FROM eq5d"))
            rows = result.mappings().all()

        completeness_results = [calculate_eq5d_completeness(row) for row in rows]
        return completeness_results

    except Exception as e:
        return {"error": str(e)}

# Get EQ5D completeness for a specific patient by pid
@router.get("/api/proms/eq5d/completeness/{pid}")
def get_eq5d_completeness_by_pid(pid: str):
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM eq5d WHERE pid = :pid"),
                {"pid": pid}
            )
            row = result.mappings().all()

        if not row:
            return {"message": f"No EQ5D entry found for pid {pid}"}

        return [calculate_eq5d_completeness(row) for row in row]

    except Exception as e:
        return {"error": str(e)}

# Get biopsy completeness for all patients
@router.get("/api/proms/biopsy/completeness")
def get_biopsy_completeness():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT * FROM proms_biopsy"))
            rows = result.mappings().all()

        completeness_results = [calculate_biopsy_completeness(row) for row in rows]
        return completeness_results

    except Exception as e:
        return {"error": str(e)}

# Get biopsy completeness for a specific patient by pid
@router.get("/api/proms/biopsy/completeness/{pid}")
def get_biopsy_completeness_by_pid(pid: str):
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM proms_biopsy WHERE biopsy_pid = :pid"),
                {"pid": pid}
            )
            row = result.mappings().all()

        if not row:
            return {"message": f"No Biopsy entry found for pid {pid}"}

        return [calculate_biopsy_completeness(row) for row in row]

    except Exception as e:
        return {"error": str(e)}
    
# Get personal data completeness for all patients
@router.get("/api/proms/personal/completeness")
def get_personal_completeness():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT * FROM personal_data"))
            rows = result.mappings().all()

        completeness_results = [calculate_personal_data_completeness(row) for row in rows]
        return completeness_results

    except Exception as e:
        return {"error": str(e)}

# Get personal data completeness for a specific patient by pid
@router.get("/api/proms/personal/completeness/{pid}")
def get_personal_completeness_by_pid(pid: str):
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM personal_data WHERE pid = :pid"),
                {"pid": pid}
            )
            row = result.mappings().first()

        if not row:
            return {"message": f"No Personal entry found for pid {pid}"}

        return calculate_personal_data_completeness(row)

    except Exception as e:
        return {"error": str(e)}