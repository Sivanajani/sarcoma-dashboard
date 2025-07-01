from fastapi import APIRouter, HTTPException
from db.engine import engine_pg
from sqlalchemy import text
from utils.croms_completeness_rules import completeness_rules


router = APIRouter()

def get_available_modules(conn, pid):
    return {
        "systemic_therapy": conn.execute(
            text("SELECT id FROM croms_systemic_therapies WHERE patient_id = :pid LIMIT 1"),
            {"pid": pid}
        ).fetchone() is not None
    }

@router.get("/api/patients/completeness-overview")
def get_completeness_overview():
    try:
        with engine_pg.connect() as conn:
            patients = conn.execute(text("SELECT id FROM croms_patients")).fetchall()

            result_list = []

            for patient in patients:
                pid = patient[0]
                total_score = 0
                module_count = 0

                # Verfügbare Module abrufen (für Bedingungen)
                available_modules = get_available_modules(conn, pid)

                for module_name, (table, patient_col, fields) in completeness_rules.items():
                    # Dynamisch alle möglichen Spaltennamen extrahieren (auch aus dicts)
                    field_names = [f if isinstance(f, str) else f["key"] for f in fields]

                    result = conn.execute(
                        text(f"SELECT {', '.join(field_names)} FROM {table} WHERE {patient_col} = :pid LIMIT 1"),
                        {"pid": pid}
                    ).fetchone()

                    if result:
                        values = result._mapping
                        filled_fields = 0
                        relevant_fields = 0

                        for field in fields:
                            if isinstance(field, dict):
                                key = field["key"]
                                # Conditional prüfen
                                if "conditional" in field:
                                    try:
                                        arg_count = field["conditional"].__code__.co_argcount
                                        if arg_count == 1:
                                            if not field["conditional"](values):
                                                continue
                                        else:
                                            if not field["conditional"](available_modules):
                                                continue
                                    except Exception:
                                        continue
                            else:
                                key = field

                            relevant_fields += 1
                            if values.get(key) is not None:
                                filled_fields += 1

                        score = filled_fields / relevant_fields if relevant_fields > 0 else 0
                        total_score += score
                        module_count += 1

                avg_score = round(total_score / module_count, 2) if module_count else 0.0

                result_list.append({
                    "patient_id": pid,
                    "average_completeness": avg_score,
                    "modules_checked": module_count
                })

            return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
