from sqlalchemy import Column, Integer, BigInteger, Text, Date, String, Boolean
from db.session import Base  

class Eq5d(Base):
    __tablename__ = "eq5d"

    row_id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=True)
    pid = Column(BigInteger, nullable=False)
    institution = Column(Text, nullable=True)
    vorname = Column(Text, nullable=True)
    nachname = Column(Text, nullable=True)
    mobilitaet = Column(Integer, nullable=True)
    selbstversorgung = Column(Integer, nullable=True)
    gewohnte_aktivitaeten = Column(Integer, nullable=True)
    schmerz = Column(Integer, nullable=True)
    angst = Column(Integer, nullable=True)
    questions = Column(Text, nullable=True)
    vas = Column(Integer, nullable=True)
    belastung = Column(Integer, nullable=True)
    funktion = Column(Integer, nullable=True)

class Biopsy(Base):
    __tablename__ = "proms_biopsy"

    biopsy_row_id = Column(Integer, primary_key=True, index=True)
    biopsy_date = Column(Date, nullable=True)
    biopsy_pid = Column(BigInteger, nullable=False)
    biopsy_institution = Column(String, nullable=True)
    biopsy_vorname = Column(String, nullable=True)
    biopsy_nachname = Column(String, nullable=True)
    biopsy_email = Column(String, nullable=True)

    biopsy_notwendigkeit = Column(Boolean, nullable=True)
    biopsy_angst = Column(Boolean, nullable=True)
    biopsy_erklaerung = Column(Boolean, nullable=True)
    biopsy_verstehen = Column(Boolean, nullable=True)

    biopsy_schmerz_wie_erwartet = Column(String, nullable=True)
    biopsy_schmerz = Column(Integer, nullable=True)
    biopsy_medikamente = Column(Boolean, nullable=True)
    biopsy_beobachtungszeitraum = Column(String, nullable=True)
    biopsy_blutende_wunde = Column(Boolean, nullable=True)
    biopsy_probleme_wunde = Column(Boolean, nullable=True)
    biopsy_schmerzkontrolle = Column(Boolean, nullable=True)

    biopsy_team_raum = Column(Integer, nullable=True)
    biopsy_organisation = Column(Integer, nullable=True)
    biopsy_eqvas = Column(Integer, nullable=True)
    biopsy_questions = Column(String, nullable=True)

