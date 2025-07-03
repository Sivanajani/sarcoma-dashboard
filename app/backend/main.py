from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.engine import engine_pg, engine_mysql
from sqlalchemy import text
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
import os
from routes.crom_avg_completeness import router as crom_completeness_router
from routes.crom_completness_module import router as crom_module_metrics_router
from routes.crom_tables import router as crom_tables_router
from routes.crom_patients import router as crom_patients_router
from routes import crom_correctness_module



app = FastAPI()

# CORS Middleware aktivieren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Durschnitt Berechnung von der Vollstädnigkeit
app.include_router(crom_completeness_router)

# Vollständigkeit pro Modul
app.include_router(crom_module_metrics_router)

# Korrektheit pro Modul
app.include_router(crom_correctness_module.router)

# Tabellen anzeigen
app.include_router(crom_tables_router)

# Patientenanzahl in CROM und JSON-Liste mit allen patient_id etc.
app.include_router(crom_patients_router)


#für Prom Daten
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