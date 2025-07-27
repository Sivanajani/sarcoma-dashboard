from utils.crom_correctness.crom_reference_data import REFERENCE_DATA
from utils.crom_correctness.crom_shared_rules import is_allowed_value, is_valid_date

def validate_diagnosis_correctness(entry: dict, birth_date: str = None) -> dict:
    result = {
        "tumor_anatomic_region": is_allowed_value(entry.get("tumor_anatomic_region"), REFERENCE_DATA["anatomic_regions"]),
        "tumor_anatomic_lesion_side": is_allowed_value(entry.get("tumor_anatomic_lesion_side"), REFERENCE_DATA["lesion_sides"]),
        "tumor_syndromes": is_allowed_value(entry.get("tumor_syndromes"), REFERENCE_DATA["tumor_syndromes"]),
        "tumor_diagnosis": is_allowed_value(entry.get("tumor_diagnosis"), REFERENCE_DATA["sarcoma_diagnoses"]),
        "additional_tumor_anatomic_region": is_allowed_value(entry.get("additional_tumor_anatomic_region"), REFERENCE_DATA["anatomic_regions"]),
        "additional_tumor_anatomic_lesion_side": is_allowed_value(entry.get("additional_tumor_anatomic_lesion_side"), REFERENCE_DATA["lesion_sides"]),
        "diagnosis_ecog": entry.get("diagnosis_ecog") in REFERENCE_DATA["ecog_values"],
        "last_contact_date": is_valid_date(entry.get("last_contact_date"), birth_date),
        "last_status": is_allowed_value(entry.get("last_status"), REFERENCE_DATA["last_status"]),
        "death_reason": is_allowed_value(entry.get("death_reason"), REFERENCE_DATA["death_reasons"]),

        # Nicht prüfbare Felder:
        "additional_tumor_diagnosis": None,
        "other_diagnosis": None,
        "patient_history": None,
    }

    # Liste aller Fehler sammeln
    failed_fields = [
        f" {key} ist ungültig"
        for key, value in result.items()
        if value is False  # Nur True/False prüfen, None ignorieren
    ]

    if failed_fields:
        result["summary"] = " | ".join(failed_fields)
    else:
        result["summary"] = " Alle prüfbaren Felder sind korrekt."

    return result