from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_prom, engine_pg  

router = APIRouter(prefix="/api/proms")

# Liste aller PROM-Patient:innen
@router.get("/patients")
def get_prom_patients():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT row_id, pid FROM personal_data"))
            patients = [
                {
                    "id": row["row_id"],
                    "patient_id": row['pid']
                }
                for row in result.mappings()
            ]
        return patients
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PROM-Patientenzahl
@router.get("/patient-count")
def get_prom_patient_count():
    try:
        with engine_prom.connect() as conn:
            result = conn.execute(text("SELECT COUNT(*) FROM personal_data"))
            count = result.scalar()
        return {"patient_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Patient-Detailinfo via PROM-ID (external_code)
@router.get("/patient-info/{pid}")
def get_patient_info_from_prom(pid: str):
    try:
        # 1. PROM prüfen – gibt es pid in personal_data?
        with engine_prom.connect() as conn:
            prom_result = conn.execute(
                text("SELECT pid FROM personal_data WHERE pid = :pid"),
                {"pid": pid}
            ).mappings().fetchone()
            has_proms = prom_result is not None

        # 2. CROM prüfen – gibt es diesen Code in croms_patients.external_code?
        with engine_pg.connect() as conn:
            crom_result = conn.execute(
                text("SELECT id FROM croms_patients WHERE external_code = :code"),
                {"code": pid}
            ).mappings().fetchone()
            has_croms = crom_result is not None
            crom_id = crom_result["id"] if crom_result else None

        if not has_proms and not has_croms:
            raise HTTPException(status_code=404, detail="Patient not found in PROMs or CROMs")

        return {
            "patient_id": pid,
            "id": crom_id,  
            "has_proms": has_proms,
            "has_croms": has_croms
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))