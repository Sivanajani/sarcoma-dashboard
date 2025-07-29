from utils.croms_consistency.crom_consistency_rules import normalize

def check_consistency_radiology_exam(entry):
    exam_date = entry.get("exam_date")  
    imaging_type = normalize(entry.get("imaging_type"))
    imaging_timing = normalize(entry.get("imaging_timing"))

    location = normalize(entry.get("location_of_lesion"))
    metastasis = entry.get("metastasis_presence")  

    largest = entry.get("largest_lesion_size_in_mm")
    medium = entry.get("medium_lesion_size_in_mm")
    smallest = entry.get("smallest_lesion_size_in_mm")

    recist = normalize(entry.get("recist_response"))
    choi = normalize(entry.get("choi_response"))
    irecist = normalize(entry.get("irecist_response"))

    results = {
        "size_logic_consistent": (
            True if largest is None
            else medium is not None and smallest is not None
        ),

        "recist_requires_sizes": (
            True if not recist
            else all(size is not None for size in [largest, medium, smallest])
        ),

        "imaging_timing_consistent": (
            True if not imaging_timing
            else exam_date is not None
        ),

        "metastasis_vs_location": (
            True if not metastasis
            else bool(location)
        ),

        "choi_requires_type": (
            True if not choi
            else bool(imaging_type)
        ),

        "irecist_requires_recist": (
            True if not irecist
            else bool(recist)
        ),
    }

    failed = [k for k, v in results.items() if v is False]
    results["summary"] = (
        f"Inkonsistenz bei: {', '.join(failed)}"
        if failed else "Alle Konsistenzregeln erfüllt."
    )

    return results