from utils.crom_correctness.crom_reference_data import REFERENCE_DATA
from utils.crom_correctness.crom_shared_rules import (
    is_allowed_value,
    is_valid_date,
    is_prefixed_allowed_value,
    validate_cycles_planned
)

def validate_systemic_therapy_correctness(entry: dict, birth_date: str = None) -> dict:
    return {
        "reason": is_allowed_value(
            entry.get("reason"),
            REFERENCE_DATA["systemic_therapy_reasons"]
        ),
        "treatment_line": (
            isinstance(entry.get("treatment_line"), int)
            and entry.get("treatment_line") >= 1
        ),
        "cycles_planned": validate_cycles_planned(entry.get("cycles_planned")),
        "cycle_start_date": is_valid_date(
            entry.get("cycle_start_date"),
            birth_date
        ),
        "cycle_end_date": (
            is_valid_date(entry.get("cycle_end_date"), birth_date)
            and entry.get("cycle_start_date") is not None
            and entry.get("cycle_end_date") >= entry.get("cycle_start_date")
        ),
        "discontinuation_reason": is_allowed_value(
            entry.get("discontinuation_reason"),
            REFERENCE_DATA["systemic_therapy_discontinuation_reasons"]
        ),
        "was_rct_concomittant": isinstance(entry.get("was_rct_concomittant"), bool),
        "clinical_trial_inclusion": is_allowed_value(
            entry.get("clinical_trial_inclusion"),
            REFERENCE_DATA["clinical_trial_inclusion"]
        ),
        "hyperthermia_status": is_allowed_value(
            entry.get("hyperthermia_status"),
            REFERENCE_DATA["hyperthermia_status"]
        ),

        # Unprüfbar / Freitext / kein Standard
        "bone_protocol": None, #noch warten
        "softtissue_protocol": None, #noch warten
        "institution_name": None,
        "comments": None
    }
