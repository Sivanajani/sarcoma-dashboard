from fastapi import APIRouter, HTTPException
from db.engine import engine_pg
from sqlalchemy import text

router = APIRouter()

def get_available_modules(conn, pid):
    return {
        "systemic_therapy": conn.execute(
            text("SELECT id FROM croms_systemic_therapies WHERE patient_id = :pid LIMIT 1"),
            {"pid": pid}
        ).fetchone() is not None
    }

@router.get("/api/patients/completeness-overview")
def get_completeness_overview():
    try:
        with engine_pg.connect() as conn:
            patients = conn.execute(text("SELECT id FROM croms_patients")).fetchall()

            completeness_rules = {
                "diagnosis": (
                    "croms_diagnoses",
                    "patient_id",
                    [
                        "tumor_anatomic_region",
                        "tumor_anatomic_lesion_side",
                        "tumor_syndromes",
                        "tumor_diagnosis",
                        "additional_tumor_anatomic_region",
                        "additional_tumor_anatomic_lesion_side",
                        "additional_tumor_diagnosis",
                        "other_diagnosis",
                        "patient_history",
                        "diagnosis_ecog",
                        "last_contact_date",
                        "last_status",
                    ]
                ),
                "sarcoma_board": (
                    "croms_sarcoma_boards",
                    "patient_id",
                    [
                        "presentation_date",
                        "reason_for_presentation",
                        "status_before_follow_up",
                        "unplanned_excision_date",
                        "whoops_surgery_institution_name",
                        "status_after_follow_up",
                        "treatment_before_follow_up",
                        "follow_up_reason",
                        "question",
                        "last_execution",
                        "proposed_procedure",
                        "current_ecog",
                        "decision_surgery",
                        "decision_surgery_comment",
                        "decision_radio_therapy",
                        "decision_radio_therapy_comment",
                        "decision_systemic_surgery",
                        "decision_systemic_surgery_comment",
                        "decision_follow_up",
                        "decision_follow_up_comment",
                        "decision_diagnostics",
                        "decision_diagnostics_comment",
                        "decision_palliative_care",
                        "decision_palliative_care_comment",
                        "summary",
                        "fast_track",
                    ]
                ),
                "radiology_exam": (
                    "croms_radiology_exams",
                    "patient_id",
                    [
                        "exam_date",
                        "exam_type",
                        "imaging_timing",
                        "imaging_type",
                        "largest_lesion_size_in_mm",
                        "medium_lesion_size_in_mm",
                        "smallest_lesion_size_in_mm",
                        "location_of_lesion",
                        "pet_response",
                        "metastasis_presence",
                        {
                            "key": "recist_response",
                            "conditional": lambda modules: modules.get("systemic_therapy", False)
                        },
                        {
                            "key": "choi_response",
                            "conditional": lambda modules: modules.get("systemic_therapy", False)
                        },
                        {
                            "key": "irecist_response",
                            "conditional": lambda modules: modules.get("systemic_therapy", False)
                        }
                    ]
                ),
                "pathology": (
                    "croms_pathologies",
                    "patient_id",
                    [
                        "data_entry_type",
                        "biopsy_resection_date",
                        "registrate_date",
                        "first_report_date",
                        "final_report_date",
                        "prior_pathology",
                        "who_diagnosis",
                        "diagnostic_grading",
                        "judgment_of_surgical_margin",
                        "proliferation_index",
                        "mitoses_per_10hpf",
                        "extent_of_necrosis",
                        "closest_distance_to_margin_mm",
                        "biological_barrier_to_closest_margin",
                        "ihc_performed_status",
                        "fish_performed_status",
                        "rna_performed_status",
                        "dna_performed_status",
                        {
                            "key": "ihc_result",
                            "conditional": lambda data: bool(data.get("ihc_performed_status"))
                        },
                        {
                            "key": "fish_result",
                            "conditional": lambda data: bool(data.get("fish_performed_status"))
                        },
                        {
                            "key": "rna_result",
                            "conditional": lambda data: bool(data.get("rna_performed_status"))
                        },
                        {
                            "key": "dna_result",
                            "conditional": lambda data: bool(data.get("dna_performed_status"))
                        }
                    ]
                ),
                "surgery": (
                    "croms_surgeries",
                    "patient_id",
                    [
                        "surgery_date",
                        "institution_name",
                        "indication",
                        "surgery_side",
                        "greatest_surgical_tumor_dimension_in_mm",
                        "had_tumor_spillage",
                        "anatomic_region",
                        "resection",
                        "hemipelvectomy",
                        "reconstruction",
                        "amputation",
                        "resected_tumor_margin",
                        "first_revision_details",
                        "participated_disciplines",
                    ]
                ),
                "radiology_therapy": (
                    "croms_radiology_therapies",
                    "patient_id",
                    [
                        "indication",
                        "therapy_type",
                        "referral_date",
                        "first_contact_date",
                        "therapy_start_date",
                        "therapy_end_date",
                        "institution_name",
                        "total_dose_in_gy",
                        "given_fractions",
                        "ptv_volume_in_cm3",
                        "gtv_volume_in_cm3",
                        "was_tumor_located_in_radiated_area",
                        "was_tumor_located_with_pre_existing_lymph_edema",
                        "comments",
                        "hyperthermia_status",
                    ]
                ),
                "systemic_therapy": (
                    "croms_systemic_therapies",
                    "patient_id",
                    [
                        "reason",
                        "treatment_line",
                        "cycles_planned",
                        "bone_protocol",
                        "softtissue_protocol",
                        "institution_name",
                        "cycle_start_date",
                        "cycle_end_date",
                        "was_rct_concomittant",
                        "comments",
                        "clinical_trial_inclusion",
                        "hyperthermia_status",
                    ]
                ),
                "hyperthermia_therapy": (
                    "croms_hyperthermia_therapies",
                    "patient_id",
                    [
                        "indication",
                        "start_date",
                        "end_date",
                        "hyperthermia_type",
                        "therapy_sessions_count",
                        "schedule",
                        "board_accepted_indication",
                        "comment",
                        "therapy_type",
                        "therapy_id"
                    ]
                )
            }

            result_list = []

            for patient in patients:
                pid = patient[0]
                total_score = 0
                module_count = 0

                # Verfügbare Module abrufen (für Bedingungen)
                available_modules = get_available_modules(conn, pid)

                for module_name, (table, patient_col, fields) in completeness_rules.items():
                    # Dynamisch alle möglichen Spaltennamen extrahieren (auch aus dicts)
                    field_names = [f if isinstance(f, str) else f["key"] for f in fields]

                    result = conn.execute(
                        text(f"SELECT {', '.join(field_names)} FROM {table} WHERE {patient_col} = :pid LIMIT 1"),
                        {"pid": pid}
                    ).fetchone()

                    if result:
                        values = result._mapping
                        filled_fields = 0
                        relevant_fields = 0

                        for field in fields:
                            if isinstance(field, dict):
                                key = field["key"]
                                # Conditional prüfen
                                if "conditional" in field:
                                    try:
                                        arg_count = field["conditional"].__code__.co_argcount
                                        if arg_count == 1:
                                            if not field["conditional"](values):
                                                continue
                                        else:
                                            if not field["conditional"](available_modules):
                                                continue
                                    except Exception:
                                        continue
                            else:
                                key = field

                            relevant_fields += 1
                            if values.get(key) is not None:
                                filled_fields += 1

                        score = filled_fields / relevant_fields if relevant_fields > 0 else 0
                        total_score += score
                        module_count += 1

                avg_score = round(total_score / module_count, 2) if module_count else 0.0

                result_list.append({
                    "patient_id": pid,
                    "average_completeness": avg_score,
                    "modules_checked": module_count
                })

            return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
