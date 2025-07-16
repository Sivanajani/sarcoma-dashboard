from sqlalchemy import Column, Integer, BigInteger, Text, Date
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
