from fastapi import APIRouter
import httpx

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