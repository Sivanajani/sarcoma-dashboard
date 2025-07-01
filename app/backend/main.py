from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.engine import engine_pg, engine_mysql
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
import os
from routes.crom_avg_completeness import router as crom_completeness_router
from routes.crom_completness_module import router as crom_module_metrics_router


app = FastAPI()

# CORS Middleware aktivieren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crom_module_metrics_router)

# Tabellen anzeigen
@app.get("/api/tables")
def list_tables():
    with engine_pg.connect() as conn:
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
    with engine_pg.connect() as connection:
        result = connection.execute(text("SELECT COUNT(*) FROM croms_patients")) 
        count = result.scalar()
    return {"patient_count": count}

# JSON-Liste mit allen patient_id
@app.get("/api/patients")
def get_patients():
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(text("SELECT id, external_code FROM croms_patients"))
            patients = [
                {
                    "id": row["id"],
                    "patient_id": row["external_code"]
                }
                for row in result.mappings()  # <- hier ist der Fix
            ]
        return patients
    except Exception as e:
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
        "hyperthermia": ("croms_hyperthermia_therapies", "patient_id"),
        "patient": ("croms_patients", "id"),
    }

    modules = {}

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
        with engine_pg.connect() as conn:
            result = conn.execute(text("SELECT * FROM croms_patients LIMIT 1"))
            columns = list(result.keys()) 
        return {"columns": columns}
    except Exception as e:
        print("Fehler in /api/patients-debug:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/debug/table-columns")
def get_all_table_columns():
    try:
        with engine_pg.connect() as conn:
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

@app.get("/api/debug/field-values/{table}/{column}")
def get_distinct_field_values(table: str, column: str):
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(
                text(f"SELECT DISTINCT {column} FROM {table}")
            )
            values = [row[0] for row in result]
        return {"table": table, "column": column, "values": values}
    except Exception as e:
        print(f"Fehler beim Abrufen von Werten für {table}.{column}:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/debug/column-values")
def get_column_values(table: str, column: str):
    with engine_pg.connect() as conn:
        result = conn.execute(text(f"""
            SELECT DISTINCT {column}
            FROM {table}
            WHERE {column} IS NOT NULL
        """))
        values = [row[0] for row in result]
    return {"table": table, "column": column, "values": values}



@app.get("/api/prom-tables")
def get_prom_tables():
    try:
        with engine_mysql.connect() as conn:
            result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
        return {"prom_tables": tables}
    except SQLAlchemyError as e:
        print(f"Fehler bei der Verbindung zur PROMs-Datenbank: {e}")
        raise HTTPException(status_code=500, detail="Fehler beim Abrufen der Tabellen")
    

@app.get("/api/proms/{table}")
def get_prom_table_data(table: str):
    try:
        with engine_mysql.connect() as conn:
            result = conn.execute(text(f"SELECT * FROM `{table}` LIMIT 100"))
            rows = [dict(row._mapping) for row in result]
        return {"table": table, "rows": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

app.include_router(crom_completeness_router)

# external_code abrufen
@app.get("/api/patients/{id}")
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


