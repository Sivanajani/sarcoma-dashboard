from datetime import datetime, date
from typing import Dict, Any

def calculate_pathology_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    result = {
        "updated_at": None,
        "final_report_date": None,
        "is_valid": False,
        "is_recent": False,
        "is_concluded": False,
        "days_since_update": None,
        "actuality_score": 0,
        "reason": ""
    }

    today = datetime.today().date()

    # 1. updated_at parsen
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

    # 2. final_report_date parsen
    raw_final = entry.get("final_report_date")
    final_date = None
    if raw_final:
        try:
            if isinstance(raw_final, str):
                final_date = datetime.strptime(raw_final, "%Y-%m-%d").date()
            elif isinstance(raw_final, datetime):
                final_date = raw_final.date()
            elif isinstance(raw_final, date):
                final_date = raw_final
        except ValueError:
            final_date = None

    # 3. Bewertung
    result["updated_at"] = updated_at.isoformat()
    result["final_report_date"] = final_date.isoformat() if final_date else None
    days = (today - updated_at).days
    result["days_since_update"] = days
    result["is_valid"] = True
    result["is_recent"] = days <= 365

    # 4. Bewertung nach Konstellation
    if final_date:
        if final_date <= today:
            result["is_concluded"] = True
            if updated_at >= final_date:
                result["actuality_score"] = 100
                result["reason"] = "Report concluded and updated after final_report_date"
            else:
                result["actuality_score"] = 0
                result["reason"] = "Report concluded but updated_at before final_report_date"
        else:
            # final_report in der Zukunft
            if result["is_recent"]:
                result["actuality_score"] = 100
                result["reason"] = "Report planned (final_report_date in future), recently updated"
            else:
                result["actuality_score"] = 0
                result["reason"] = "Report planned (final_report_date in future), but updated_at too old"
    else:
        # Kein final_report_date vorhanden
        result["actuality_score"] = 100 if result["is_recent"] else 0
        result["reason"] = "No final_report_date, recency of updated_at used"

    return result
