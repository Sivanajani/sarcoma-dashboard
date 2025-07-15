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

    total = len(required_fields)
    missing = [field for field in required_fields if not entry.get(field)]
    filled = total - len(missing)
    completeness_percent = round((filled / total) * 100, 1)

    return {
        "pid": entry.get("biopsy_pid"),
        "module": "proms_biopsy",
        "completeness_percent": completeness_percent,
        "missing_fields": missing
    }
