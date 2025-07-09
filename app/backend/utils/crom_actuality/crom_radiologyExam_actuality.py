from datetime import datetime, date
from typing import Dict, Any

def calculate_radiology_exam_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des RadiologyExam-Moduls anhand von `updated_at` und `exam_date`.

    Regeln:
    - `updated_at` muss gültig sein und ≤ heute.
    - `updated_at` sollte innerhalb der letzten 365 Tage liegen.
    - Wenn `exam_date` ≤ heute, sollte `updated_at` ≥ `exam_date` sein.
    """

    result = {
        "updated_at": None,
        "exam_date": None,
        "is_valid": False,
        "is_recent": False,
        "is_concluded": False,
        "days_since_update": None,
        "actuality_score": 0,
        "reason": ""
    }

    today = datetime.today().date()

    # 1. Parse updated_at
    raw_update = entry.get("updated_at")
    if not raw_update:
        result["reason"] = "Missing updated_at"
        return result

    try:
        if isinstance(raw_update, str):
            updated_at = datetime.strptime(raw_update, "%Y-%m-%d %H:%M:%S").date()
        elif isinstance(raw_update, datetime):
            updated_at = raw_update.date()
        elif isinstance(raw_update, date):
            updated_at = raw_update
        else:
            raise ValueError
    except ValueError:
        result["reason"] = "Invalid updated_at format"
        return result

    if updated_at > today:
        result["reason"] = "updated_at is in the future"
        return result

    # 2. Parse exam_date (optional)
    raw_exam = entry.get("exam_date")
    exam_date = None
    if raw_exam:
        try:
            if isinstance(raw_exam, str):
                exam_date = datetime.strptime(raw_exam, "%Y-%m-%d").date()
            elif isinstance(raw_exam, datetime):
                exam_date = raw_exam.date()
            elif isinstance(raw_exam, date):
                exam_date = raw_exam
        except ValueError:
            exam_date = None

    # 3. Bewertung vorbereiten
    result["updated_at"] = updated_at.isoformat()
    result["exam_date"] = exam_date.isoformat() if exam_date else None
    days = (today - updated_at).days
    result["days_since_update"] = days
    result["is_valid"] = True
    result["is_recent"] = days <= 365

    if exam_date:
        if exam_date <= today:
            result["is_concluded"] = True
            if updated_at >= exam_date:
                result["actuality_score"] = 100
                result["reason"] = "Exam concluded and updated after exam_date"
            else:
                result["actuality_score"] = 0
                result["reason"] = "Exam concluded but updated_at before exam_date"
        else:
            # exam_date in Zukunft
            if result["is_recent"]:
                result["actuality_score"] = 100
                result["reason"] = "Exam planned in future, recently updated"
            else:
                result["actuality_score"] = 0
                result["reason"] = "Exam planned in future, but updated_at too old"
    else:
        # Kein exam_date
        result["actuality_score"] = 100 if result["is_recent"] else 0
        result["reason"] = "No exam_date, recency of updated_at used"

    return result
