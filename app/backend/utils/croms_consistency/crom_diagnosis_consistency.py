def check_consistency_diagnosis(entry: dict) -> dict:
    return {
        "region_side_coupling": (
            bool(entry.get("tumor_anatomic_region")) == bool(entry.get("tumor_anatomic_lesion_side"))
        ),
        "additional_region_side_coupling": (
            bool(entry.get("additional_tumor_anatomic_region")) == bool(entry.get("additional_tumor_lesion_side"))
        ),
        "ecog_vs_death": (
            False if entry.get("death_reason") and entry.get("diagnosis_ecog") not in [None, ""] else True
        ),
        "death_reason_vs_last_status": (
            (not entry.get("death_reason") and entry.get("last_status") != "verstorben")
            or (entry.get("death_reason") and entry.get("last_status") == "verstorben")
        )
    }
