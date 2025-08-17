from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import CROMDiagnosis

def calculate_diagnosis_uniqueness(db: Session) -> dict:
    """
    Prüft auf doppelte Einträge in `croms_diagnoses` basierend auf
    patient_id + tumor_diagnosis (ignoriere Gross-/Kleinschreibung und Whitespace).
    """

    total_entries = db.query(CROMDiagnosis).count()

    duplicate_groups = (
        db.query(
            CROMDiagnosis.patient_id,
            func.lower(func.trim(CROMDiagnosis.tumor_diagnosis)).label("normalized_diagnosis"),
            func.count().label("count")
        )
        .group_by(
            CROMDiagnosis.patient_id,
            func.lower(func.trim(CROMDiagnosis.tumor_diagnosis))
        )
        .having(func.count() > 1)
        .all()
    )

    num_duplicates = sum(group.count for group in duplicate_groups)
    num_unique = total_entries - num_duplicates

    uniqueness_percent = round((num_unique / total_entries) * 100, 2) if total_entries else 100.0

    return {
        "module": "diagnosis",
        "total_entries": total_entries,
        "unique_entries": num_unique,
        "duplicates": num_duplicates,
        "uniqueness_percent": uniqueness_percent,
        "duplicate_groups": [
            {
                "patient_id": group.patient_id,
                "tumor_diagnosis": group.normalized_diagnosis,
                "count": group.count
            }
            for group in duplicate_groups
        ]
    }


def calculate_diagnosis_uniqueness_per_patient(db: Session) -> dict:
    """
    Gibt je Patient:in alle Duplikate der Kombination patient_id + tumor_diagnosis
    (Gross-/Kleinschreibung und Whitespace ignorierend).
    """

    duplicate_entries = (
        db.query(
            CROMDiagnosis.patient_id,
            func.lower(func.trim(CROMDiagnosis.tumor_diagnosis)).label("normalized_diagnosis"),
            func.count().label("count")
        )
        .group_by(
            CROMDiagnosis.patient_id,
            func.lower(func.trim(CROMDiagnosis.tumor_diagnosis))
        )
        .having(func.count() > 1)
        .all()
    )

    patient_duplicates = defaultdict(list)

    for entry in duplicate_entries:
        patient_duplicates[entry.patient_id].append({
            "tumor_diagnosis": entry.normalized_diagnosis,
            "count": entry.count
        })

    return {
        "module": "diagnosis",
        "duplicate_summary_per_patient": [
            {
                "patient_id": pid,
                "duplicate_count": sum([d["count"] for d in duplicates]),
                "duplicates": duplicates
            }
            for pid, duplicates in patient_duplicates.items()
        ]
    }
