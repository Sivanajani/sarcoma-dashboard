from sqlalchemy.orm import sessionmaker, declarative_base
from .engine import engine_pg  # nur für die PostgreSQL-Verbindung

# Gemeinsame Basisklasse für alle Modelle
Base = declarative_base()

# Session-Factory für PostgreSQL
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_pg)

# Dependency für FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
