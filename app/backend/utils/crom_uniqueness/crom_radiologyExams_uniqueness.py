from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import CROMRadiologyExam

def calculate_radiology_exam_uniqueness(db: Session) -> dict:
    """
    Prüft Duplikate in `croms_radiology_exams` basierend auf:
    patient_id + exam_date + imaging_type
    """

    total_entries = db.query(CROMRadiologyExam).count()

    duplicate_groups = (
        db.query(
            CROMRadiologyExam.patient_id,
            CROMRadiologyExam.exam_date,
            func.lower(func.trim(CROMRadiologyExam.imaging_type)).label("imaging_type"),
            func.count().label("count")
        )
        .group_by(
            CROMRadiologyExam.patient_id,
            CROMRadiologyExam.exam_date,
            func.lower(func.trim(CROMRadiologyExam.imaging_type))
        )
        .having(func.count() > 1)
        .all()
    )

    num_duplicates = sum(group.count for group in duplicate_groups)
    num_unique = total_entries - num_duplicates

    uniqueness_percent = round((num_unique / total_entries) * 100, 2) if total_entries else 100.0

    return {
        "module": "radiology_exam",
        "total_entries": total_entries,
        "unique_entries": num_unique,
        "duplicates": num_duplicates,
        "uniqueness_percent": uniqueness_percent,
        "duplicate_groups": [
            {
                "patient_id": group.patient_id,
                "exam_date": group.exam_date.isoformat(),
                "imaging_type": group.imaging_type,
                "count": group.count
            }
            for group in duplicate_groups
        ]
    }


def calculate_radiology_exam_uniqueness_per_patient(db: Session) -> dict:
    """
    Gibt pro Patient:in alle Duplikate der Kombination
    (patient_id, exam_date, imaging_type) zurück.
    """

    duplicate_entries = (
        db.query(
            CROMRadiologyExam.patient_id,
            CROMRadiologyExam.exam_date,
            func.lower(func.trim(CROMRadiologyExam.imaging_type)).label("imaging_type"),
            func.count().label("count")
        )
        .group_by(
            CROMRadiologyExam.patient_id,
            CROMRadiologyExam.exam_date,
            func.lower(func.trim(CROMRadiologyExam.imaging_type))
        )
        .having(func.count() > 1)
        .all()
    )

    patient_duplicates = defaultdict(list)

    for entry in duplicate_entries:
        patient_duplicates[entry.patient_id].append({
            "exam_date": entry.exam_date.isoformat(),
            "imaging_type": entry.imaging_type,
            "count": entry.count
        })

    return {
        "module": "radiology_exam",
        "duplicate_summary_per_patient": [
            {
                "patient_id": pid,
                "duplicate_count": sum([d["count"] for d in duplicates]),
                "duplicates": duplicates
            }
            for pid, duplicates in patient_duplicates.items()
        ]
    }
