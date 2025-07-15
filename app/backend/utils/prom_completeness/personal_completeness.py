def calculate_personal_data_completeness(entry: dict) -> dict:
    required_fields = [
        "institution", "pid", "first_name", "last_name", "date_birth",
        "gender", "street", "house_nr", "post_code", "city", "country",
        "phone_number", "email", "insurance_company", "insurance_class",
        "insurance_number", "ahv", "consent"
    ]

    total = len(required_fields)
    missing = [field for field in required_fields if entry.get(field) in [None, ""]]
    filled = total - len(missing)
    completeness_percent = round((filled / total) * 100, 1)

    return {
        "pid": entry.get("pid"),
        "module": "personal_data",
        "completeness_percent": completeness_percent,
        "missing_fields": missing
    }
