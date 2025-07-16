from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_prom_db
from models_prom import Eq5d, Biopsy
from utils.prom_correctness.eq5d_correctness import check_eq5d_correctness
from utils.prom_correctness.biopsy_correctness import check_biopsy_correctness

router = APIRouter(prefix="/api")

def determine_flag(scores: list[float]) -> str | None:
    has_red = any(score < 40 for score in scores)
    has_yellow = any(40 <= score < 75 for score in scores)
    if has_red:
        return "red"
    elif has_yellow:
        return "yellow"
    return "green"

@router.get("/proms/correctness-overview")
def get_avg_prom_correctness(db: Session = Depends(get_prom_db)):
    try:
        # Alle einzigartigen PIDs sammeln
        eq5d_pids = set(pid for (pid,) in db.query(Eq5d.pid).distinct())
        biopsy_pids = set(pid for (pid,) in db.query(Biopsy.biopsy_pid).distinct())
        all_pids = eq5d_pids.union(biopsy_pids)

        result_list = []

        for pid in all_pids:
            scores = []

            # EQ5D prüfen
            record_eq5d = db.query(Eq5d).filter(Eq5d.pid == pid).order_by(Eq5d.date.desc()).first()
            if record_eq5d:
                result = check_eq5d_correctness(record_eq5d.__dict__)
                if isinstance(result.get("percent"), (int, float)):
                    scores.append(result["percent"])

            # Biopsy prüfen
            record_biopsy = db.query(Biopsy).filter(Biopsy.biopsy_pid == pid).order_by(Biopsy.biopsy_date.desc()).first()
            if record_biopsy:
                result = check_biopsy_correctness(record_biopsy.__dict__)
                if isinstance(result.get("percent"), (int, float)):
                    scores.append(result["percent"])

            avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
            flag = determine_flag(scores)

            result_list.append({
                "pid": pid,
                "average_correctness": avg_score,
                "modules_checked": len(scores),
                "flag": flag
            })

        return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
