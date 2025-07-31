from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.session import get_prom_db
from models_prom import Eq5d, Biopsy
from utils.prom_consistency.eq5d_consistency import check_eq5d_consistency
from utils.prom_consistency.biopsy_consistency import check_biopsy_consistency

router = APIRouter(prefix="/api")

@router.get("/prom/consistency/overview")
def get_avg_prom_consistency(db: Session = Depends(get_prom_db)):
    try:
        # Alle einzigartigen PIDs sammeln
        eq5d_pids = set(pid for (pid,) in db.query(Eq5d.pid).distinct())
        biopsy_pids = set(pid for (pid,) in db.query(Biopsy.biopsy_pid).distinct())
        all_pids = eq5d_pids.union(biopsy_pids)

        result_list = []

        for pid in all_pids:
            scores = []

            # Neuester EQ5D-Eintrag
            eq5d_entry = db.query(Eq5d).filter(Eq5d.pid == pid).order_by(Eq5d.date.desc()).first()
            if eq5d_entry:
                result = check_eq5d_consistency(eq5d_entry.__dict__)
                percent = result.get("percent")
                if isinstance(percent, (int, float)):
                    scores.append(percent)

            # Neuester Biopsy-Eintrag
            biopsy_entry = db.query(Biopsy).filter(Biopsy.biopsy_pid == pid).order_by(Biopsy.biopsy_date.desc()).first()
            if biopsy_entry:
                result = check_biopsy_consistency(biopsy_entry.__dict__)
                percent = result.get("percent")
                if isinstance(percent, (int, float)):
                    scores.append(percent)

            avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0

            result_list.append({
                "pid": pid,
                "average_consistency": avg_score,
                "modules_checked": len(scores)
            })

        return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
