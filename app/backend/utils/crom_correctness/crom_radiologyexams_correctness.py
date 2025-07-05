from utils.crom_correctness.crom_reference_data import REFERENCE_DATA
from utils.crom_correctness.crom_shared_rules import (
    is_allowed_value,
    is_valid_date,
    is_valid_int_in_range,
    is_fuzzy_biological_barrier_value
)

def validate_radiology_exam_correctness(entry: dict, birth_date: str = None) -> dict:
    return {
        "exam_date": is_valid_date(entry.get("exam_date"), birth_date),
        "exam_type": is_allowed_value(entry.get("exam_type"), REFERENCE_DATA["imaging_type"]),
        "imaging_timing": is_allowed_value(entry.get("imaging_timing"), REFERENCE_DATA["imaging_timing"]),
        "imaging_type": is_allowed_value(entry.get("imaging_type"), REFERENCE_DATA["imaging_type"]),

        "largest_lesion_size_in_mm": is_valid_int_in_range(entry.get("largest_lesion_size_in_mm"), min_value=1, max_value=300),
        "medium_lesion_size_in_mm": is_valid_int_in_range(entry.get("medium_lesion_size_in_mm"), min_value=1, max_value=150),
        "smallest_lesion_size_in_mm": is_valid_int_in_range(entry.get("smallest_lesion_size_in_mm"), min_value=1, max_value=50),

        "location_of_lesion": is_fuzzy_biological_barrier_value(entry.get("location_of_lesion"), REFERENCE_DATA["location_of_lesion"]),

        "pet_response": is_allowed_value(entry.get("pet_response"), REFERENCE_DATA["response"]),
        "recist_response": is_allowed_value(entry.get("recist_response"), REFERENCE_DATA["response"]),
        "choi_response": is_allowed_value(entry.get("choi_response"), REFERENCE_DATA["response"]),
        "irecist_response": is_allowed_value(entry.get("irecist_response"), REFERENCE_DATA["response"]),

        "metastasis_presence": isinstance(entry.get("metastasis_presence"), bool) and entry.get("metastasis_presence") is not None,

    }