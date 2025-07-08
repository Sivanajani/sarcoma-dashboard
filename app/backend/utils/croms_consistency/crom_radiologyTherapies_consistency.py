import re
from datetime import datetime


def normalize(value):
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value).strip().lower()
                  .replace("_", " ")
                  .replace("-", " ")
                  .replace(":", " ")
                  .replace("/", " ")
                  .replace(",", " "))


def parse_date(date_str):
    try:
        return datetime.fromisoformat(date_str)
    except Exception:
        return None


def check_consistency_radiology_therapy(entry):

    dose = entry.get("total_dose_in_gy")
    fractions = entry.get("given_fractions")

    ptv = entry.get("ptv_volume_in_cm3")
    gtv = entry.get("gtv_volume_in_cm3")

    hyperthermia = normalize(entry.get("hyperthermia_status"))
    indication = normalize(entry.get("indication"))

    return {
        "dose_fraction_consistency": (
            (dose is not None and fractions is not None) or (dose is None and fractions is None)
        ),

        "volume_consistency": (
            (ptv is not None and gtv is not None) or (ptv is None and gtv is None)
        ),

        "hyperthermia_needs_indication": (
            True if not hyperthermia else bool(indication)
        ),
    }