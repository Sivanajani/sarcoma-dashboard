from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import CROMHyperthermiaTherapy

def calculate_hyperthermia_uniqueness(db: Session) -> dict:
    """
    Prüft Duplikate in `croms_hyperthermia_therapies` basierend auf:
    patient_id + start_date + hyperthermia_type
    """

    total_entries = db.query(CROMHyperthermiaTherapy).count()

    duplicate_groups = (
        db.query(
            CROMHyperthermiaTherapy.patient_id,
            CROMHyperthermiaTherapy.start_date,
            func.lower(func.trim(CROMHyperthermiaTherapy.hyperthermia_type)).label("type"),
            func.count().label("count")
        )
        .group_by(
            CROMHyperthermiaTherapy.patient_id,
            CROMHyperthermiaTherapy.start_date,
            func.lower(func.trim(CROMHyperthermiaTherapy.hyperthermia_type))
        )
        .having(func.count() > 1)
        .all()
    )

    num_duplicates = sum(group.count for group in duplicate_groups)
    num_unique = total_entries - num_duplicates

    uniqueness_percent = round((num_unique / total_entries) * 100, 2) if total_entries else 100.0

    return {
        "module": "hyperthermia_therapy",
        "total_entries": total_entries,
        "unique_entries": num_unique,
        "duplicates": num_duplicates,
        "uniqueness_percent": uniqueness_percent,
        "duplicate_groups": [
            {
                "patient_id": group.patient_id,
                "start_date": group.start_date.isoformat() if group.start_date else None,
                "hyperthermia_type": group.type,
                "count": group.count
            }
            for group in duplicate_groups
        ]
    }

def calculate_hyperthermia_uniqueness_per_patient(db: Session) -> dict:
    """
    Gibt pro Patient:in alle Duplikate der Kombination
    (patient_id, start_date, hyperthermia_type) zurück.
    """

    duplicate_entries = (
        db.query(
            CROMHyperthermiaTherapy.patient_id,
            CROMHyperthermiaTherapy.start_date,
            func.lower(func.trim(CROMHyperthermiaTherapy.hyperthermia_type)).label("type"),
            func.count().label("count")
        )
        .group_by(
            CROMHyperthermiaTherapy.patient_id,
            CROMHyperthermiaTherapy.start_date,
            func.lower(func.trim(CROMHyperthermiaTherapy.hyperthermia_type))
        )
        .having(func.count() > 1)
        .all()
    )

    patient_duplicates = defaultdict(list)

    for entry in duplicate_entries:
        patient_duplicates[entry.patient_id].append({
            "start_date": entry.start_date.isoformat() if entry.start_date else None,
            "hyperthermia_type": entry.type,
            "count": entry.count
        })

    return {
        "module": "hyperthermia_therapy",
        "duplicate_summary_per_patient": [
            {
                "patient_id": pid,
                "duplicate_count": sum([d["count"] for d in duplicates]),
                "duplicates": duplicates
            }
            for pid, duplicates in patient_duplicates.items()
        ]
    }
