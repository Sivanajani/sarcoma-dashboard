from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import CROMSarcomaBoard

def calculate_sarcoma_board_uniqueness(db: Session) -> dict:
    """
    Prüft Duplikate in `croms_sarcoma_boards` basierend auf:
    patient_id + presentation_date
    """

    total_entries = db.query(CROMSarcomaBoard).count()

    duplicate_groups = (
        db.query(
            CROMSarcomaBoard.patient_id,
            CROMSarcomaBoard.presentation_date,
            func.count().label("count")
        )
        .group_by(
            CROMSarcomaBoard.patient_id,
            CROMSarcomaBoard.presentation_date
        )
        .having(func.count() > 1)
        .all()
    )

    num_duplicates = sum(group.count for group in duplicate_groups)
    num_unique = total_entries - num_duplicates

    uniqueness_percent = round((num_unique / total_entries) * 100, 2) if total_entries else 100.0

    return {
        "module": "sarcoma_board",
        "total_entries": total_entries,
        "unique_entries": num_unique,
        "duplicates": num_duplicates,
        "uniqueness_percent": uniqueness_percent,
        "duplicate_groups": [
            {
                "patient_id": group.patient_id,
                "presentation_date": group.presentation_date.isoformat(),
                "count": group.count
            }
            for group in duplicate_groups
        ]
    }

def calculate_sarcoma_board_uniqueness_per_patient(db: Session) -> dict:
    """
    Gibt pro Patient:in alle Duplikate der Kombination
    (patient_id, presentation_date) zurück.
    """

    duplicate_entries = (
        db.query(
            CROMSarcomaBoard.patient_id,
            CROMSarcomaBoard.presentation_date,
            func.count().label("count")
        )
        .group_by(
            CROMSarcomaBoard.patient_id,
            CROMSarcomaBoard.presentation_date
        )
        .having(func.count() > 1)
        .all()
    )

    patient_duplicates = defaultdict(list)

    for entry in duplicate_entries:
        patient_duplicates[entry.patient_id].append({
            "presentation_date": entry.presentation_date.isoformat(),
            "count": entry.count
        })

    return {
        "module": "sarcoma_board",
        "duplicate_summary_per_patient": [
            {
                "patient_id": pid,
                "duplicate_count": sum([d["count"] for d in duplicates]),
                "duplicates": duplicates
            }
            for pid, duplicates in patient_duplicates.items()
        ]
    }