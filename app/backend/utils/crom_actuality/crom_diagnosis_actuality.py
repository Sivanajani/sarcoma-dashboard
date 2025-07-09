from datetime import datetime, date
from typing import Dict, Any

def calculate_diagnosis_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des Diagnosis-Moduls anhand von `last_contact_date`.
    """

    result = {
        "last_contact_date": None,
        "is_valid": False,
        "is_recent": False,
        "days_since_last_contact": None,
        "actuality_score": 0
    }

    last_contact_value = entry.get("last_contact_date")
    if not last_contact_value:
        return result  # Kein Datum vorhanden

    try:
        if isinstance(last_contact_value, str):
            last_contact_date = datetime.strptime(last_contact_value, "%Y-%m-%d").date()
        elif isinstance(last_contact_value, datetime):
            last_contact_date = last_contact_value.date()
        elif isinstance(last_contact_value, date):
            last_contact_date = last_contact_value
        else:
            return result  # Ungültiger Typ
    except ValueError:
        return result  # Ungültiges Datumsformat

    today = datetime.today().date()

    if last_contact_date > today:
        return result  # Datum liegt in der Zukunft

    days_since = (today - last_contact_date).days
    result["last_contact_date"] = last_contact_date.isoformat()
    result["days_since_last_contact"] = days_since
    result["is_valid"] = True
    result["is_recent"] = days_since <= 365
    result["actuality_score"] = 100 if result["is_recent"] else 0

    return result
