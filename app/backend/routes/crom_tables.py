from fastapi import APIRouter
from sqlalchemy import text
from db.engine import engine_pg

router = APIRouter(prefix="/api")

@router.get("/tables")
def list_tables():
    with engine_pg.connect() as conn:
        result = conn.execute(text("""
            SELECT tablename 
            FROM pg_catalog.pg_tables 
            WHERE schemaname = 'public'
        """))
        tables = [row[0] for row in result]
    return {"tables": tables}

# Sagt mir welche Spalten croms_patients hat
@router.get("/patients-debug")
def get_patients_debug():
    try:
        with engine_pg.connect() as conn:
            result = conn.execute(text("SELECT * FROM croms_patients LIMIT 1"))
            columns = list(result.keys()) 
        return {"columns": columns}
    except Exception as e:
        print("Fehler in /api/patients-debug:", e)
        raise HTTPException(status_code=500, detail=str(e))

# Alle Spaltennamen von allen Tabellen
@router.get("/debug/table-columns")
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
    
#Von ausgewählter Tabelle werden alle Werte der ausgewählten Spalte ausgegeben
@router.get("/debug/field-values/{table}/{column}")
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