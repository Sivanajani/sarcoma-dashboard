from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import CROMPathology

def calculate_pathology_uniqueness(db: Session) -> dict:
    """
    Prüft Duplikate in `croms_pathologies` basierend auf:
    patient_id + data_entry_type + biopsy_resection_date
    """

    total_entries = db.query(CROMPathology).count()

    duplicate_groups = (
        db.query(
            CROMPathology.patient_id,
            func.lower(func.trim(CROMPathology.data_entry_type)).label("entry_type"),
            CROMPathology.biopsy_resection_date,
            func.count().label("count")
        )
        .group_by(
            CROMPathology.patient_id,
            func.lower(func.trim(CROMPathology.data_entry_type)),
            CROMPathology.biopsy_resection_date
        )
        .having(func.count() > 1)
        .all()
    )

    num_duplicates = sum(group.count for group in duplicate_groups)
    num_unique = total_entries - num_duplicates

    uniqueness_percent = round((num_unique / total_entries) * 100, 2) if total_entries else 100.0

    return {
        "module": "pathology",
        "total_entries": total_entries,
        "unique_entries": num_unique,
        "duplicates": num_duplicates,
        "uniqueness_percent": uniqueness_percent,
        "duplicate_groups": [
            {
                "patient_id": group.patient_id,
                "data_entry_type": group.entry_type,
                "biopsy_resection_date": group.biopsy_resection_date.isoformat() if group.biopsy_resection_date else None,
                "count": group.count
            }
            for group in duplicate_groups
        ]
    }


def calculate_pathology_uniqueness_per_patient(db: Session) -> dict:
    """
    Gibt pro Patient:in alle Duplikate der Kombination
    (patient_id, data_entry_type, biopsy_resection_date) zurück.
    """

    duplicate_entries = (
        db.query(
            CROMPathology.patient_id,
            func.lower(func.trim(CROMPathology.data_entry_type)).label("entry_type"),
            CROMPathology.biopsy_resection_date,
            func.count().label("count")
        )
        .group_by(
            CROMPathology.patient_id,
            func.lower(func.trim(CROMPathology.data_entry_type)),
            CROMPathology.biopsy_resection_date
        )
        .having(func.count() > 1)
        .all()
    )

    patient_duplicates = defaultdict(list)

    for entry in duplicate_entries:
        patient_duplicates[entry.patient_id].append({
            "data_entry_type": entry.entry_type,
            "biopsy_resection_date": entry.biopsy_resection_date.isoformat() if entry.biopsy_resection_date else None,
            "count": entry.count
        })

    return {
        "module": "pathology",
        "duplicate_summary_per_patient": [
            {
                "patient_id": pid,
                "duplicate_count": sum([d["count"] for d in duplicates]),
                "duplicates": duplicates
            }
            for pid, duplicates in patient_duplicates.items()
        ]
    }
