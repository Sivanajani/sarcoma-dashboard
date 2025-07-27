from utils.croms_consistency.crom_consistency_rules import normalize

DECEASED_STATUSES = {
    "verstorben", "tod", "dead", "verstorben an erkrankung",
    "verstorben aus anderen gründen", "dead of disease", "dead of other reasons"
}

VALID_DEATH_REASONS = {
    "tumorbedingt", "therapiekomplikation", "zweite tumorerkrankung",
    "infektion", "herzversagen",
    "tumor related", "therapy complication", "second tumor",
    "infection", "heart failure", "of_other_cancer"
}

IGNORED_DEATH_REASONS = {
    "unbekannt", "nicht dokumentiert", "unknown", "not documented", "", "unfall", "accident"
}


def check_consistency_diagnosis(entry):
    region = normalize(entry.get("tumor_anatomic_region"))
    side = normalize(entry.get("tumor_anatomic_lesion_side"))
    add_region = normalize(entry.get("additional_tumor_anatomic_region"))
    add_side = normalize(entry.get("additional_tumor_anatomic_lesion_side"))
    ecog = normalize(entry.get("diagnosis_ecog"))
    death_reason = normalize(entry.get("death_reason"))
    last_status = normalize(entry.get("last_status"))

    result = {
        "region_side_coupling": (
            (not region and not side) or (bool(region) and bool(side))
        ),
        "additional_region_side_coupling": (
            (not add_region and not add_side) or (bool(add_region) and bool(add_side))
        ),
        "ecog_vs_death": (
            None if last_status not in DECEASED_STATUSES
            else ecog in ["", "0", None]
        ),
        "death_reason_vs_last_status": (
            (death_reason in IGNORED_DEATH_REASONS and last_status not in DECEASED_STATUSES) or
            (death_reason in VALID_DEATH_REASONS and last_status in DECEASED_STATUSES)
        ),
    }

    failed = [k for k, v in result.items() if v is False]
    if failed:
        result["summary"] = f"Inkonsistenz bei: {', '.join(failed)}"
    else:
        result["summary"] = "Alle Konsistenzregeln erfüllt."

    return result