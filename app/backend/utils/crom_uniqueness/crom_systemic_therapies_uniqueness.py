from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import CROMSystemicTherapy

def calculate_systemic_therapy_uniqueness(db: Session) -> dict:
    """
    Prüft Duplikate in `croms_systemic_therapies` basierend auf:
    patient_id + treatment_line
    """

    total_entries = db.query(CROMSystemicTherapy).count()

    duplicate_groups = (
        db.query(
            CROMSystemicTherapy.patient_id,
            CROMSystemicTherapy.treatment_line,
            CROMSystemicTherapy.cycle_start_date,
            func.count().label("count")
        )
        .group_by(
            CROMSystemicTherapy.patient_id,
            CROMSystemicTherapy.treatment_line,
            CROMSystemicTherapy.cycle_start_date
        )
        .having(func.count() > 1)
        .all()
    )

    num_duplicates = sum(group.count for group in duplicate_groups)
    num_unique = total_entries - num_duplicates

    uniqueness_percent = round((num_unique / total_entries) * 100, 2) if total_entries else 100.0

    return {
        "module": "systemic_therapy",
        "total_entries": total_entries,
        "unique_entries": num_unique,
        "duplicates": num_duplicates,
        "uniqueness_percent": uniqueness_percent,
        "duplicate_groups": [
            {
                "patient_id": group.patient_id,
                "treatment_line": group.treatment_line,
                "cycle_start_date": group.cycle_start_date.isoformat() if group.cycle_start_date else None,
                "count": group.count
            }
            for group in duplicate_groups
        ]
    }

def calculate_systemic_therapy_uniqueness_per_patient(db: Session) -> dict:
    """
    Gibt pro Patient:in alle Duplikate der Kombination
    (patient_id, treatment_line) zurück.
    """

    duplicate_entries = (
        db.query(
            CROMSystemicTherapy.patient_id,
            CROMSystemicTherapy.treatment_line,
            CROMSystemicTherapy.cycle_start_date,
            func.count().label("count")
        )
        .group_by(
            CROMSystemicTherapy.patient_id,
            CROMSystemicTherapy.treatment_line,
            CROMSystemicTherapy.cycle_start_date
        )
        .having(func.count() > 1)
        .all()
    )

    patient_duplicates = defaultdict(list)

    for entry in duplicate_entries:
        patient_duplicates[entry.patient_id].append({
            "treatment_line": entry.treatment_line,
            "cycle_start_date": entry.cycle_start_date.isoformat() if entry.cycle_start_date else None,
            "count": entry.count
        })

    return {
        "module": "systemic_therapy",
        "duplicate_summary_per_patient": [
            {
                "patient_id": pid,
                "duplicate_count": sum([d["count"] for d in duplicates]),
                "duplicates": duplicates
            }
            for pid, duplicates in patient_duplicates.items()
        ]
    }
