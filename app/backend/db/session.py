from sqlalchemy.orm import sessionmaker, declarative_base
from .engine import engine_pg, engine_prom, engine_meta  

# Gemeinsame Basisklasse für alle Modelle
Base = declarative_base()

# Session für PostgreSQL-Datenbank (CROMs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_pg)

# Dependency für FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Session für PROMs
SessionPROM = sessionmaker(autocommit=False, autoflush=False, bind=engine_prom)

def get_prom_db():
    db = SessionPROM()
    try:
        yield db
    finally:
        db.close()

# Session für Meta-Datenbank (Alerts, Redflags etc.)
SessionMeta = sessionmaker(autocommit=False, autoflush=False, bind=engine_meta)

def get_meta_db():
    db = SessionMeta()
    try:
        yield db
    finally:
        db.close()