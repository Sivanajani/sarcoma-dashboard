from sqlalchemy.orm import sessionmaker, declarative_base
from .engine import engine_pg, engine_prom  

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