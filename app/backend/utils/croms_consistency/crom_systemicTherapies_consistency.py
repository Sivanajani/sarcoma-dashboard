from utils.croms_consistency.crom_consistency_rules import normalize

def check_consistency_systemic_therapy(entry):
    results = {}

    treatment_line = entry.get("treatment_line")
    cycle_start_date = entry.get("cycle_start_date")
    cycle_end_date = entry.get("cycle_end_date")
    reason = normalize(entry.get("reason"))
    comments = normalize(entry.get("comments"))
    hyperthermia_status = normalize(entry.get("hyperthermia_status"))
    discontinuation_reason = normalize(entry.get("discontinuation_reason"))
    was_rct = entry.get("was_rct_concomittant")
    trial_inclusion = normalize(entry.get("clinical_trial_inclusion"))
    bone_protocol = normalize(entry.get("bone_protocol"))
    softtissue_protocol = normalize(entry.get("softtissue_protocol"))

    # Regel 1
    if treatment_line is not None and isinstance(treatment_line, int) and treatment_line > 1:
        results["treatment_line_requires_start_date"] = bool(cycle_start_date)
    else:
        results["treatment_line_requires_start_date"] = True

    # Regel 2
    if hyperthermia_status:
        results["hyperthermia_needs_reason_or_comment"] = bool(reason or comments)
    else:
        results["hyperthermia_needs_reason_or_comment"] = True

    # Regel 3
    if discontinuation_reason:
        results["discontinuation_needs_end_date"] = bool(cycle_end_date)
    else:
        results["discontinuation_needs_end_date"] = True

    # Regel 4
    if was_rct is True:
        results["rct_needs_trial_inclusion"] = bool(trial_inclusion)
    else:
        results["rct_needs_trial_inclusion"] = True

    # Regel 5
    if bone_protocol or softtissue_protocol:
        results["protocol_needs_reason"] = bool(reason)
    else:
        results["protocol_needs_reason"] = True

    # Zusammenfassung
    failed = [k for k, v in results.items() if v is False]
    results["summary"] = (
        f"Inkonsistenz bei: {', '.join(failed)}"
        if failed else "Alle Konsistenzregeln erfüllt."
    )

    return results