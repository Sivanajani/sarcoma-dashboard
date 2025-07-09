from datetime import datetime, date
from typing import Dict, Any

def calculate_systemic_therapy_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des SystemicTherapy-Moduls.
    Regeln:
    - Wenn `discontinuation_reason` vorhanden → Modul gilt als final und aktuell.
    - Sonst: `updated_at` muss vorhanden und ≤ 365 Tage alt sein.
    """

    result = {
        "updated_at": None,
        "discontinuation_reason": entry.get("discontinuation_reason"),
        "is_valid": False,
        "is_recent": False,
        "days_since_update": None,
        "actuality_score": 0,
        "reason": ""
    }

    today = datetime.today().date()

    # Fall 1: Therapie wurde beendet → automatisch aktuell
    if entry.get("discontinuation_reason"):
        result["is_valid"] = True
        result["is_recent"] = True
        result["actuality_score"] = 100
        result["reason"] = "Therapy discontinued – no further update expected"
        return result

    # Fall 2: Normale Prüfung über updated_at
    updated_raw = entry.get("updated_at")
    if not updated_raw:
        result["reason"] = "Missing updated_at"
        return result

    try:
        if isinstance(updated_raw, str):
            updated_at = datetime.strptime(updated_raw, "%Y-%m-%d %H:%M:%S").date()
        elif isinstance(updated_raw, datetime):
            updated_at = updated_raw.date()
        elif isinstance(updated_raw, date):
            updated_at = updated_raw
        else:
            updated_at = None
    except ValueError:
        updated_at = None

    if not updated_at or updated_at > today:
        result["reason"] = "Invalid or future updated_at"
        return result

    days = (today - updated_at).days
    result["updated_at"] = updated_at.isoformat()
    result["days_since_update"] = days
    result["is_valid"] = True
    
    result["is_recent"] = days <= 365
    result["actuality_score"] = 100 if result["is_recent"] else 0
    result["reason"] = "Based on updated_at"

    return result
