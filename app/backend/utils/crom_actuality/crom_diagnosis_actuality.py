from datetime import datetime, date
from typing import Dict, Any

def calculate_diagnosis_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des Diagnosis-Moduls anhand von `last_contact_date` und optional `updated_at`.
    Gilt als aktuell, wenn einer der beiden Werte ≤ 365 Tage alt ist.
    """

    result = {
        "last_contact_date": None,
        "updated_at": None,
        "is_valid": False,
        "is_recent": False,
        "days_since_last_contact": None,
        "days_since_update": None,
        "actuality_score": 0
    }

    today = datetime.today().date()

    # Verarbeitung von last_contact_date
    last_contact_value = entry.get("last_contact_date")
    if last_contact_value:
        try:
            if isinstance(last_contact_value, str):
                last_contact_date = datetime.strptime(last_contact_value, "%Y-%m-%d").date()
            elif isinstance(last_contact_value, datetime):
                last_contact_date = last_contact_value.date()
            elif isinstance(last_contact_value, date):
                last_contact_date = last_contact_value
            else:
                last_contact_date = None
        except ValueError:
            last_contact_date = None

        if last_contact_date and last_contact_date <= today:
            days = (today - last_contact_date).days
            result["last_contact_date"] = last_contact_date.isoformat()
            result["days_since_last_contact"] = days
            if days <= 365:
                result["is_valid"] = True
                result["is_recent"] = True

    # Verarbeitung von updated_at
    updated_value = entry.get("updated_at")
    if updated_value:
        try:
            if isinstance(updated_value, str):
                updated_at = datetime.fromisoformat(updated_value).date()
            elif isinstance(updated_value, datetime):
                updated_at = updated_value.date()
            elif isinstance(updated_value, date):
                updated_at = updated_value
            else:
                updated_at = None
        except ValueError:
            updated_at = None

        if updated_at and updated_at <= today:
            days = (today - updated_at).days
            result["updated_at"] = updated_at.isoformat()
            result["days_since_update"] = days
            if days <= 365:
                result["is_valid"] = True
                result["is_recent"] = True

    result["actuality_score"] = 100 if result["is_recent"] else 0

    return result
