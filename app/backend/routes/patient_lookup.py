# Datei: routes/patient_lookup.py

from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg, engine_prom

router = APIRouter(prefix="/api")

@router.get("/patients/by-external-code/{code}")
def get_patient_by_external_code(code: str):
    try:
        # 1. Suche in CROMs nach external_code
        with engine_pg.connect() as conn:
            result = conn.execute(
                text("SELECT id, external_code FROM croms_patients WHERE external_code = :code"),
                {"code": code}
            ).mappings().fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Patient not found in CROMs")

        patient_id = result["id"]
        external_code = result["external_code"]

        # 2. Gibt es PROMs für diesen external_code?
        with engine_prom.connect() as conn:
            prom_check = conn.execute(
                text("SELECT 1 FROM personal_data WHERE pid = :code LIMIT 1"),
                {"code": external_code}
            ).fetchone()
            has_proms = prom_check is not None

        # 3. Gibt es CROMs (Diagnosen)?
        with engine_pg.connect() as conn:
            crom_check = conn.execute(
                text("SELECT 1 FROM croms_diagnoses WHERE patient_id = :id LIMIT 1"),
                {"id": patient_id}
            ).fetchone()
            has_croms = crom_check is not None

        return {
            "id": patient_id,
            "patient_id": external_code,
            "has_croms": has_croms,
            "has_proms": has_proms
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patient-lookup/{pid}")
def lookup_patient(pid: str):
    try:
        # CROMs: Suche nach external_code = pid
        with engine_pg.connect() as conn_pg:
            crom_result = conn_pg.execute(
                text("SELECT id FROM croms_patients WHERE external_code = :pid"),
                {"pid": pid}
            ).mappings().fetchone()

        # PROMs: Suche nach pid = pid (Primärschlüssel!)
        with engine_prom.connect() as conn_prom:
            prom_result = conn_prom.execute(
                text("SELECT pid FROM personal_data WHERE pid = :pid"),
                {"pid": pid}
            ).mappings().fetchone()

        if not crom_result and not prom_result:
            raise HTTPException(status_code=404, detail="Patient not found")

        return {
            "has_croms": crom_result is not None,
            "has_proms": prom_result is not None,
            "patient_id": pid,
            "croms_id": crom_result["id"] if crom_result else None,
            "proms_id": prom_result["pid"] if prom_result else None
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

