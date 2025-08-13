from fastapi import APIRouter, Depends
import httpx

from sqlalchemy.orm import Session
from db.session import get_db, get_prom_db  
from models_prom import PersonalData  
from models import CROMPatient 

router = APIRouter(prefix="/api")

CROM_MODULES = [
    "diagnosis",
    "pathology",
    "surgery",
    "radiology_exam",
    "radiology_therapy",
    "sarcoma_board",
    "systemic_therapy",
    "hyperthermia_therapy"
]

PROM_MODULES = {
    "eq5d": {
        "completeness": "/api/proms/eq5d/completeness/{pid}",
        "actuality": "/api/proms/eq5d/actuality/{pid}"
    },
    "proms_biopsy": {
        "completeness": "/api/proms/biopsy/completeness/{pid}",
        "actuality": "/api/proms/biopsy/actuality/{pid}"
    }
}


def calculate_flag(scores):
    red = sum(1 for score in scores if score is not None and score < 60)
    yellow = sum(1 for score in scores if score is not None and 60 <= score < 90)

    if red > 0 or yellow >= 2:
        return "red flag"
    elif yellow == 1:
        return "yellow flag"
    else:
        return "ok"


@router.get("/patient-quality/all")
async def get_all_quality_data():
    base_url = "http://localhost:8000"
    async with httpx.AsyncClient() as client:
        # 1. CROM-Patienten
        resp_croms = await client.get(f"{base_url}/api/patients")
        crom_patients = resp_croms.json()

        # 2. PROM-Patienten
        resp_proms = await client.get(f"{base_url}/api/proms/patients")
        prom_patients = resp_proms.json()

        result = {}

        # 3. CROM-Logik
        for patient in crom_patients:
            crom_id = patient["id"]
            external_code = patient["patient_id"]

            if external_code not in result:
                result[external_code] = {}

            result[external_code]["crom_id"] = crom_id
            result[external_code]["croms"] = {}

            for module in CROM_MODULES:
                url = f"{base_url}/api/patients/by-external-code/{external_code}/{module}/details"
                try:
                    module_resp = await client.get(url)
                    if module_resp.status_code == 200:
                        data = module_resp.json()

                        completeness = data.get("completeness", {}).get("completeness_score")
                        correctness = data.get("correctness", {}).get("correctness_score")
                        consistency = data.get("consistency", {}).get("consistency_score")
                        actuality = data.get("actuality", {}).get("actuality_score")

                        scores = [completeness, correctness, consistency, actuality]
                        if any(scores):
                            result[external_code]["croms"][module] = {
                                "completeness": completeness,
                                "correctness": correctness,
                                "consistency": consistency,
                                "actuality": actuality,
                                "flag": calculate_flag(scores)
                            }

                except Exception as e:
                    print(f"[CROM] Fehler bei Patient {external_code}, Modul {module}: {e}")
                    continue

        # 4. PROM-Logik
        for patient in prom_patients:
            pid = patient["patient_id"]

            if pid not in result:
                result[pid] = {}

            result[pid]["prom_id"] = patient["id"]
            result[pid]["proms"] = {}

            for module, paths in PROM_MODULES.items():
                try:
                    comp_url = base_url + paths["completeness"].format(pid=pid)
                    comp_resp = await client.get(comp_url)
                    comp_data = comp_resp.json()
                    comp_values = [entry["completeness_percent"] for entry in comp_data if "completeness_percent" in entry]
                    avg_completeness = round(sum(comp_values) / len(comp_values), 2) if comp_values else None

                    act_url = base_url + paths["actuality"].format(pid=pid)
                    act_resp = await client.get(act_url)
                    act_data = act_resp.json()
                    act_score = act_data.get("aktualitaet_status", {}).get("aktualitaet_prozent")

                    scores = [avg_completeness, act_score]
                    if any(scores):
                        result[pid]["proms"][module] = {
                            "completeness": avg_completeness,
                            "actuality": act_score,
                            "flag": calculate_flag(scores)
                        }

                except Exception as e:
                    print(f"[PROM] Fehler bei Patient {pid}, Modul {module}: {e}")
                    continue
        
        # 5. Summary-Flag berechnen
        for patient_id, data in result.items():
            flags = []
            
            # Sammle alle Modul-Flags aus CROMs
            for module_data in data.get("croms", {}).values():
                flag = module_data.get("flag")
                if flag:
                    flags.append(flag)

            # Sammle alle Modul-Flags aus PROMs
            for module_data in data.get("proms", {}).values():
                flag = module_data.get("flag")
                if flag:
                    flags.append(flag)
            
            red_count = flags.count("red flag")
            yellow_count = flags.count("yellow flag")
            
            if red_count >= 1 or yellow_count > 2:
                summary_flag = "red flag"
            elif yellow_count >= 1:
                summary_flag = "yellow flag"
            else:
                summary_flag = "ok"
            result[patient_id]["summary_flag"] = summary_flag
        
        # 6. Gesamtanzahl Red Flags berechnen
        red_flag_count = sum(1 for data in result.values() if data.get("summary_flag") == "red flag")

        return {
            "patients": result,
            "red_flag_total": red_flag_count
        }
    
    return result


