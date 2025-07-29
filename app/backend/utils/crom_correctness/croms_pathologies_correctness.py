from utils.crom_correctness.crom_reference_data import REFERENCE_DATA
from utils.crom_correctness.crom_shared_rules import (
    is_percentage_or_allowed_value,
    is_allowed_value,
    is_valid_date,
    is_greater_equal_date,
    is_before_date,
    is_valid_int_in_range,
    is_fuzzy_biological_barrier_value
)

def validate_pathology_correctness(entry: dict, birth_date: str = None) -> dict:
    try:
        result = {
            "data_entry_type": is_allowed_value(entry.get("data_entry_type"), REFERENCE_DATA["data_entry_type"]),
            "biopsy_resection_date": is_valid_date(entry.get("biopsy_resection_date"), birth_date),
            "registrate_date": is_before_date(entry.get("registrate_date"), entry.get("first_report_date")),
            "first_report_date": is_greater_equal_date(entry.get("first_report_date"), entry.get("registrate_date")),
            "final_report_date": is_greater_equal_date(entry.get("final_report_date"), entry.get("first_report_date")),

            "diagnostic_grading": is_allowed_value(entry.get("diagnostic_grading"), REFERENCE_DATA["diagnostic_grading"]),
            "judgment_of_surgical_margin": is_allowed_value(entry.get("judgment_of_surgical_margin"), REFERENCE_DATA["judgment_of_surgical_margin"]),

            "proliferation_index": is_allowed_value(entry.get("proliferation_index"), REFERENCE_DATA["proliferation_index"]),
            "mitoses_per_10hpf": is_allowed_value(entry.get("mitoses_per_10hpf"), REFERENCE_DATA["mitoses_per_10hpf"]),
            "extent_of_necrosis": is_percentage_or_allowed_value(entry.get("extent_of_necrosis"), REFERENCE_DATA["extent_of_necrosis"]),

            "closest_distance_to_margin_mm": is_valid_int_in_range(entry.get("closest_distance_to_margin_mm"), min_value=0, max_value=50),

            "biological_barrier_to_closest_margin": is_fuzzy_biological_barrier_value(
                entry.get("biological_barrier_to_closest_margin"), REFERENCE_DATA["biological_barrier"]
            ),

            "ihc_performed_status": is_allowed_value(entry.get("ihc_performed_status"), REFERENCE_DATA["performed_status"]),
            "fish_performed_status": is_allowed_value(entry.get("fish_performed_status"), REFERENCE_DATA["performed_status"]),
            "rna_performed_status": is_allowed_value(entry.get("rna_performed_status"), REFERENCE_DATA["performed_status"]),
            "dna_performed_status": is_allowed_value(entry.get("dna_performed_status"), REFERENCE_DATA["performed_status"]),

            # Freitextfelder (nicht prüfbar)
            "prior_pathology": None,
            "who_diagnosis": None,
            "ihc_result": None,
            "fish_result": None,
            "rna_result": None,
            "dna_result": None,

            # Metadaten
            "institution_name": None,
            "created_at": None,
            "updated_at": None,
        }

        failed_fields = [
            f" {key} ist ungültig"
            for key, value in result.items()
            if value is False
        ]

        result["summary"] = (
            " | ".join(failed_fields)
            if failed_fields else " Alle prüfbaren Felder sind korrekt."
        )

        return result

    except Exception as e:
        print(f"[ERROR] Pathology correctness validation failed: {e}")
        return {"summary": "Validierung fehlgeschlagen"}