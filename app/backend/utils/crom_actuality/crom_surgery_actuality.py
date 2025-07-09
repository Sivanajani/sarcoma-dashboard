from datetime import datetime, date
from typing import Dict, Any

def calculate_surgery_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des Surgery-Moduls anhand von `updated_at` und optional `surgery_date`.

    Regeln:
    - Wenn OP abgeschlossen (`surgery_date ≤ heute`) → `updated_at ≥ surgery_date` erforderlich.
    - Wenn OP geplant (`surgery_date > heute`) → `updated_at ≤ 365 Tage alt`.
    - Wenn kein `surgery_date` → nur `updated_at ≤ 365 Tage alt`.
    """

    result = {
        "updated_at": None,
        "surgery_date": None,
        "is_valid": False,
        "is_recent": False,
        "is_concluded": False,
        "days_since_update": None,
        "actuality_score": 0,
        "reason": ""
    }

    today = datetime.today().date()

    # 1. surgery_date verarbeiten
    raw_surgery = entry.get("surgery_date")
    surgery_date = None
    if raw_surgery:
        try:
            if isinstance(raw_surgery, str):
                surgery_date = datetime.strptime(raw_surgery, "%Y-%m-%d").date()
            elif isinstance(raw_surgery, datetime):
                surgery_date = raw_surgery.date()
            elif isinstance(raw_surgery, date):
                surgery_date = raw_surgery
        except ValueError:
            pass

    # 2. updated_at verarbeiten
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

    # 3. Bewertung je nach surgery_date
    result["updated_at"] = updated_at.isoformat()
    result["surgery_date"] = surgery_date.isoformat() if surgery_date else None
    result["days_since_update"] = days
    result["is_valid"] = True

    if surgery_date:
        if surgery_date <= today:
            # OP ist abgeschlossen → Update danach nötig
            result["is_concluded"] = True
            if updated_at >= surgery_date:
                result["actuality_score"] = 100
                result["reason"] = "Surgery concluded and updated after surgery"
            else:
                result["actuality_score"] = 0
                result["reason"] = "Surgery concluded but outdated (updated before surgery)"
        else:
            # OP in der Zukunft → nur updated_at zählt
            result["is_recent"] = days <= 365
            result["actuality_score"] = 100 if result["is_recent"] else 0
            result["reason"] = "Upcoming surgery with recent update" if result["is_recent"] else "Upcoming surgery but outdated update"
    else:
        # Kein surgery_date → nur updated_at zählt
        result["is_recent"] = days <= 365
        result["actuality_score"] = 100 if result["is_recent"] else 0
        result["reason"] = "No surgery_date; based on updated_at only"

    return result
