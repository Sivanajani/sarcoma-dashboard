from datetime import datetime, date
from typing import Dict, Any

def calculate_sarcoma_board_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des SarcomaBoard-Moduls anhand von `updated_at`.
    Eintrag gilt als aktuell, wenn updated_at ≤ 180 Tage alt ist.
    """

    result = {
        "updated_at": None,
        "is_valid": False,
        "is_recent": False,
        "days_since_update": None,
        "actuality_score": 0
    }

    raw_date = entry.get("updated_at")
    if not raw_date:
        return result  # Kein Datum → nicht aktuell

    try:
        if isinstance(raw_date, str):
            updated_at = datetime.fromisoformat(raw_date).date()
        elif isinstance(raw_date, datetime):
            updated_at = raw_date.date()
        elif isinstance(raw_date, date):
            updated_at = raw_date
        else:
            return result
    except ValueError:
        return result

    today = datetime.today().date()

    if updated_at > today:
        return result  # Zukunft = ungültig

    days_since = (today - updated_at).days
    result["updated_at"] = updated_at.isoformat()
    result["days_since_update"] = days_since
    result["is_valid"] = True
    result["is_recent"] = days_since <= 180
    result["actuality_score"] = 100 if result["is_recent"] else 0

    return result