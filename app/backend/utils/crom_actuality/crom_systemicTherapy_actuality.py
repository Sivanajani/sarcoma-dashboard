from datetime import datetime, date
from typing import Dict, Any

def calculate_systemic_therapy_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des SystemicTherapy-Moduls anhand von `updated_at`.
    - Modul gilt als aktuell, wenn `updated_at` innerhalb der letzten 360 Tage liegt.
    - Wenn vorhanden: `updated_at` sollte ≥ `cycle_end_date` sein.
    """

    result = {
        "updated_at": None,
        "cycle_end_date": None,
        "is_valid": False,
        "is_recent": False,
        "days_since_update": None,
        "actuality_score": 0
    }

    updated_raw = entry.get("updated_at")
    cycle_end_raw = entry.get("cycle_end_date")

    # Kein updated_at → nicht aktuell
    if not updated_raw:
        return result

    try:
        if isinstance(updated_raw, str):
            updated_at = datetime.strptime(updated_raw, "%Y-%m-%d %H:%M:%S").date()
        elif isinstance(updated_raw, datetime):
            updated_at = updated_raw.date()
        elif isinstance(updated_raw, date):
            updated_at = updated_raw
        else:
            return result
    except ValueError:
        return result

    # Optional: cycle_end_date prüfen
    cycle_end_date = None
    if cycle_end_raw:
        try:
            if isinstance(cycle_end_raw, str):
                cycle_end_date = datetime.strptime(cycle_end_raw, "%Y-%m-%d").date()
            elif isinstance(cycle_end_raw, datetime):
                cycle_end_date = cycle_end_raw.date()
            elif isinstance(cycle_end_raw, date):
                cycle_end_date = cycle_end_raw
        except ValueError:
            pass

    today = datetime.today().date()

    if updated_at > today:
        return result  # Zukunft = ungültig

    if cycle_end_date and updated_at < cycle_end_date:
        return result  # Inkonsistenz → nicht aktuell

    days_since = (today - updated_at).days
    result["updated_at"] = updated_at.isoformat()
    result["cycle_end_date"] = cycle_end_date.isoformat() if cycle_end_date else None
    result["days_since_update"] = days_since
    result["is_valid"] = True
    result["is_recent"] = days_since <= 360
    result["actuality_score"] = 100 if result["is_recent"] else 0

    return result
