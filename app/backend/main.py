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
