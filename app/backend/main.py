from fastapi import FastAPI
from sqlalchemy import create_engine, text
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi import HTTPException

app = FastAPI()

# CORS Middleware aktivieren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Datenbankverbindung
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/postgres")
engine = create_engine(DATABASE_URL)

# Tabellen anzeigen
@app.get("/api/tables")
def list_tables():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT tablename 
            FROM pg_catalog.pg_tables 
            WHERE schemaname = 'public'
        """))
        tables = [row[0] for row in result]
    return {"tables": tables}

# Patientenzahl abrufen
@app.get("/api/patient-count")
def get_patient_count():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT COUNT(*) FROM croms_patients")) 
        count = result.scalar()
    return {"patient_count": count}


# JSON-Liste mit allen patient_id
@app.get("/api/patients")
def get_patients():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT id FROM croms_patients"))
            patients = [{"patient_id": row[0]} for row in result]
        return patients
    except Exception as e:
        print("Fehler beim Abrufen der Patienten:", e)
        raise HTTPException(status_code=500, detail=str(e))

# unterschiedlichen Spaltennamen berücksichtigt    
@app.get("/api/patients/{patient_id}/modules")
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
        # Hyperthermia hat KEIN patient_id → explizit behandeln
        "hyperthermia": (None, None)
    }

    modules = {}

    try:
        with engine.connect() as conn:
            for module_name, (table_name, patient_column) in module_queries.items():
                if not table_name or not patient_column:
                    modules[module_name] = "Nicht verknüpft (z. B. fehlende patient_id)"
                    continue

                result = conn.execute(
                    text(f"SELECT * FROM {table_name} WHERE {patient_column} = :pid LIMIT 1"),
                    {"pid": patient_id}
                ).fetchone()

                if result:
                    modules[module_name] = dict(result._mapping)

        return {
            "patient_id": patient_id,
            "modules": modules
        }

    except Exception as e:
        print(f"Fehler beim Abrufen von Modulen für Patient {patient_id}:", e)
        raise HTTPException(status_code=500, detail=str(e))


# Debug
@app.get("/api/patients-debug")
def get_patients_debug():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM croms_patients LIMIT 1"))
            columns = list(result.keys()) 
        return {"columns": columns}
    except Exception as e:
        print("Fehler in /api/patients-debug:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/debug/table-columns")
def get_all_table_columns():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT tablename 
                FROM pg_catalog.pg_tables 
                WHERE schemaname = 'public'
            """))
            tables = [row[0] for row in result]

            table_columns = {}

            for table in tables:
                try:
                    col_result = conn.execute(text(f"""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name = :tname
                    """), {"tname": table})
                    columns = [row[0] for row in col_result]
                    table_columns[table] = columns
                except Exception as e:
                    table_columns[table] = [f"Fehler beim Abrufen: {str(e)}"]

            return table_columns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
