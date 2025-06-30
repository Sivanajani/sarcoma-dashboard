# backend/db/engine.py

from sqlalchemy import create_engine
import os

# Lokale PostgreSQL-Datenbank (CROMs)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/postgres")
engine_pg = create_engine(DATABASE_URL)

# Externe MySQL-Datenbank (PROMs)
PROM_DB_URL = os.getenv("PROM_DB_URL")
engine_mysql = create_engine(PROM_DB_URL)
