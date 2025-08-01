# backend/routes/alerts.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_meta_db
from models_meta import Alert
from schemas import AlertCreate, AlertRead
from auth.keycloak import get_current_user_id

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