CROM_MODULE_NAME_MAP = {
    "diagnosis": "diagnoses",
    "radiology_exam": "radiology_exams",
    "radiology_therapy": "radiology_therapies",
    "systemic_therapy": "systemic_therapies",
    "surgery": "surgeries",
    "sarcoma_board": "sarcoma_boards",
    "pathology": "pathologies",
    "hyperthermia_therapy": "hyperthermia_therapies",
}


@router.get("/patient-quality/{external_code}")
async def get_quality_by_patient(external_code: str):
    base_url = "http://localhost:8000"
    async with httpx.AsyncClient() as client:
        result = {
            "patient_id": external_code,
            "croms": {},
            "proms": {}
        }

        # CROM-Patient abrufen
        crom_patients_resp = await client.get(f"{base_url}/api/patients")
        crom_patients = crom_patients_resp.json()
        crom_patient = next((p for p in crom_patients if p["patient_id"] == external_code), None)
        if crom_patient:
            result["crom_id"] = crom_patient["id"]
            for module in CROM_MODULES:
                try:
                    url = f"{base_url}/api/patients/by-external-code/{external_code}/{module}/details"
                    module_resp = await client.get(url)
                    if module_resp.status_code == 200:
                        data = module_resp.json()
                        scores = [
                            data.get("completeness", {}).get("completeness_score"),
                            data.get("correctness", {}).get("correctness_score"),
                            data.get("consistency", {}).get("consistency_score"),
                            data.get("actuality", {}).get("actuality_score")
                        ]
                        if any(scores):
                            mapped_name = CROM_MODULE_NAME_MAP.get(module, module)
                            result["croms"][mapped_name] = {
                                "completeness": scores[0],
                                "correctness": scores[1],
                                "consistency": scores[2],
                                "actuality": scores[3],
                                "flag": calculate_flag(scores)
                            }
                except Exception as e:
                    print(f"[CROM] Fehler bei Modul {module}: {e}")

        # PROM-Patient abrufen
        prom_patients_resp = await client.get(f"{base_url}/api/proms/patients")
        prom_patients = prom_patients_resp.json()
        prom_patient = next((p for p in prom_patients if p["patient_id"] == external_code), None)
        if prom_patient:
            result["prom_id"] = prom_patient["id"]
            for module, paths in PROM_MODULES.items():
                try:
                    comp_url = base_url + paths["completeness"].format(pid=external_code)
                    act_url = base_url + paths["actuality"].format(pid=external_code)

                    comp_resp = await client.get(comp_url)
                    comp_data = comp_resp.json()
                    comp_values = [entry["completeness_percent"] for entry in comp_data if "completeness_percent" in entry]
                    avg_comp = round(sum(comp_values) / len(comp_values), 2) if comp_values else None

                    act_resp = await client.get(act_url)
                    act_data = act_resp.json()
                    act_score = act_data.get("aktualitaet_status", {}).get("aktualitaet_prozent")

                    scores = [avg_comp, act_score]
                    if any(scores):
                        result["proms"][module] = {
                            "completeness": avg_comp,
                            "actuality": act_score,
                            "flag": calculate_flag(scores)
                        }

                except Exception as e:
                    print(f"[PROM] Fehler bei Modul {module}: {e}")

        # summary_flag berechnen
        flags = [m["flag"] for m in result["croms"].values()] + [m["flag"] for m in result["proms"].values()]
        red = flags.count("red flag")
        yellow = flags.count("yellow flag")
        if red >= 1 or yellow > 2:
            result["summary_flag"] = "red flag"
        elif yellow >= 1:
            result["summary_flag"] = "yellow flag"
        else:
            result["summary_flag"] = "ok"

        return result



@router.get("/patient-ids/all")
def get_all_patient_ids(
    db_prom: Session = Depends(get_prom_db),
    db_crom: Session = Depends(get_db)
):
    # PROM-Patient:innen (PID)
    prom_patients = db_prom.query(PersonalData.pid).all()
    prom_ids = [row.pid for row in prom_patients]

    # CROM-Patient:innen (external_code)
    crom_patients = db_crom.query(CROMPatient.external_code).all()
    crom_ids = [row.external_code for row in crom_patients]

    return {
        "prom_ids": prom_ids,
        "crom_ids": crom_ids,
        "total_prom": len(prom_ids),
        "total_crom": len(crom_ids),
        "all_patient_ids": prom_ids + crom_ids
    }
