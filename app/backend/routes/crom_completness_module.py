from fastapi import APIRouter, HTTPException
from db.engine import engine_pg
from sqlalchemy import text

# Regeln importieren (optional auch aus zentraler Datei auslagern)
from .crom_avg_completeness import get_available_modules  
from utils.croms_completeness_rules import completeness_rules

router = APIRouter()

@router.get("/api/patients/{patient_id}/module-metrics")
def get_patient_module_metrics(patient_id: int):
    try:
        with engine_pg.connect() as conn:
            available_modules = get_available_modules(conn, patient_id)
            module_metrics = []

            for module_name, (table, patient_col, fields) in completeness_rules.items():
                field_names = [f if isinstance(f, str) else f["key"] for f in fields]

                result = conn.execute(
                    text(f"SELECT {', '.join(field_names)} FROM {table} WHERE {patient_col} = :pid LIMIT 1"),
                    {"pid": patient_id}
                ).fetchone()

                if result:
                    values = result._mapping
                    filled_fields = 0
                    relevant_fields = 0

                    for field in fields:
                        if isinstance(field, dict):
                            key = field["key"]
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

                    completeness = round((filled_fields / relevant_fields) * 100, 2) if relevant_fields else 0.0

                    module_metrics.append({
                        "name": module_name,
                        "completeness": completeness,
                        "fieldsFilled": filled_fields,
                        "fieldsTotal": relevant_fields
                    })

            return module_metrics

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
