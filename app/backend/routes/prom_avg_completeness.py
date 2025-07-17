from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from db.engine import engine_prom
from utils.prom_completeness.eq5d_completeness import calculate_eq5d_completeness
from utils.prom_completeness.biopsy_completeness import calculate_biopsy_completeness

router = APIRouter(prefix="/api")

def determine_flag(scores: list[float]) -> str | None:
    has_red = any(score < 40 for score in scores)
    has_yellow = any(40 <= score < 75 for score in scores)
    if has_red:
        return "red"
    elif has_yellow:
        return "yellow"
    return "green"

@router.get("/proms/completeness/average")
def get_avg_prom_completeness():
    try:
        with engine_prom.connect() as conn:
            eq5d_rows = conn.execute(text("SELECT * FROM eq5d")).mappings().all()
            biopsy_rows = conn.execute(text("SELECT * FROM proms_biopsy")).mappings().all()

        all_pids = set()
        for row in eq5d_rows:
            all_pids.add(row["pid"])
        for row in biopsy_rows:
            all_pids.add(row["biopsy_pid"])

        result_list = []

        for pid in all_pids:
            scores = []

            # EQ5D
            eq5d_row = next((r for r in eq5d_rows if r["pid"] == pid), None)
            if eq5d_row:
                result = calculate_eq5d_completeness(eq5d_row)
                if isinstance(result.get("completeness_percent"), (int, float)):
                    scores.append(result["completeness_percent"])

            # Biopsy
            biopsy_row = next((r for r in biopsy_rows if r["biopsy_pid"] == pid), None)
            if biopsy_row:
                result = calculate_biopsy_completeness(biopsy_row)
                if isinstance(result.get("completeness_percent"), (int, float)):
                    scores.append(result["completeness_percent"])

            avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
            flag = determine_flag(scores)

            result_list.append({
                "pid": pid,
                "average_completeness": avg_score,
                "modules_checked": len(scores),
                "flag": flag
            })

        return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))