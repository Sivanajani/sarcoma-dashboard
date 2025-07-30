from fastapi import APIRouter, HTTPException
from db.engine import engine_pg
from sqlalchemy import text

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
    

@router.get("/patients/{patient_id}/completeness/{module_name}")
def get_module_completeness(patient_id: int, module_name: str):
    try:
        with engine_pg.connect() as conn:
            if module_name not in completeness_rules:
                raise HTTPException(status_code=400, detail="Ungültiges Modul")

            table, patient_col, fields = completeness_rules[module_name]
            field_names = [f if isinstance(f, str) else f["key"] for f in fields]

            extra_fields_by_module = {
                "diagnosis": ["death_reason"],
                "pathology": ["ihc_performed_status", "fish_performed_status", "rna_performed_status", "dna_performed_status"]
            }
            
            extra_fields = extra_fields_by_module.get(module_name, [])
            field_names = list(set(field_names + extra_fields))



            result = conn.execute(
                text(f"SELECT {', '.join(field_names)} FROM {table} WHERE {patient_col} = :pid LIMIT 1"),
                {"pid": patient_id}
            ).mappings().fetchone()

            if not result:
                raise HTTPException(status_code=404, detail="Moduldaten nicht gefunden")

            values = dict(result)
            available_modules = get_available_modules(conn, patient_id)

            filled = 0
            total = 0
            missing_fields = []

            for field in fields:
                if isinstance(field, dict):
                    key = field["key"]
                    if "conditional" in field:
                        arg_count = field["conditional"].__code__.co_argcount
                        condition = field["conditional"]
                        if (arg_count == 1 and not condition(values)) or (arg_count > 1 and not condition(available_modules)):
                            continue
                else:
                    key = field

                total += 1
                if values.get(key) is not None:
                    filled += 1
                else:
                    missing_fields.append(key)

            score = round((filled / total) * 100, 2) if total else 0.0

            return {
                "module": module_name,
                "patient_id": patient_id,
                "completeness_score": score,
                "fields_filled": filled,
                "fields_total": total,
                "missing_fields": missing_fields
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

