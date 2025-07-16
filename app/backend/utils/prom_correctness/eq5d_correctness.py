def check_eq5d_correctness(eq5d_data: dict) -> dict:
    field_results = {}
    reasons = {}

    def check_range(field, min_val, max_val):
        value = eq5d_data.get(field)
        if value is None:
            field_results[field] = None
        elif isinstance(value, int) and min_val <= value <= max_val:
            field_results[field] = True
        else:
            field_results[field] = False
            reasons[field] = f"Wert {value} liegt ausserhalb des erlaubten Bereichs ({min_val}-{max_val})"

    # Korrektheit: Wertebereiche prüfen
    check_range("mobilitaet", 1, 5)
    check_range("selbstversorgung", 1, 5)
    check_range("gewohnte_aktivitaeten", 1, 5)
    check_range("schmerz", 1, 5)
    check_range("angst", 1, 5)
    check_range("vas", 0, 100)
    check_range("belastung", 1, 10)
    check_range("funktion", 1, 10)

    # Plausibilität: einfache Regelchecks
    try:
        m = eq5d_data.get("mobilitaet")
        s = eq5d_data.get("selbstversorgung")
        a = eq5d_data.get("gewohnte_aktivitaeten")
        b = eq5d_data.get("belastung")
        if all(isinstance(x, int) and x == 1 for x in [m, s, a]) and isinstance(b, int) and b > 3:
            field_results["belastung"] = False
            reasons["belastung"] = "Bei sehr guter Mobilität, Selbstversorgung und Aktivität sollte die Belastung ≤ 3 sein"

        schmerz = eq5d_data.get("schmerz")
        vas = eq5d_data.get("vas")
        if isinstance(schmerz, int) and schmerz >= 4 and isinstance(vas, int) and vas < 60:
            field_results["vas"] = False
            reasons["vas"] = "Starker Schmerz, aber VAS < 60 – ungewöhnlich"

        angst = eq5d_data.get("angst")
        funktion = eq5d_data.get("funktion")
        if isinstance(angst, int) and angst <= 2 and isinstance(funktion, int) and funktion <= 3:
            field_results["funktion"] = False
            reasons["funktion"] = "Niedrige Angst, aber stark eingeschränkte Funktion – unplausibel"

        if isinstance(b, int) and isinstance(funktion, int):
            correlation_ok = abs(b - funktion) <= 3
            if not correlation_ok:
                field_results["funktion"] = False
                field_results["belastung"] = False
                reasons["funktion"] = "Funktion und Belastung korrelieren schlecht"
                reasons["belastung"] = "Belastung und Funktion sollten ähnlichen Wert haben"

        if isinstance(vas, int) and vas < 0:
            field_results["vas"] = False
            reasons["vas"] = "VAS-Wert darf nicht negativ sein"
    except Exception as e:
        reasons["__error__"] = f"Plausibilitätsprüfung fehlgeschlagen: {str(e)}"

    total_fields = sum(1 for v in field_results.values() if v is not None)
    correct_fields = sum(1 for v in field_results.values() if v is True)

    return {
        "module": "eq5d",
        "correct": correct_fields,
        "total": total_fields,
        "percent": round(100 * correct_fields / total_fields) if total_fields > 0 else None,
        "field_results": field_results,
        "reasons": reasons
    }
