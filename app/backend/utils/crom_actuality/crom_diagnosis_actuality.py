from datetime import datetime, date
from typing import Dict, Any

def calculate_diagnosis_actuality(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Bewertet die Aktualität des Diagnosis-Moduls.
    Regeln:
    - Wenn `death_reason` vorhanden → automatisch aktuell (final).
    - Sonst: Modul ist aktuell, wenn `last_contact_date` ODER `updated_at` ≤ 365 Tage alt ist.
    """

    result = {
        "last_contact_date": None,
        "updated_at": None,
        "death_reason": entry.get("death_reason"),
        "is_valid": False,
        "is_recent": False,
        "days_since_last_contact": None,
        "days_since_update": None,
        "actuality_score": 0,
        "reason": ""
    }

    today = datetime.today().date()

    # Wenn Todesursache angegeben → Modul final, keine Aktualitätsbewertung nötig
    if entry.get("death_reason"):
        result["is_valid"] = True
        result["is_recent"] = True
        result["actuality_score"] = 100
        result["reason"] = "Patient deceased – no update required"
        return result

    # Verarbeitung last_contact_date
    lcd_raw = entry.get("last_contact_date")
    if lcd_raw:
        try:
            if isinstance(lcd_raw, str):
                lcd = datetime.strptime(lcd_raw, "%Y-%m-%d").date()
            elif isinstance(lcd_raw, datetime):
                lcd = lcd_raw.date()
            elif isinstance(lcd_raw, date):
                lcd = lcd_raw
            else:
                lcd = None
        except ValueError:
            lcd = None

        if lcd and lcd <= today:
            days_lcd = (today - lcd).days
            result["last_contact_date"] = lcd.isoformat()
            result["days_since_last_contact"] = days_lcd
            if days_lcd <= 365:
                result["is_valid"] = True
                result["is_recent"] = True
                result["reason"] = "Based on last_contact_date"

    # Verarbeitung updated_at
    updated_raw = entry.get("updated_at")
    if updated_raw:
        try:
            if isinstance(updated_raw, str):
                updated = datetime.fromisoformat(updated_raw).date()
            elif isinstance(updated_raw, datetime):
                updated = updated_raw.date()
            elif isinstance(updated_raw, date):
                updated = updated_raw
            else:
                updated = None
        except ValueError:
            updated = None

        if updated and updated <= today:
            days_upd = (today - updated).days
            result["updated_at"] = updated.isoformat()
            result["days_since_update"] = days_upd
            if days_upd <= 365:
                result["is_valid"] = True
                result["is_recent"] = True
                result["reason"] = "Based on updated_at"

    # Logischer Check: last_contact_date sollte nicht nach updated_at liegen
    if result.get("last_contact_date") and result.get("updated_at"):
        try:
            lcd_date = datetime.fromisoformat(result["last_contact_date"]).date()
            upd_date = datetime.fromisoformat(result["updated_at"]).date()
            if lcd_date > upd_date:
                result["reason"] += " (Warning: last_contact_date is after updated_at)"
        except Exception:
            pass

    result["actuality_score"] = 100 if result["is_recent"] else 0
    return result