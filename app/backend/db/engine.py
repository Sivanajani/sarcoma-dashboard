# backend/db/engine.py

from sqlalchemy import create_engine
import os

# Lokale PostgreSQL-Datenbank (CROMs)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/postgres")
engine_pg = create_engine(DATABASE_URL)

# Externe MySQL-Datenbank (PROMs)
PROM_DB_URL = os.getenv(
    "PROM_DB_URL",
    "postgresql+psycopg2://dbadmin:admin123@db_prom:5432/proms_db"
)
engine_prom = create_engine(PROM_DB_URL)

META_DB_URL = os.getenv(
    "META_DB_URL",
    "postgresql://metaadmin:admin123@postgres-meta:5432/dashboard_meta"
)
engine_meta = create_engine(META_DB_URL)