# utils/crom_uniqueness/crom_surgeries_uniqueness.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import CROMSurgery

def calculate_surgery_uniqueness(db: Session) -> dict:
    """
    Prüft Duplikate in `croms_surgeries` basierend auf:
    patient_id + surgery_date + anatomic_region
    """

    total_entries = db.query(CROMSurgery).count()

    duplicate_groups = (
        db.query(
            CROMSurgery.patient_id,
            CROMSurgery.surgery_date,
            func.lower(func.trim(CROMSurgery.anatomic_region)).label("region"),
            func.count().label("count")
        )
        .group_by(
            CROMSurgery.patient_id,
            CROMSurgery.surgery_date,
            func.lower(func.trim(CROMSurgery.anatomic_region))
        )
        .having(func.count() > 1)
        .all()
    )

    num_duplicates = sum(group.count for group in duplicate_groups)
    num_unique = total_entries - num_duplicates

    uniqueness_percent = round((num_unique / total_entries) * 100, 2) if total_entries else 100.0

    return {
        "module": "surgery",
        "total_entries": total_entries,
        "unique_entries": num_unique,
        "duplicates": num_duplicates,
        "uniqueness_percent": uniqueness_percent,
        "duplicate_groups": [
            {
                "patient_id": group.patient_id,
                "surgery_date": group.surgery_date.isoformat(),
                "anatomic_region": group.region,
                "count": group.count
            }
            for group in duplicate_groups
        ]
    }

def calculate_surgery_uniqueness_per_patient(db: Session) -> dict:
    """
    Gibt pro Patient:in alle Duplikate der Kombination
    (patient_id, surgery_date, anatomic_region) zurück.
    """

    duplicate_entries = (
        db.query(
            CROMSurgery.patient_id,
            CROMSurgery.surgery_date,
            func.lower(func.trim(CROMSurgery.anatomic_region)).label("region"),
            func.count().label("count")
        )
        .group_by(
            CROMSurgery.patient_id,
            CROMSurgery.surgery_date,
            func.lower(func.trim(CROMSurgery.anatomic_region))
        )
        .having(func.count() > 1)
        .all()
    )

    patient_duplicates = defaultdict(list)

    for entry in duplicate_entries:
        patient_duplicates[entry.patient_id].append({
            "surgery_date": entry.surgery_date.isoformat(),
            "anatomic_region": entry.region,
            "count": entry.count
        })

    return {
        "module": "surgery",
        "duplicate_summary_per_patient": [
            {
                "patient_id": pid,
                "duplicate_count": sum([d["count"] for d in duplicates]),
                "duplicates": duplicates
            }
            for pid, duplicates in patient_duplicates.items()
        ]
    }
