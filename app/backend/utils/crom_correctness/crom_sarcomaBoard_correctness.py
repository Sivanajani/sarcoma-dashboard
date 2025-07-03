from utils.crom_correctness.crom_reference_data import REFERENCE_DATA
from utils.crom_correctness.crom_shared_rules import is_allowed_value, is_valid_date, is_prefixed_allowed_value


def validate_sarcoma_board_correctness(entry: dict, birth_date: str = None) -> dict:
    return {
        "presentation_date": is_valid_date(entry.get("presentation_date"), birth_date),
        "reason_for_presentation": is_allowed_value(entry.get("reason_for_presentation"), REFERENCE_DATA["presentation_reasons"]),
        "status_before_follow_up": is_allowed_value(entry.get("status_before_follow_up"), REFERENCE_DATA["status_list"]),
        "unplanned_excision_date": (
            is_valid_date(entry.get("unplanned_excision_date"), birth_date)
            and entry.get("presentation_date") is not None
            and entry.get("unplanned_excision_date") <= entry.get("presentation_date")
        ),
        "whoops_surgery_institution_name": is_allowed_value(entry.get("whoops_surgery_institution_name"), REFERENCE_DATA["disciplines"]),
        "status_after_follow_up": is_allowed_value(entry.get("status_after_follow_up"), REFERENCE_DATA["status_list"]),
        "treatment_before_follow_up": is_allowed_value(entry.get("treatment_before_follow_up"), REFERENCE_DATA["therapy_forms"]),
        "current_ecog": entry.get("current_ecog") in REFERENCE_DATA["ecog_values"],

        "decision_surgery": is_prefixed_allowed_value(entry.get("decision_surgery"), REFERENCE_DATA["yes_no_unknown"]),
        "decision_radio_therapy": is_prefixed_allowed_value(entry.get("decision_radio_therapy"), REFERENCE_DATA["yes_no_unknown"]),
        "decision_systemic_surgery": is_prefixed_allowed_value(entry.get("decision_systemic_surgery"), REFERENCE_DATA["yes_no_unknown"]),
        
        "decision_follow_up": is_prefixed_allowed_value(entry.get("decision_follow_up"), REFERENCE_DATA["yes_no_unknown"]),
        "decision_diagnostics": is_prefixed_allowed_value(entry.get("decision_diagnostics"), REFERENCE_DATA["yes_no_unknown"]),
        "decision_palliative_care": is_prefixed_allowed_value(entry.get("decision_palliative_care"), REFERENCE_DATA["yes_no_unknown"]),
        
        "fast_track": isinstance(entry.get("fast_track"), bool) and entry.get("fast_track") is not None,

        # Unprüfbar / Freitext:
        "follow_up_reason": None,
        "question": None,
        "last_execution": None,
        "proposed_procedure": None,
        "decision_surgery_comment": None,
        "decision_radio_therapy_comment": None,
        "decision_systemic_surgery_comment": None,
        "decision_follow_up_comment": None,
        "decision_diagnostics_comment": None,
        "decision_palliative_care_comment": None,
        "summary": None,
        "further_details": None,
    }
