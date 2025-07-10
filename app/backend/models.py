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


