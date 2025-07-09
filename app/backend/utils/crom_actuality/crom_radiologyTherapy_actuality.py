from datetime import datetime, date
from typing import Dict, Any

def calculate_radiology_therapy_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des RadiologyTherapy-Moduls.
    Regeln:
    - Wenn `therapy_end_date` vorhanden und ≤ heute → Modul gilt als abgeschlossen, also *100% aktuell*.
    - Sonst: `updated_at` muss vorhanden und ≤ 365 Tage alt sein → *aktuell*.
    """

    result = {
        "updated_at": None,
        "therapy_end_date": None,
        "is_valid": False,
        "is_recent": False,
        "is_concluded": False,
        "days_since_update": None,
        "actuality_score": 0,
        "reason": ""
    }

    today = datetime.today().date()

    # Schritt 1: Prüfung auf abgeschlossen
    raw_end = entry.get("therapy_end_date")
    if raw_end:
        try:
            if isinstance(raw_end, str):
                therapy_end_date = datetime.strptime(raw_end, "%Y-%m-%d").date()
            elif isinstance(raw_end, datetime):
                therapy_end_date = raw_end.date()
            elif isinstance(raw_end, date):
                therapy_end_date = raw_end
            else:
                therapy_end_date = None
        except ValueError:
            therapy_end_date = None

        if therapy_end_date and therapy_end_date <= today:
            result["therapy_end_date"] = therapy_end_date.isoformat()
            result["is_concluded"] = True
            result["actuality_score"] = 100
            result["reason"] = "Therapy concluded – no update required"
            return result  

    # Schritt 2: Prüfung auf Aktualität per updated_at
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