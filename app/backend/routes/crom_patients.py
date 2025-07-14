from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_pg
import requests

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


@router.get("/patients/by-external-code/{external_code}/diagnosis/details")
def get_diagnosis_detail_by_external_code(external_code: str):
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(
                text("SELECT id FROM croms_patients WHERE external_code = :code"),
                {"code": external_code}
            ).mappings().fetchone()

            if not result:
                raise HTTPException(status_code=404, detail="Patient nicht gefunden")

            return get_patients_diagnosis_detail(result["id"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patients/{patient_id}/diagnosis/details")
def get_patients_diagnosis_detail(patient_id: str):
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM croms_diagnoses WHERE patient_id = :pid"),
                {"pid": patient_id}
            )
            row = result.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Diagnose nicht gefunden")
            field_values = dict(row._mapping)

        # Endpunkte abrufen
        base_url = "http://localhost:8000"
        try:
            correctness = requests.get(f"{base_url}/api/patients/{patient_id}/correctness/diagnosis").json()["field_results"]
        except:
            correctness = {}

        try:
            consistency = requests.get(f"{base_url}/api/patients/{patient_id}/consistency/diagnosis").json()["rule_results"]
        except:
            consistency = {}

        try:
            actuality = requests.get(f"{base_url}/api/patients/{patient_id}/actuality/diagnosis").json()["details"]
        except:
            actuality = {}

        try:
            completeness = requests.get(f"{base_url}/patients/{patient_id}/completeness/diagnosis").json()
        except:
            completeness = {}

        return {
            "module": "diagnosis",
            "patient_id": patient_id,
            "field_values": field_values,
            "correctness": correctness,
            "consistency": consistency,
            "actuality": actuality,
            "completeness": completeness
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
