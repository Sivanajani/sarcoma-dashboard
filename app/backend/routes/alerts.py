# backend/routes/alerts.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_meta_db, get_db
from models_meta import Alert
from schemas import AlertCreate, AlertRead
from auth.keycloak import get_current_user_id
from typing import List
from sqlalchemy import text
from alerts.alert_processor import process_alerts

router = APIRouter()

@router.get("/alerts/me", response_model=list[AlertRead])
def get_user_alerts(
    db: Session = Depends(get_meta_db),
    user_id: str = Depends(get_current_user_id)
):
    return db.query(Alert).filter(Alert.user_id == user_id).all()

@router.post("/alerts", response_model=AlertRead)
def create_alert(
    alert: AlertCreate,
    db: Session = Depends(get_meta_db),
    user_id: str = Depends(get_current_user_id)
):
    new_alert = Alert(**alert.dict(), user_id=user_id)
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

from collections import defaultdict


def check_crom_alerts(db: Session) -> List[dict]:
    grouped_alerts = defaultdict(list)

    # Mapping: ID -> external_code
    patients = db.execute(text("SELECT id, external_code FROM croms_patients")).fetchall()
    id_to_external = {p.id: p.external_code for p in patients}

    # 1. Diagnoses
    diagnoses = db.execute(text("SELECT patient_id, tumor_diagnosis, tumor_anatomic_region, last_status FROM croms_diagnoses")).fetchall()
    for d in diagnoses:
        ext_id = id_to_external.get(d.patient_id)
        if not ext_id:
            continue
        if not d.tumor_diagnosis:
            grouped_alerts[ext_id].append({
                "module": "diagnosis", "field": "tumor_diagnosis", "reason": "missing"
            })
        if not d.tumor_anatomic_region:
            grouped_alerts[ext_id].append({
                "module": "diagnosis", "field": "tumor_anatomic_region", "reason": "missing"
            })
        if not d.last_status:
            grouped_alerts[ext_id].append({
                "module": "diagnosis", "field": "last_status", "reason": "missing"
            })

    # 2. Pathology
    pathologies = db.execute(text("SELECT patient_id, diagnostic_grading FROM croms_pathologies")).fetchall()
    for p in pathologies:
        ext_id = id_to_external.get(p.patient_id)
        if not ext_id:
            continue
        if not p.diagnostic_grading:
            grouped_alerts[ext_id].append({
                "module": "pathology", "field": "diagnostic_grading", "reason": "missing"
            })

    # 3. RadiologyExam mit boolean result
    exams = db.execute(text("SELECT patient_id, metastasis_presence FROM croms_radiology_exams")).fetchall()
    for e in exams:
        ext_id = id_to_external.get(e.patient_id)
        if not ext_id:
            continue
        if e.metastasis_presence:
            grouped_alerts[ext_id].append({
                "module": "radiology_exam",
                "field": "metastasis_presence",
                "reason": True
            })


    # In Liste umwandeln
    return [
        {"external_code": ext_id, "alerts": alerts}
        for ext_id, alerts in grouped_alerts.items()
    ]

@router.get("/alerts/croms/raw", tags=["alerts"])
def get_raw_crom_alerts(db: Session = Depends(get_db)):
    return check_crom_alerts(db)

@router.get("/trigger-alerts")
def trigger_alerts():
    process_alerts()
    return {"status": "Alerts processed"}