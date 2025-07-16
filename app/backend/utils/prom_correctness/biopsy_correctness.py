from typing import Dict, Any

def check_biopsy_correctness(data: Dict[str, Any]) -> Dict[str, Any]:
    field_results = {}
    reasons = {}

    def check_range(field: str, min_val: int, max_val: int):
        value = data.get(field)
        if value is None:
            field_results[field] = None
        elif isinstance(value, int) and min_val <= value <= max_val:
            field_results[field] = True
        else:
            field_results[field] = False
            reasons[field] = f"Wert {value} liegt außerhalb des Bereichs ({min_val}-{max_val})"

    def check_boolean(field: str):
        value = data.get(field)
        if value in (True, False, None):
            field_results[field] = True
        else:
            field_results[field] = False
            reasons[field] = f"{field} ist kein gültiger Boolean-Wert"

    def check_string_in(field: str, allowed: list):
        value = data.get(field)
        if value is None:
            field_results[field] = None
        elif isinstance(value, str) and value in allowed:
            field_results[field] = True
        else:
            field_results[field] = False
            reasons[field] = f"{field} muss einer der Werte {allowed} sein"

    # Korrektheit prüfen
    check_range("biopsy_schmerz", 0, 10)
    check_range("biopsy_eqvas", 0, 100)
    check_range("biopsy_team_raum", 1, 10)
    check_range("biopsy_organisation", 1, 10)
    check_string_in("biopsy_schmerz_wie_erwartet", ["Ja", "Nein", "Ungefähr wie erwartet"])

    for boolean_field in [
        "biopsy_notwendigkeit", "biopsy_angst", "biopsy_erklaerung", "biopsy_verstehen",
        "biopsy_medikamente", "biopsy_blutende_wunde", "biopsy_probleme_wunde", "biopsy_schmerzkontrolle"
    ]:
        check_boolean(boolean_field)

    # Plausibilitätsprüfungen
    try:
        schmerz = data.get("biopsy_schmerz")
        vas = data.get("biopsy_eqvas")
        notw = data.get("biopsy_notwendigkeit")
        angst = data.get("biopsy_angst")
        medis = data.get("biopsy_medikamente")
        erklaerung = data.get("biopsy_erklaerung")
        verstehen = data.get("biopsy_verstehen")
        team = data.get("biopsy_team_raum")
        orga = data.get("biopsy_organisation")

        if isinstance(schmerz, int) and schmerz >= 7 and isinstance(vas, int) and vas < 60:
            field_results["biopsy_eqvas"] = False
            reasons["biopsy_eqvas"] = "Starker Schmerz, aber EQ-VAS < 60 – unplausibel"

        if notw is False and angst is True:
            field_results["biopsy_angst"] = False
            reasons["biopsy_angst"] = "Angst vorhanden, obwohl Eingriff als nicht notwendig bewertet wurde"

        if isinstance(schmerz, int) and schmerz <= 2 and medis is True:
            field_results["biopsy_medikamente"] = False
            reasons["biopsy_medikamente"] = "Schmerzmittel trotz sehr geringem Schmerz – unplausibel"

        if isinstance(team, int) and isinstance(orga, int) and abs(team - orga) > 3:
            field_results["biopsy_team_raum"] = False
            field_results["biopsy_organisation"] = False
            reasons["biopsy_team_raum"] = "Team/Raum und Organisation korrelieren nicht (Differenz > 3)"
            reasons["biopsy_organisation"] = "Organisation und Team/Raum korrelieren nicht (Differenz > 3)"

        if erklaerung is False and verstehen is True:
            field_results["biopsy_verstehen"] = False
            reasons["biopsy_verstehen"] = "Verständnis vorhanden, obwohl keine Erklärung gegeben wurde"

        if isinstance(vas, int) and vas < 0:
            field_results["biopsy_eqvas"] = False
            reasons["biopsy_eqvas"] = "EQ-VAS darf nicht negativ sein"

    except Exception as e:
        reasons["__error__"] = f"Plausibilitätsprüfung fehlgeschlagen: {str(e)}"

    total_fields = sum(1 for v in field_results.values() if v is not None)
    correct_fields = sum(1 for v in field_results.values() if v is True)

    return {
        "module": "proms_biopsy",
        "correct": correct_fields,
        "total": total_fields,
        "percent": round(100 * correct_fields / total_fields) if total_fields > 0 else None,
        "field_results": field_results,
        "reasons": reasons
    }
