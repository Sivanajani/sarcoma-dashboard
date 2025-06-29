import { isTruthy } from '../utils/validationUtils';


export type ModuleData = Record<string, any>;

export type QualityMetrics = {
  name: string;
  completeness: number;
  fieldsFilled: number;
  fieldsTotal: number;
  warnings?: string[];
};

type CompletenessRule = {
  key: string;
  required?: boolean;
  conditional?: (allModules: Record<string, any>) => boolean;
};

const completenessRules: Record<string, CompletenessRule[]> = {
  
  croms_diagnoses: [
    { key: 'tumor_anatomic_region', required: true },
    { key: 'tumor_anatomic_lesion_side', required: true },
    { key: 'tumor_syndromes', required: true },
    { key: 'tumor_diagnosis', required: true },
    { key: 'additional_tumor_anatomic_region', required: true },
    { key: 'additional_tumor_anatomic_lesion_side', required: true },
    { key: 'additional_tumor_diagnosis', required: true },
    { key: 'other_diagnosis', required: true },
    { key: 'patient_history', required: true },
    { key: 'diagnosis_ecog', required: true },
    { key: 'last_contact_date', required: true },
    { key: 'last_status', required: true },
  ],

  // tumor selber nicht im Dump vorhanden, wahrscheinlich verschmolzen mit diagnosis
  tumor: [
    { key: 'anatomic_region', required: true },
    { key: 'anatomic_lesion_side', required: true },
    { key: 'clinical_history', required: true },
  ],

  croms_sarcoma_boards: [
    { key: 'presentation_date', required: true },
    { key: 'reason_for_presentation', required: true },
    { key: 'status_before_follow_up', required: true },
    { key: 'unplanned_excision_date', required: true },
    { key: 'whoops_surgery_institution_name', required: true },
    { key: 'status_after_follow_up', required: true },
    { key: 'treatment_before_follow_up', required: true },
    { key: 'follow_up_reason', required: true },
    { key: 'question', required: true },
    { key: 'last_execution', required: true },
    { key: 'proposed_procedure', required: true },
    { key: 'current_ecog', required: true },
    { key: 'decision_surgery', required: true },
    { key: 'decision_surgery_comment', required: true },
    { key: 'decision_radio_therapy', required: true },
    { key: 'decision_radio_therapy_comment', required: true },
    { key: 'decision_systemic_surgery', required: true },
    { key: 'decision_systemic_surgery_comment', required: true },
    { key: 'decision_follow_up', required: true },
    { key: 'decision_follow_up_comment', required: true },
    { key: 'decision_diagnostics', required: true },
    { key: 'decision_diagnostics_comment', required: true },
    { key: 'decision_palliative_care', required: true },
    { key: 'decision_palliative_care_comment', required: true },
    { key: 'summary', required: true },
    { key: 'fast_track', required: true }
  ],

  croms_radiology_exams: [
    { key: 'exam_date', required: true },
    { key: 'exam_type', required: true },
    { key: 'imaging_timing', required: true },
    { key: 'imaging_type', required: true },
    { key: 'largest_lesion_size_in_mm', required: true },
    { key: 'medium_lesion_size_in_mm', required: true },
    { key: 'smallest_lesion_size_in_mm', required: true },
    { key: 'location_of_lesion', required: true },
    { key: 'recist_response', conditional: (modules) => !!modules.systemic_therapy },
    { key: 'choi_response', conditional: (modules) => !!modules.systemic_therapy },
    { key: 'irecist_response', conditional: (modules) => !!modules.systemic_therapy },
    { key: 'pet_response', required: true },
    { key: 'metastasis_presence', required: true }
  ],

  croms_pathologies: [
    { key: 'data_entry_type', required: true },
    { key: 'biopsy_resection_date', required: true },
    { key: 'registrate_date', required: true },
    { key: 'first_report_date', required: true },
    { key: 'final_report_date', required: true },
    { key: 'prior_pathology', required: true },
    { key: 'who_diagnosis', required: true },
    { key: 'diagnostic_grading', required: true },
    { key: 'judgment_of_surgical_margin', required: true },
    { key: 'proliferation_index', required: true },
    { key: 'mitoses_per_10hpf', required: true },
    { key: 'extent_of_necrosis', required: true },
    { key: 'closest_distance_to_margin_mm', required: true },
    { key: 'biological_barrier_to_closest_margin', required: true },
    { key: 'ihc_performed_status', required: true },
    { key: 'fish_performed_status', required: true },
    { key: 'rna_performed_status', required: true },
    { key: 'dna_performed_status', required: true },
    { key: 'ihc_result', conditional: (data) => isTruthy(data.ihc_performed_status)},
    { key: 'fish_result', conditional: (data) => isTruthy(data.fish_performed_status)},
    { key: 'rna_result', conditional: (data) => isTruthy(data.rna_performed_status)},
    { key: 'dna_result', conditional: (data) => isTruthy(data.dna_performed_status)}
  ],

    croms_surgeries: [
    { key: 'surgery_date', required: true },
    { key: 'institution_name', required: true },
    { key: 'indication', required: true },
    { key: 'surgery_side', required: true },
    { key: 'greatest_surgical_tumor_dimension_in_mm', required: true },
    { key: 'had_tumor_spillage', required: true },
    { key: 'anatomic_region', required: true },
    { key: 'resection', required: true },
    { key: 'hemipelvectomy', required: true },
    { key: 'reconstruction', required: true },
    { key: 'amputation', required: true },
    { key: 'resected_tumor_margin', required: true },
    { key: 'first_revision_details', required: true },
    { key: 'participated_disciplines', required: true }, 
    //{ key: 'second_revision_details', required: true } noch fragen ob das ein muss ist
  ],
  
  croms_radiology_therapies: [
    { key: 'indication', required: true },
    { key: 'therapy_type', required: true },
    { key: 'referral_date', required: true },
    { key: 'first_contact_date', required: true },
    { key: 'therapy_start_date', required: true },
    { key: 'therapy_end_date', required: true },
    { key: 'institution_name', required: true },
    { key: 'total_dose_in_gy', required: true },
    { key: 'given_fractions', required: true },
    { key: 'ptv_volume_in_cm3', required: true },
    { key: 'gtv_volume_in_cm3', required: true },
    { key: 'was_tumor_located_in_radiated_area', required: true },
    { key: 'was_tumor_located_with_pre_existing_lymph_edema', required: true },
    { key: 'comments', required: true },
    { key: 'hyperthermia_status', required: true },
  ],

  croms_systemic_therapies: [
    { key: 'reason', required: true },
    { key: 'treatment_line', required: true },
    { key: 'cycles_planned', required: true },
    { key: 'bone_protocol', required: true },
    { key: 'softtissue_protocol', required: true },
    { key: 'institution_name', required: true },
    { key: 'cycle_start_date', required: true },
    { key: 'cycle_end_date', required: true },
    { key: 'was_rct_concomittant', required: true },
    { key: 'comments', required: true },
    { key: 'clinical_trial_inclusion', required: true },
    { key: 'hyperthermia_status', required: true },
  ],

  croms_hyperthermia_therapies: [
    { key: 'indication', required: true },
    { key: 'start_date', required: true },
    { key: 'end_date', required: true },
    { key: 'hyperthermia_type', required: true },
    { key: 'therapy_sessions_count', required: true },
    { key: 'schedule', required: true },
    { key: 'board_accepted_indication', required: true },
    { key: 'comment', required: true },
    { key: 'therapy_type', required: true },
    { key: 'therapy_id', required: true }
  ],



};

