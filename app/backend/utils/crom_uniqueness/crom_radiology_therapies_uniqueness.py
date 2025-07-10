from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import CROMRadiologyTherapy

def calculate_radiology_therapy_uniqueness(db: Session) -> dict:
    """
    Prüft Duplikate in `croms_radiology_therapies` basierend auf:
    patient_id + therapy_start_date + therapy_type
    """

    total_entries = db.query(CROMRadiologyTherapy).count()

    duplicate_groups = (
        db.query(
            CROMRadiologyTherapy.patient_id,
            CROMRadiologyTherapy.therapy_start_date,
            func.lower(func.trim(CROMRadiologyTherapy.therapy_type)).label("therapy_type"),
            func.count().label("count")
        )
        .group_by(
            CROMRadiologyTherapy.patient_id,
            CROMRadiologyTherapy.therapy_start_date,
            func.lower(func.trim(CROMRadiologyTherapy.therapy_type))
        )
        .having(func.count() > 1)
        .all()
    )

    num_duplicates = sum(group.count for group in duplicate_groups)
    num_unique = total_entries - num_duplicates

    uniqueness_percent = round((num_unique / total_entries) * 100, 2) if total_entries else 100.0

    return {
        "module": "radiology_therapy",
        "total_entries": total_entries,
        "unique_entries": num_unique,
        "duplicates": num_duplicates,
        "uniqueness_percent": uniqueness_percent,
        "duplicate_groups": [
            {
                "patient_id": group.patient_id,
                "therapy_start_date": group.therapy_start_date.isoformat(),
                "therapy_type": group.therapy_type,
                "count": group.count
            }
            for group in duplicate_groups
        ]
    }

def calculate_radiology_therapy_uniqueness_per_patient(db: Session) -> dict:
    """
    Gibt pro Patient:in alle Duplikate der Kombination
    (patient_id, therapy_start_date, therapy_type) zurück.
    """

    duplicate_entries = (
        db.query(
            CROMRadiologyTherapy.patient_id,
            CROMRadiologyTherapy.therapy_start_date,
            func.lower(func.trim(CROMRadiologyTherapy.therapy_type)).label("therapy_type"),
            func.count().label("count")
        )
        .group_by(
            CROMRadiologyTherapy.patient_id,
            CROMRadiologyTherapy.therapy_start_date,
            func.lower(func.trim(CROMRadiologyTherapy.therapy_type))
        )
        .having(func.count() > 1)
        .all()
    )

    patient_duplicates = defaultdict(list)

    for entry in duplicate_entries:
        patient_duplicates[entry.patient_id].append({
            "therapy_start_date": entry.therapy_start_date.isoformat(),
            "therapy_type": entry.therapy_type,
            "count": entry.count
        })

    return {
        "module": "radiology_therapy",
        "duplicate_summary_per_patient": [
            {
                "patient_id": pid,
                "duplicate_count": sum([d["count"] for d in duplicates]),
                "duplicates": duplicates
            }
            for pid, duplicates in patient_duplicates.items()
        ]
    }
