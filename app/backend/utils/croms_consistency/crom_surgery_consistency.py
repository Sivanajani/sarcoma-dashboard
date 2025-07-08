import re
import json


def normalize(value):
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value).strip().lower()
                  .replace("_", " ")
                  .replace("-", " ")
                  .replace(":", " ")
                  .replace("/", " ")
                  .replace(",", " "))

def parse_disciplines(value):
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            # Versuch, als JSON-Array zu parsen
            return json.loads(value)
        except json.JSONDecodeError:
            # Falls JSON-Parsing fehlschlägt, versuche PostgreSQL-Format
            if value.startswith("{") and value.endswith("}"):
                return [v.strip() for v in value.strip("{}").split(",") if v.strip()]
    return []




def check_consistency_surgery(entry):
    amputation = normalize(entry.get("amputation"))
    anatomic_region = normalize(entry.get("anatomic_region"))
    resected_margin = normalize(entry.get("resected_tumor_margin"))
    surgery_side = normalize(entry.get("surgery_side"))
    indication = normalize(entry.get("indication"))
    reconstruction = normalize(entry.get("reconstruction"))
    resection = normalize(entry.get("resection"))

    # Revisionen
    first_revision = normalize(entry.get("first_revision_details"))
    second_revision = normalize(entry.get("second_revision_details"))

    disciplines = parse_disciplines(entry.get("participated_disciplines"))


    return {
        "amputation_needs_region": (
            True if not amputation or amputation == "keine"
            else bool(anatomic_region)
        ),

        "revision_needs_margin": (
            True if not (first_revision or second_revision)
            else bool(resected_margin)
        ),

        "surgery_side_needs_region": (
            True if not surgery_side else bool(anatomic_region)
        ),

        "reconstruction_needs_indication": (
            True if not reconstruction else bool(indication)
        ),

        "disciplines_needs_resection": (
            True if len(disciplines) < 2 else bool(resection)
        ),
    }
