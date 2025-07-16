from typing import Dict, Any

def check_eq5d_consistency(eq5d_data: Dict[str, Any]) -> Dict[str, Any]:
    field_results = {}
    reasons = {}

    def get(field):
        return eq5d_data.get(field)

    def fail(fields, message):
        for f in fields:
            field_results[f] = False
        for f in fields:
            reasons[f] = message

    def soft_fail(field, message):
        field_results[field] = False
        reasons[field] = message

    m = get("mobilitaet")
    s = get("selbstversorgung")
    a = get("gewohnte_aktivitaeten")
    p = get("schmerz")
    angst = get("angst")
    q = get("questions")
    vas = get("vas")
    b = get("belastung")
    f = get("funktion")

    # K1: mobilitaet = 1 → funktion ≥ 7
    if m == 1 and isinstance(f, int) and f < 7:
        fail(["mobilitaet", "funktion"], "Gute Mobilität, aber eingeschränkte Funktion")

    # K2: schmerz ≥ 4 → belastung ≥ 5
    if isinstance(p, int) and p >= 4 and isinstance(b, int) and b < 5:
        fail(["schmerz", "belastung"], "Starker Schmerz, aber geringe Belastung")

    # K3: selbstversorgung ≥ 4 → aktivitaeten ≥ 4
    if isinstance(s, int) and s >= 4 and isinstance(a, int) and a < 4:
        fail(["selbstversorgung", "gewohnte_aktivitaeten"], "Starke Einschränkung bei Selbstversorgung, aber normale Aktivität")

    # K4: angst ≥ 4 → questions nicht leer
    if isinstance(angst, int) and angst >= 4 and (q is None or q.strip() == ""):
        soft_fail("questions", "Hohe Angst, aber keine gestellten Fragen")

    # K5: funktion und belastung ±2 Unterschied
    if isinstance(f, int) and isinstance(b, int) and abs(f - b) > 2:
        fail(["funktion", "belastung"], "Funktion und Belastung sollten ähnlichen Wert haben (±2)")

    # K6: schmerz ≥ 4 → vas ≥ 60
    if isinstance(p, int) and p >= 4 and isinstance(vas, int) and vas < 60:
        fail(["schmerz", "vas"], "Starker Schmerz, aber niedriger VAS-Wert")

    # K7: mobilitaet ≥ 4 → selbstversorgung ≠ 1
    if isinstance(m, int) and m >= 4 and s == 1:
        fail(["mobilitaet", "selbstversorgung"], "Starke Mobilitätseinschränkung, aber volle Selbstversorgung")

    # K8: angst ≤ 2 → funktion ≥ 4
    if isinstance(angst, int) and angst <= 2 and isinstance(f, int) and f < 4:
        fail(["angst", "funktion"], "Keine Angst, aber stark eingeschränkte Funktion")

    total_fields = sum(1 for v in field_results.values() if v is not None)
    consistent_fields = sum(1 for v in field_results.values() if v is not False)

    return {
        "module": "eq5d",
        "consistent": consistent_fields,
        "total": total_fields,
        "percent": round(100 * consistent_fields / total_fields) if total_fields > 0 else None,
        "field_results": field_results,
        "reasons": reasons
    }
