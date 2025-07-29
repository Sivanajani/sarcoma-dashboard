from utils.crom_correctness.crom_reference_data import REFERENCE_DATA
from utils.crom_correctness.crom_shared_rules import is_allowed_value, is_valid_date, has_allowed_suffix, is_allowed_schedule_value

def validate_hyperthermia_correctness(entry: dict, birth_date: str = None) -> dict:
    try:
        start_date = entry.get("start_date")
        end_date = entry.get("end_date")

        result = {
            "indication": is_allowed_value(entry.get("indication"), REFERENCE_DATA["hyperthermia_indications"]),
            "start_date": (
                is_valid_date(start_date, birth_date) and
                (not end_date or start_date <= end_date)
            ),
            "end_date": (
                is_valid_date(end_date, birth_date) and
                (not start_date or end_date >= start_date)
            ),
            "hyperthermia_type": is_allowed_value(entry.get("hyperthermia_type"), REFERENCE_DATA["hyperthermia_types"]),
            "therapy_sessions_count": (
                isinstance(entry.get("therapy_sessions_count"), int) and 
                1 <= entry.get("therapy_sessions_count") <= 50
            ),
            "schedule": is_allowed_schedule_value(
                entry.get("schedule"), 
                REFERENCE_DATA["hyperthermia_schedule_full_values"],
                REFERENCE_DATA["hyperthermia_schedule_suffixes"]
            ),
            "board_accepted_indication": isinstance(entry.get("board_accepted_indication"), bool),
            "therapy_type": is_allowed_value(entry.get("therapy_type"), REFERENCE_DATA["therapy_types"]),

            # Nicht prüfbare Freitextfelder
            "comment": None,
            "therapy_id": None,
        }

        # Zusammenfassung ungültiger Felder
        failed_fields = [
            f" {key} ist ungültig"
            for key, value in result.items()
            if value is False
        ]

        if failed_fields:
            result["summary"] = " | ".join(failed_fields)
        else:
            result["summary"] = " Alle prüfbaren Felder sind korrekt."

        return result

    except Exception as e:
        print(f"[ERROR] Hyperthermia correctness validation failed: {e}")
        return {"summary": "Validierung fehlgeschlagen"}