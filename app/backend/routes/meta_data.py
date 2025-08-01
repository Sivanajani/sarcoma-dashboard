# backend/routes/meta_debug.py

from fastapi import APIRouter
from sqlalchemy import inspect
from db.engine import engine_meta

router = APIRouter(prefix="/api")

@router.get("/meta/tables")
def list_meta_tables():
    inspector = inspect(engine_meta)
    table_names = inspector.get_table_names()
    return {"meta_tables": table_names}