export const calculateQualityMetrics = (
  moduleName: string,
  moduleData: ModuleData,
  fullPatientData?: Record<string, any>
): QualityMetrics => {
  const rules = completenessRules[moduleName] ?? Object.keys(moduleData).map((key) => ({ key, required: true }));
  
  let filled = 0;
  let total = 0;
  const warnings: string[] = [];

  const validKeys = new Set(rules.map((rule) => rule.key));

  for (const rule of rules) {
    const isRelevant = rule.required || (rule.conditional && rule.conditional(fullPatientData ?? {}));
    if (!isRelevant) continue;

    total += 1;

    if (!(rule.key in moduleData)) {
    warnings.push(`Expected field "${rule.key}" is completely missing in moduleData`);
    continue; 
  }

    if (!validKeys.has(rule.key)) continue;

    const value = moduleData[rule.key];
    const isFilled =
    typeof value === 'boolean'
    ? true
    : Array.isArray(value)
    ? value.length > 0
    : value !== null && value !== undefined && String(value).trim() !== '';

    
    if (isFilled) {
      filled += 1;
    } else {
      warnings.push(`Field "${rule.key}" is missing or empty`);
    }
  }

  return {
    name: moduleName,
    completeness: total ? Math.round((filled / total) * 100) : 0,
    fieldsFilled: filled,
    fieldsTotal: total,
    warnings
  };
};