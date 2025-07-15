from fastapi import APIRouter
from sqlalchemy import inspect
from db.engine import engine_prom

router = APIRouter()

@router.get("/api/proms/tables")
def list_prom_tables():
    inspector = inspect(engine_prom)
    tables = inspector.get_table_names()
    return {"prom_tables": tables}
