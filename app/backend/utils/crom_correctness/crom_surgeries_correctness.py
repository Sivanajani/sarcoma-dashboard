from utils.crom_correctness.crom_reference_data import REFERENCE_DATA
from utils.crom_correctness.crom_shared_rules import (
    is_valid_date,
    is_valid_int_in_range,
    is_allowed_value
)

def validate_surgery_correctness(entry: dict, birth_date: str = None) -> dict:
    return {
        "surgery_date": is_valid_date(entry.get("surgery_date"), birth_date),
        "surgery_side": is_allowed_value(entry.get("surgery_side"), REFERENCE_DATA["lesion_sides"]),
        "greatest_surgical_tumor_dimension_in_mm": is_valid_int_in_range(entry.get("greatest_surgical_tumor_dimension_in_mm"), min_value=0, max_value=300),
        "had_tumor_spillage": isinstance(entry.get("had_tumor_spillage"), bool),
        "anatomic_region": is_allowed_value(entry.get("anatomic_region"), REFERENCE_DATA["anatomic_regions"]),
        "resection": is_allowed_value(entry.get("resection"), REFERENCE_DATA["resection"]),
        "amputation": is_allowed_value(entry.get("amputation"), REFERENCE_DATA["amputation"]),
        "resected_tumor_margin": is_allowed_value(entry.get("resected_tumor_margin"), REFERENCE_DATA["resection"]),
        "participated_disciplines": is_allowed_value(entry.get("participated_disciplines"), REFERENCE_DATA["disciplines"]),

        #keine Prüfung
        "institution_name": None,
        "indication": None,
        "hemipelvectomy": None,
        "reconstruction": None,
        "first_revision_details": None,
        "second_revision_details": None
    }
