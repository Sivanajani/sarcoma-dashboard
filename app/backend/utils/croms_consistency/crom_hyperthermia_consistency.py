from utils.croms_consistency.crom_consistency_rules import normalize

def check_consistency_hyperthermia(entry):
    indication = normalize(entry.get("indication"))
    start_date = entry.get("start_date")
    end_date = entry.get("end_date")
    therapy_sessions_count = entry.get("therapy_sessions_count")
    board_accepted = entry.get("board_accepted_indication")
    therapy_type = normalize(entry.get("therapy_type"))

    results = {
        # Regel 1: Startdatum vor Enddatum
        "date_order_valid": (
            True if not start_date or not end_date else start_date < end_date
        ),

        # Regel 2: Wenn Sitzungsanzahl gesetzt → Indikation muss vorhanden sein
        "sessions_have_indication": (
            True if not therapy_sessions_count else bool(indication)
        ),

        # Regel 3: Wenn board_accepted_indication true → Indikation muss vorhanden sein
        "accepted_has_indication": (
            True if board_accepted is not True else bool(indication)
        ),

        # Regel 4: Wenn Startdatum gesetzt → Indikation muss vorhanden sein
        "start_date_needs_indication": (
            True if not start_date else bool(indication)
        ),

        # Regel 5: Wenn therapy_type gesetzt → Indikation muss vorhanden sein
        "therapy_type_needs_indication": (
            True if not therapy_type else bool(indication)
        ),
    }

    failed = [k for k, v in results.items() if v is False]
    if failed:
        results["summary"] = f"Inkonsistenz bei: {', '.join(failed)}"
    else:
        results["summary"] = "Alle Konsistenzregeln erfüllt."

    return results