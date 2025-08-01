from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime
from db.session import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Text, nullable=False)
    patient_external_code = Column(Text, nullable=True)  
    module = Column(Text, nullable=False)
    metric = Column(Text, nullable=False)
    threshold = Column(Float, nullable=False)
    condition = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    frequency = Column(Text, nullable=True, default="daily")
    active = Column(Boolean, nullable=True, default=True)
    last_triggered = Column(DateTime, nullable=True)  