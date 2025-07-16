# utils/prom_consistency/biopsy_consistency.py

def check_biopsy_consistency(biopsy_data: dict) -> dict:
    field_results = {}
    reasons = {}

    def mark(field, value, reason=None):
        field_results[field] = value
        if reason:
            reasons[field] = reason

    try:
        schmerz = biopsy_data.get("biopsy_schmerz")
        wie_erwartet = (biopsy_data.get("biopsy_schmerz_wie_erwartet") or "").strip().lower()
        if isinstance(schmerz, int) and schmerz >= 7 and wie_erwartet == "wie erwartet":
            mark("biopsy_schmerz_wie_erwartet", False, "Starker Schmerz, aber 'wie erwartet' – unplausibel")

        if biopsy_data.get("biopsy_angst") is True and biopsy_data.get("biopsy_erklaerung") is True:
            mark("biopsy_angst", False, "Angst trotz Erklärung – potenzieller Widerspruch")
            mark("biopsy_erklaerung", False)

        if biopsy_data.get("biopsy_erklaerung") is True and biopsy_data.get("biopsy_verstehen") is not True:
            mark("biopsy_verstehen", False, "Erklärung gegeben, aber nicht verstanden")
            mark("biopsy_erklaerung", False)

        if biopsy_data.get("biopsy_medikamente") is True and isinstance(schmerz, int) and schmerz > 6:
            mark("biopsy_medikamente", False, "Trotz Medikamenten starker Schmerz")
            mark("biopsy_schmerz", False)

        if biopsy_data.get("biopsy_blutende_wunde") is False and biopsy_data.get("biopsy_probleme_wunde") is True:
            mark("biopsy_probleme_wunde", False, "Wundprobleme trotz keiner Blutung")
            mark("biopsy_blutende_wunde", False)

        eqvas = biopsy_data.get("biopsy_eqvas")
        if isinstance(schmerz, int) and schmerz >= 7 and isinstance(eqvas, int) and eqvas < 60:
            mark("biopsy_eqvas", False, "Starker Schmerz, aber niedriger VAS-Wert")
            mark("biopsy_schmerz", False)

        if biopsy_data.get("biopsy_verstehen") is False:
            questions = (biopsy_data.get("biopsy_questions") or "").strip()
            if not questions:
                mark("biopsy_questions", False, "Kein Verständnis, aber keine Fragen gestellt")
                mark("biopsy_verstehen", False)

        if isinstance(schmerz, int) and schmerz >= 7 and biopsy_data.get("biopsy_schmerzkontrolle") is True:
            mark("biopsy_schmerzkontrolle", False, "Starker Schmerz, aber angeblich gute Kontrolle")

        team = biopsy_data.get("biopsy_team_raum")
        orga = biopsy_data.get("biopsy_organisation")
        if isinstance(team, int) and isinstance(orga, int) and abs(team - orga) > 1:
            mark("biopsy_team_raum", False, "Bewertungen für Team & Organisation differieren stark")
            mark("biopsy_organisation", False)

    except Exception as e:
        reasons["__error__"] = f"Fehler bei Konsistenzprüfung: {str(e)}"

    total_fields = sum(1 for v in field_results.values() if v is not None)
    consistent_fields = sum(1 for v in field_results.values() if v is True)

    return {
        "module": "biopsy",
        "consistent": consistent_fields,
        "total": total_fields,
        "percent": round(100 * consistent_fields / total_fields) if total_fields > 0 else None,
        "field_results": field_results,
        "reasons": reasons
    }
