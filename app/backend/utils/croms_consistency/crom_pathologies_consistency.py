from utils.croms_consistency.crom_consistency_rules import normalize

def map_status(value):
    val = normalize(value)
    if val in {"ja", "yes", "durchgeführt"}:
        return "durchgeführt"
    elif val in {"nein", "no", "nicht durchgeführt"}:
        return "nicht durchgeführt"
    elif val in {"ausstehend", "pending"}:
        return "ausstehend"
    return val  

def check_consistency_pathology(entry):
    final_report_date = entry.get("final_report_date")
    first_report_date = entry.get("first_report_date")

    ihc_result = normalize(entry.get("ihc_result"))
    ihc_status = map_status(entry.get("ihc_performed_status"))

    fish_result = normalize(entry.get("fish_result"))
    fish_status = map_status(entry.get("fish_performed_status"))

    rna_result = normalize(entry.get("rna_result"))
    rna_status = map_status(entry.get("rna_performed_status"))

    dna_result = normalize(entry.get("dna_result"))
    dna_status = map_status(entry.get("dna_performed_status"))

    barrier = normalize(entry.get("biological_barrier_to_closest_margin"))
    distance = entry.get("closest_distance_to_margin_mm")

    grading = normalize(entry.get("diagnostic_grading"))
    necrosis = normalize(entry.get("extent_of_necrosis"))

    results = {
        "final_after_first_report": (
            False if final_report_date and not first_report_date
            else (
                not final_report_date or not first_report_date
                or first_report_date <= final_report_date
            )
        ),
        "ihc_result_needs_performed": (
            True if not ihc_result
            else ihc_status in {"durchgeführt", "ausstehend"}
        ),
        "fish_result_needs_performed": (
            True if not fish_result
            else fish_status == "durchgeführt"
        ),
        "rna_result_needs_performed": (
            True if not rna_result
            else rna_status in {"durchgeführt", "ausstehend"}
        ),
        "dna_result_needs_performed": (
            True if not dna_result
            else dna_status in {"durchgeführt", "ausstehend"}
        ),
        "distance_needs_barrier": (
            True if not distance or distance == 0
            else bool(barrier)
        ),
        "grading_vs_necrosis": (
            True if grading not in {"G3", "g3", "maligne unklares grading"}
            else bool(necrosis)
        ),
    }

    failed = [k for k, v in results.items() if v is False]
    if failed:
        results["summary"] = f"Inkonsistenz bei: {', '.join(failed)}"
    else:
        results["summary"] = "Alle Konsistenzregeln erfüllt."

    return results