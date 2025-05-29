export type Patient = {
  patient_id: string;
  sex: 'male' | 'female' | 'other';
  birth_date: string;
  insurance_name: string;

  diagnosis?: Diagnosis;
  tumor?: Tumor;
  sarcomaBoards?: SarcomaBoard[];

  radiologyExams?: RadiologyExam[];
  pathologyReports?: Pathology[];
  surgeries?: Surgery[];
  systemicTherapies?: SystemicTherapy[];
  radiologyTherapies?: RadiologyTherapy[];
  hyperthermias?: Hyperthermia[];
};

// === Diagnosis ===
export type Diagnosis = {
  main_referral_diagnosis: string;
  cancer_syndrome: string;
  diagnosis_date: string;
};

// === Tumor ===
export type Tumor = {
  anatomic_region: string;
  anatomic_region_side: 'left' | 'right' | 'both' | 'unknown';
  clinical_history: string;
};

// === SarcomaBoard ===
export type SarcomaBoard = {
  presentation_date: string;
  reason_for_presentation: string;
  final_instruction: string;
  decision_surgery: boolean;
  decision_radiotherapy: boolean;
  decision_systemic_therapy: boolean;
  fast_track: boolean;
};

// === RadiologyExam ===
export type RadiologyExam = {
  exam_date: string;
  imaging_type: string;
  number_lesions_total: number;
  local_response: string;
};

// === Pathology ===
export type Pathology = {
  biopsy_date: string;
  histological_diagnosis: string;
  r_status: 'R0' | 'R1' | 'R2';
};

// === Surgery ===
export type Surgery = {
  surgery_date: string;
  surgical_type: string;
  anatomical_resect: boolean;
  enbloc_resection: boolean;
};

// === SystemicTherapy ===
export type SystemicTherapy = {
  reason: string;
  chemo_protocol: string;
  start_date: string;
  cycles_planned: number;
  cycles_done: number;
  toxicity_grade: number;
};

// === RadiologyTherapy ===
export type RadiologyTherapy = {
  therapy_type: string;
  indication: string;
  start_date: string;
  end_date?: string;
  dose_gy?: number;
};

// === Hyperthermia ===
export type Hyperthermia = {
  indication: string;
  start_date: string;
  end_date?: string;
  sessions_count: number;
};