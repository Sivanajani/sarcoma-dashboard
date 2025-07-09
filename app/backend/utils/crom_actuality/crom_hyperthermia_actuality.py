from datetime import datetime, date
from typing import Dict, Any

def calculate_hyperthermia_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des Hyperthermia-Moduls anhand von `updated_at`.
    Kriterien:
    - updated_at muss vorhanden, gültig und nicht älter als 180 Tage sein.
    - updated_at muss ≥ end_date sein, falls end_date vorhanden ist.
    """

    result = {
        "updated_at": None,
        "end_date": None,
        "is_valid": False,
        "is_recent": False,
        "matches_end_date": False,
        "days_since_update": None,
        "actuality_score": 0
    }

    updated_value = entry.get("updated_at")
    end_value = entry.get("end_date")

    # Parse updated_at
    try:
        if isinstance(updated_value, str):
            updated_at = datetime.strptime(updated_value, "%Y-%m-%d %H:%M:%S").date()
        elif isinstance(updated_value, datetime):
            updated_at = updated_value.date()
        elif isinstance(updated_value, date):
            updated_at = updated_value
        else:
            return result
    except Exception:
        return result  # ungültiges Format

    # Parse end_date (optional)
    end_date = None
    if end_value:
        try:
            if isinstance(end_value, str):
                end_date = datetime.strptime(end_value, "%Y-%m-%d").date()
            elif isinstance(end_value, datetime):
                end_date = end_value.date()
            elif isinstance(end_value, date):
                end_date = end_value
        except Exception:
            pass  # Wenn ungültig, einfach ignorieren

    today = datetime.today().date()
    if updated_at > today:
        return result  # Zukunft = ungültig

    # Check Bedingungen
    days_since = (today - updated_at).days
    result["updated_at"] = updated_at.isoformat()
    result["days_since_update"] = days_since
    result["is_recent"] = days_since <= 180
    result["is_valid"] = True

    # end_date-Check (optional)
    if end_date:
        result["end_date"] = end_date.isoformat()
        result["matches_end_date"] = updated_at >= end_date

    # Aktualität nur gegeben, wenn alle Bedingungen erfüllt
    if result["is_recent"] and (end_date is None or updated_at >= end_date):
        result["actuality_score"] = 100

    return result
