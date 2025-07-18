def calculate_biopsy_completeness(entry: dict) -> dict:
    required_fields = [
        "biopsy_date", "biopsy_pid", "biopsy_institution",
        "biopsy_vorname", "biopsy_nachname", "biopsy_email",
        "biopsy_notwendigkeit", "biopsy_angst", "biopsy_erklaerung",
        "biopsy_verstehen", "biopsy_schmerz_wie_erwartet", "biopsy_schmerz",
        "biopsy_medikamente", "biopsy_beobachtungszeitraum", "biopsy_blutende_wunde",
        "biopsy_probleme_wunde", "biopsy_schmerzkontrolle", "biopsy_team_raum",
        "biopsy_organisation", "biopsy_eqvas", "biopsy_questions"
    ]

    def is_missing(value):
        return value is None or value == ""  

    missing = [field for field in required_fields if is_missing(entry.get(field))]
    filled = len(required_fields) - len(missing)
    completeness_percent = round((filled / len(required_fields)) * 100, 1)

    return {
        "pid": entry.get("biopsy_pid"),
        "module": "proms_biopsy",
        "completeness_percent": completeness_percent,
        "missing_fields": missing
    }