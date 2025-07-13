from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg

router = APIRouter(prefix="/api")

# JSON-Liste mit allen patient_id
@router.get("/patients")
def get_patients():
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(text("SELECT id, external_code, birth_date FROM croms_patients"))
            patients = [
                {
                    "id": row["id"],
                    "patient_id": row["external_code"]
                }
                for row in result.mappings()
            ]
        return patients
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Patientenzahl abrufen
@router.get("/patient-count")
def get_patient_count():
    with engine_pg.connect() as connection:
        result = connection.execute(text("SELECT COUNT(*) FROM croms_patients")) 
        count = result.scalar()
    return {"patient_count": count}

# Module von Patient mit patient id...?   
@router.get("/patients/{patient_id}/modules")
def get_patient_modules(patient_id: int):
    # Tabelle + Spalte der Patienten-ID pro Modul
    module_queries = {
        "surgery": ("croms_surgeries", "patient_id"),
        "diagnosis": ("croms_diagnoses", "patient_id"),
        "radiology_exam": ("croms_radiology_exams", "patient_id"),
        "radiology_therapy": ("croms_radiology_therapies", "patient_id"),
        "systemic_therapy": ("croms_systemic_therapies", "patient_id"),
        "pathology": ("croms_pathologies", "patient_id"),
        "sarcoma_board": ("croms_sarcoma_boards", "patient_id"),
        "hyperthermia": ("croms_hyperthermia_therapies", "patient_id"),
        "patient": ("croms_patients", "id"),
    }

    modules = {}
    birth_date = None

    try:
        with engine_pg.connect() as conn:
            for module_name, (table_name, patient_column) in module_queries.items():
                if not table_name or not patient_column:
                    modules[module_name] = "Nicht verknüpft (z. B. fehlende patient_id)"
                    continue

                result = conn.execute(
                    text(f"SELECT * FROM {table_name} WHERE {patient_column} = :pid LIMIT 1"),
                    {"pid": patient_id}
                ).fetchone()

                if result:
                    data = dict(result._mapping)
                    if module_name == "patient" and "birth_date" in data:
                        birth_date = data["birth_date"]
                    modules[module_name] = data
                    

        return {
            "patient_id": patient_id,
            "birth_date": birth_date,
            "modules": modules
        }

    except Exception as e:
        print(f"Fehler beim Abrufen von Modulen für Patient {patient_id}:", e)
        raise HTTPException(status_code=500, detail=str(e))
    

# external_code abrufen
@router.get("/patients/{id}")
def get_patient_by_id(id: int):
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(
                text("SELECT id, external_code FROM croms_patients WHERE id = :id"),
                {"id": id}
            ).mappings().fetchone()

            if not result:
                raise HTTPException(status_code=404, detail="Patient not found")

            return {
                "id": result["id"],
                "patient_id": result["external_code"]
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# external_code abrufen und Module für diesen Patienten
@router.get("/patients/by-external-code/{external_code}")
def get_patient_modules_by_external_code(external_code: str):
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(
                text("SELECT id FROM croms_patients WHERE external_code = :code"),
                {"code": external_code}
            ).mappings().fetchone()

            if not result:
                raise HTTPException(status_code=404, detail="Patient not found")

            patient_id = result["id"]

        # Nutze einfach deinen bestehenden Endpunkt /patients/{id}/modules intern
        return get_patient_modules(patient_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Module aktualisieren
@router.put("/croms/{module}/{id}")
def update_crom_module(module: str, id: int, data: dict):
    try:
        table_name = f"croms_{module}"
        if not data:
            raise HTTPException(status_code=400, detail="Leerer Payload")

        set_clause = ", ".join([f"{key} = :{key}" for key in data.keys()])
        sql = f"UPDATE {table_name} SET {set_clause} WHERE id = :id"
        data["id"] = id  # ID hinzufügen

        with engine_pg.begin() as conn:
            result = conn.execute(text(sql), data)

        return {"status": "success", "updated_id": id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))