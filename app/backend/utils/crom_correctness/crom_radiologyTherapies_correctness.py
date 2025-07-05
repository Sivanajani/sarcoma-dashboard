from utils.crom_correctness.crom_reference_data import REFERENCE_DATA
from utils.crom_correctness.crom_shared_rules import (
    is_allowed_value,
    is_valid_date,
    validate_referral_date_field,
    validate_therapy_start_date_field,
    is_greater_equal_date,
    is_valid_float_in_range,
    is_valid_int_in_range,
    is_greater_equal_float,
)

def validate_radiology_therapy_correctness(entry: dict, birth_date: str = None) -> dict:
    return {
        "indication": is_allowed_value(entry.get("indication"), REFERENCE_DATA["radiology_therapy_indications"]),
        "therapy_type": is_allowed_value(entry.get("therapy_type"), REFERENCE_DATA["radiology_therapy_types"]),
        "referral_date": validate_referral_date_field(entry, birth_date).get("referral_date"),


        "first_contact_date": is_valid_date(entry.get("first_contact_date")),

        "therapy_start_date": validate_therapy_start_date_field(entry, birth_date)["therapy_start_date"],
        
        "therapy_end_date": is_greater_equal_date(
            entry.get("therapy_end_date"),
            entry.get("therapy_start_date")
        ),
        "total_dose_in_gy": is_valid_float_in_range(entry.get("total_dose_in_gy"), min_value=20, max_value=60),
        "given_fractions": is_valid_int_in_range(entry.get("given_fractions"), min_value=1, max_value=40),
        "ptv_volume_in_cm3": is_greater_equal_float(
            entry.get("ptv_volume_in_cm3"),
            min_value=0,
            max_value=3000,
            warn_if_above=2500
        ),
        "gtv_volume_in_cm3": is_greater_equal_float(
            entry.get("gtv_volume_in_cm3"),
            min_value=0,
            max_value=3000,
            warn_if_above=2500
        ),
        "was_tumor_located_in_radiated_area": isinstance(entry.get("was_tumor_located_in_radiated_area"), bool),
        "was_tumor_located_with_pre_existing_lymph_edema": isinstance(entry.get("was_tumor_located_with_pre_existing_lymph_edema"), bool),
        "hyperthermia_status": is_allowed_value(entry.get("hyperthermia_status"), REFERENCE_DATA["hyperthermia_status"]),

        # Nicht prüfbare Felder
        "institution_name": None,
        "comments": None,
    }