from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from db.session import get_db  

router = APIRouter(prefix="/api")

def check_crom_alerts(db: Session) -> List[dict]:
    alerts = []

    # 1. Diagnoses
    diagnoses = db.execute(text("SELECT patient_id, tumor_diagnosis, tumor_anatomic_region, last_status FROM croms_diagnoses")).fetchall()
    for d in diagnoses:
        if not d.tumor_diagnosis:
            alerts.append({"patient_id": d.patient_id, "module": "diagnosis", "field": "tumor_diagnosis", "reason": "missing"})
        if not d.tumor_anatomic_region:
            alerts.append({"patient_id": d.patient_id, "module": "diagnosis", "field": "tumor_anatomic_region", "reason": "missing"})
        if not d.last_status:
            alerts.append({"patient_id": d.patient_id, "module": "diagnosis", "field": "last_status", "reason": "missing"})

    # 2. Pathology
    pathologies = db.execute(text("SELECT patient_id, diagnostic_grading FROM croms_pathologies")).fetchall()
    for p in pathologies:
        if not p.diagnostic_grading:
            alerts.append({"patient_id": p.patient_id, "module": "pathology", "field": "diagnostic_grading", "reason": "missing"})

    # 3. RadiologyExam
    exams = db.execute(text("SELECT patient_id, metastasis_presence FROM croms_radiology_exams")).fetchall()
    for e in exams:
        if e.metastasis_presence == "ja":
            alerts.append({"patient_id": e.patient_id, "module": "radiology_exam", "field": "metastasis_presence", "reason": "value = 'ja'"})

    return alerts

@router.get("/alerts/croms")
def get_crom_alerts(db: Session = Depends(get_db)):
    return check_crom_alerts(db)
