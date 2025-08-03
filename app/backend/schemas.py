from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from typing import List
from typing import Optional
from pydantic import EmailStr, BaseModel



# --- Pathalogy ---
class PathologyBase(BaseModel):
    data_entry_type: str
    biopsy_resection_date: Optional[date] = None
    registrate_date: Optional[date] = None
    first_report_date: Optional[date] = None
    final_report_date: Optional[date] = None
    prior_pathology: Optional[str] = None
    who_diagnosis: Optional[str] = None
    diagnostic_grading: Optional[str] = None
    judgment_of_surgical_margin: Optional[str] = None
    proliferation_index: Optional[str] = None
    mitoses_per_10hpf: Optional[str] = None
    extent_of_necrosis: Optional[str] = None
    closest_distance_to_margin_mm: Optional[int] = None
    biological_barrier_to_closest_margin: Optional[str] = None
    ihc_performed_status: Optional[str] = None
    fish_performed_status: Optional[str] = None
    rna_performed_status: Optional[str] = None
    dna_performed_status: Optional[str] = None
    ihc_result: Optional[str] = None
    fish_result: Optional[str] = None
    rna_result: Optional[str] = None
    dna_result: Optional[str] = None


# Für Lesen (GET)
class PathologyRead(PathologyBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True


# Für Updates (PUT)
class PathologyUpdate(PathologyBase):
    pass

# --- Radiology Exam ---
class RadiologyExamBase(BaseModel):
    exam_date: Optional[date] = None
    exam_type: Optional[str] = None
    imaging_timing: Optional[str] = None
    imaging_type: Optional[str] = None
    largest_lesion_size_in_mm: Optional[int] = None
    location_of_lesion: Optional[str] = None
    recist_response: Optional[str] = None
    comment: Optional[str] = None


class RadiologyExamRead(RadiologyExamBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True


class RadiologyExamUpdate(RadiologyExamBase):
    pass

# --- Systemic Therapy ---
class SystemicTherapyBase(BaseModel):
    reason: Optional[str] = None
    treatment_line: Optional[int] = None
    cycles_planned: Optional[str] = None
    bone_protocol: Optional[str] = None
    softtissue_protocol: Optional[str] = None
    institution_name: str
    cycle_start_date: Optional[date] = None
    cycle_end_date: Optional[date] = None
    discontinuation_reason: Optional[str] = None
    was_rct_concomittant: bool = False
    comments: Optional[str] = None
    clinical_trial_inclusion: Optional[str] = None
    hyperthermia_status: Optional[str] = None


class SystemicTherapyRead(SystemicTherapyBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True


class SystemicTherapyUpdate(SystemicTherapyBase):
    pass
 
# --- Surgery ---

class SurgeryBase(BaseModel):
    surgery_date: date
    institution_name: Optional[str] = None
    indication: Optional[str] = None
    surgery_side: Optional[str] = None
    greatest_surgical_tumor_dimension_in_mm: Optional[int] = None
    had_tumor_spillage: Optional[bool] = None
    first_revision_details: Optional[str] = None
    second_revision_details: Optional[str] = None
    anatomic_region: Optional[str] = None
    resection: Optional[str] = None
    reconstruction: Optional[str] = None
    amputation: Optional[str] = None
    resected_tumor_margin: Optional[str] = None
    participated_disciplines: Optional[List[str]] = None
    hemipelvectomy: Optional[List[str]] = None


class SurgeryRead(SurgeryBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True


class SurgeryUpdate(SurgeryBase):
    pass

# --- Diagnosis ---
class DiagnosisBase(BaseModel):
    tumor_anatomic_region: Optional[str] = None
    tumor_anatomic_lesion_side: Optional[str] = None
    tumor_syndromes: Optional[List[str]] = None
    tumor_diagnosis: Optional[str] = None
    additional_tumor_anatomic_region: Optional[str] = None
    additional_tumor_anatomic_lesion_side: Optional[str] = None
    additional_tumor_diagnosis: Optional[str] = None
    other_diagnosis: Optional[str] = None
    patient_history: Optional[str] = None
    diagnosis_ecog: Optional[int] = None
    last_contact_date: Optional[date] = None
    last_status: Optional[str] = None
    death_reason: Optional[str] = None


class DiagnosisRead(DiagnosisBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True


class DiagnosisUpdate(DiagnosisBase):
    pass

# --- Radiology Therapy ---
class RadiologyTherapyBase(BaseModel):
    indication: Optional[str] = None
    therapy_type: str
    referral_date: Optional[date] = None
    first_contact_date: Optional[date] = None
    therapy_start_date: date
    therapy_end_date: Optional[date] = None
    institution_name: Optional[str] = None
    total_dose_in_gy: Optional[float] = None
    given_fractions: Optional[int] = None
    ptv_volume_in_cm3: Optional[float] = None
    gtv_volume_in_cm3: Optional[float] = None
    was_tumor_located_in_radiated_area: Optional[bool] = None
    was_tumor_located_with_pre_existing_lymph_edema: Optional[bool] = None
    comments: Optional[str] = None
    hyperthermia_status: Optional[str] = None


class RadiologyTherapyRead(RadiologyTherapyBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True


class RadiologyTherapyUpdate(RadiologyTherapyBase):
    pass

# --- Hyperthermia Therapy ---
class HyperthermiaTherapyBase(BaseModel):
    indication: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    hyperthermia_type: Optional[str] = None
    therapy_sessions_count: Optional[int] = None
    schedule: Optional[str] = None
    board_accepted_indication: Optional[bool] = None
    comment: Optional[str] = None
    therapy_type: Optional[str] = None
    therapy_id: Optional[int] = None


class HyperthermiaTherapyRead(HyperthermiaTherapyBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True


class HyperthermiaTherapyUpdate(HyperthermiaTherapyBase):
    pass

# --- CROM Patient ---
class CROMPatientBase(BaseModel):
    external_code: str
    consent: bool
    ahv: str
    institution_name: Optional[str] = None
    last_name: str
    first_name: str
    birth_date: Optional[date] = None
    gender: str
    street_name: Optional[str] = None
    street_number: Optional[str] = None
    zip_code: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    insurance_name: Optional[str] = None
    insurance_class: Optional[str] = None
    insurance_number: Optional[str] = None
    general_practitioner_name: Optional[str] = None
    general_practitioner_email: Optional[str] = None


class CROMPatientRead(CROMPatientBase):
    id: int

    class Config:
        from_attributes = True


class CROMPatientUpdate(CROMPatientBase):
    pass

# --- CROM Sarcoma Board ---
class SarcomaBoardBase(BaseModel):
    presentation_date: date
    reason_for_presentation: Optional[str] = None
    status_before_follow_up: Optional[str] = None
    unplanned_excision_date: Optional[date] = None
    whoops_surgery_institution_name: Optional[str] = None
    status_after_follow_up: Optional[str] = None
    treatment_before_follow_up: Optional[str] = None
    follow_up_reason: Optional[str] = None
    question: Optional[str] = None
    last_execution: Optional[str] = None
    proposed_procedure: Optional[str] = None
    current_ecog: Optional[int] = None
    decision_surgery: Optional[str] = None
    decision_surgery_comment: Optional[str] = None
    decision_radio_therapy: Optional[str] = None
    decision_radio_therapy_comment: Optional[str] = None
    decision_systemic_surgery: Optional[str] = None
    decision_systemic_surgery_comment: Optional[str] = None
    decision_follow_up: Optional[str] = None
    decision_follow_up_comment: Optional[str] = None
    decision_diagnostics: Optional[str] = None
    decision_diagnostics_comment: Optional[str] = None
    decision_palliative_care: Optional[str] = None
    decision_palliative_care_comment: Optional[str] = None
    summary: Optional[str] = None
    further_details: Optional[str] = None
    fast_track: Optional[bool] = False


class SarcomaBoardRead(SarcomaBoardBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True


class SarcomaBoardUpdate(SarcomaBoardBase):
    pass


# --- PROM EQ5D ---
class Eq5dBase(BaseModel):
    date: date
    pid: str
    institution: Optional[str] = None
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    mobilitaet: Optional[int] = None
    selbstversorgung: Optional[int] = None
    gewohnte_aktivitaeten: Optional[int] = None
    schmerz: Optional[int] = None
    angst: Optional[int] = None
    questions: Optional[str] = None
    vas: Optional[int] = None
    belastung: Optional[int] = None
    funktion: Optional[int] = None

class Eq5dRead(Eq5dBase):
    row_id: int

    class Config:
        from_attributes = True

class Eq5dUpdate(Eq5dBase):
    pass

# --- PROM Biopsy ---
class PromsBiopsyBase(BaseModel):
    biopsy_date: date
    biopsy_pid: str
    biopsy_institution: Optional[str] = None
    biopsy_vorname: Optional[str] = None
    biopsy_nachname: Optional[str] = None
    biopsy_email: Optional[str] = None
    biopsy_notwendigkeit: Optional[bool] = None
    biopsy_angst: Optional[bool] = None
    biopsy_erklaerung: Optional[bool] = None
    biopsy_verstehen: Optional[bool] = None
    biopsy_schmerz_wie_erwartet: Optional[str] = None
    biopsy_schmerz: Optional[int] = None
    biopsy_medikamente: Optional[bool] = None
    biopsy_beobachtungszeitraum: Optional[str] = None
    biopsy_blutende_wunde: Optional[bool] = None
    biopsy_probleme_wunde: Optional[bool] = None
    biopsy_schmerzkontrolle: Optional[bool] = None
    biopsy_team_raum: Optional[int] = None
    biopsy_organisation: Optional[int] = None
    biopsy_eqvas: Optional[int] = None
    biopsy_questions: Optional[str] = None

class PromsBiopsyRead(PromsBiopsyBase):
    biopsy_row_id: int

    class Config:
        from_attributes = True

class PromsBiopsyUpdate(PromsBiopsyBase):
    pass

# --- PROM Personal Data ---
class PersonalDataBase(BaseModel):
    institution: Optional[str] = None
    pid: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_birth: Optional[date] = None
    gender: Optional[str] = None
    street: Optional[str] = None
    house_nr: Optional[str] = None
    post_code: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    insurance_company: Optional[str] = None
    insurance_class: Optional[str] = None
    insurance_number: Optional[str] = None
    ahv: Optional[str] = None
    consent: Optional[bool] = None


class PersonalDataRead(PersonalDataBase):
    row_id: int

    class Config:
        from_attributes = True


class PersonalDataUpdate(PersonalDataBase):
    pass


# --- Alert Schema (Meta-Datenbank) ---

class AlertBase(BaseModel):
    user_id: str
    patient_external_code: Optional[str] = None

    source: Optional[str] = None         
    module: str

    metric: Optional[str] = None         
    threshold: Optional[float] = None    
    field: Optional[str] = None          
    condition: str                       
    value: Optional[str] = None          
    message: Optional[str] = None        

    email: EmailStr
    frequency: Optional[str] = "daily"
    active: Optional[bool] = True

class AlertCreate(AlertBase):
    pass

class AlertRead(AlertBase):
    id: int
    last_triggered: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }

