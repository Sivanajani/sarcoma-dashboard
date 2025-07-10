from sqlalchemy import Column, BigInteger, String, Text, Integer, Date, TIMESTAMP, ARRAY, Boolean
from db.session import Base


class CROMDiagnosis(Base):
    __tablename__ = "croms_diagnoses"

    id = Column(BigInteger, primary_key=True, index=True)
    tumor_anatomic_region = Column(String, nullable=True)
    tumor_anatomic_lesion_side = Column(String, nullable=True)
    tumor_syndromes = Column(ARRAY(String), nullable=True)
    tumor_diagnosis = Column(Text, nullable=True)
    additional_tumor_anatomic_region = Column(String, nullable=True)
    additional_tumor_anatomic_lesion_side = Column(String, nullable=True)
    additional_tumor_diagnosis = Column(Text, nullable=True)
    other_diagnosis = Column(Text, nullable=True)
    patient_history = Column(Text, nullable=True)
    diagnosis_ecog = Column(Integer, nullable=True)
    last_contact_date = Column(Date, nullable=True)
    last_status = Column(String, nullable=True)
    death_reason = Column(String, nullable=True)
    patient_id = Column(BigInteger, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)


class CROMSurgery(Base):
    __tablename__ = "croms_surgeries"

    id = Column(BigInteger, primary_key=True, index=True)
    patient_id = Column(BigInteger, nullable=False)
    surgery_date = Column(Date, nullable=False)
    institution_name = Column(String, nullable=True)
    indication = Column(String, nullable=True)
    surgery_side = Column(String, nullable=True)
    greatest_surgical_tumor_dimension_in_mm = Column(Integer, nullable=True)
    had_tumor_spillage = Column(Boolean, nullable=True)
    first_revision_details = Column(String, nullable=True)
    second_revision_details = Column(String, nullable=True)
    anatomic_region = Column(String, nullable=True)
    resection = Column(String, nullable=True)
    reconstruction = Column(String, nullable=True)
    amputation = Column(String, nullable=True)
    resected_tumor_margin = Column(String, nullable=True)
    participated_disciplines = Column(ARRAY(String), nullable=True)
    hemipelvectomy = Column(ARRAY(String), nullable=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)

class CROMPathology(Base):
    __tablename__ = "croms_pathologies"

    id = Column(BigInteger, primary_key=True, index=True)
    data_entry_type = Column(String, nullable=False)
    biopsy_resection_date = Column(Date, nullable=True)
    registrate_date = Column(Date, nullable=True)
    first_report_date = Column(Date, nullable=True)
    final_report_date = Column(Date, nullable=True)
    prior_pathology = Column(String, nullable=True)
    who_diagnosis = Column(String, nullable=True)
    diagnostic_grading = Column(String, nullable=True)
    judgment_of_surgical_margin = Column(String, nullable=True)
    proliferation_index = Column(String, nullable=True)
    mitoses_per_10hpf = Column(String, nullable=True)
    extent_of_necrosis = Column(String, nullable=True)
    closest_distance_to_margin_mm = Column(Integer, nullable=True)
    biological_barrier_to_closest_margin = Column(String, nullable=True)
    ihc_performed_status = Column(String, nullable=True)
    fish_performed_status = Column(String, nullable=True)
    rna_performed_status = Column(String, nullable=True)
    dna_performed_status = Column(String, nullable=True)
    ihc_result = Column(String, nullable=True)
    fish_result = Column(String, nullable=True)
    rna_result = Column(String, nullable=True)
    dna_result = Column(String, nullable=True)
    patient_id = Column(BigInteger, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)
