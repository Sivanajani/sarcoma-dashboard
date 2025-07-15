def calculate_eq5d_completeness(entry: dict) -> dict:
    required_fields = [
        "date", "pid", "institution", "vorname", "nachname",
        "mobilitaet", "selbstversorgung", "gewohnte_aktivitaeten",
        "schmerz", "angst", "questions", "vas", "belastung", "funktion"
    ]
    
    total = len(required_fields)
    missing = [field for field in required_fields if not entry.get(field)]
    filled = total - len(missing)
    completeness_percent = round((filled / total) * 100, 1)

    return {
        "pid": entry.get("pid"),
        "module": "eq5d",
        "completeness_percent": completeness_percent,
        "missing_fields": missing
    }
