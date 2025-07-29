from utils.croms_consistency.crom_consistency_rules import normalize

JA_VALUES = {"ja", "yes", "oui", "sí"}

def check_consistency_sarcoma_board(entry):
    results = {}

    status_after = normalize(entry.get("status_after_follow_up"))
    status_before = normalize(entry.get("status_before_follow_up"))
    ecog = normalize(entry.get("current_ecog"))

    # Regel 1: decision_* enthält "ja" → status_after_follow_up muss gesetzt sein
    for field in ["decision_surgery", "decision_radio_therapy", "decision_systemic_surgery"]:
        decision_val = normalize(entry.get(field))
        results[f"{field}_status_link"] = (
            bool(status_after) if any(ja in decision_val for ja in JA_VALUES) else True
        )

    # Regel 2: status_before_follow_up ≠ status_after_follow_up (informativ)
    results["status_changed"] = (
        None if not status_before or not status_after
        else status_before != status_after
    )

    # Regel 3: current_ecog gesetzt → mind. ein Status (before oder after) muss vorhanden sein
    results["ecog_status_context"] = (
        True if not ecog else bool(status_before or status_after)
    )

    # Zusammenfassung
    failed = [k for k, v in results.items() if v is False]
    results["summary"] = (
        f"Inkonsistenz bei: {', '.join(failed)}"
        if failed else "Alle Konsistenzregeln erfüllt."
    )

    return results