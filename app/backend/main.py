from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.openapi.models import OAuthFlowPassword
from fastapi.security import OAuth2
from typing import Optional
from fastapi.openapi.utils import get_openapi

from routes.crom_avg_completeness import router as crom_completeness_router
from routes.crom_completness_module import router as crom_module_metrics_router
from routes.crom_tables import router as crom_tables_router
from routes.crom_patients import router as crom_patients_router
from routes import crom_correctness_module
from routes.crom_avg_correctness import router as crom_correctness_avg_router
from routes.crom_consistency_module import router as crom_consistency_router
from routes.crom_avg_consistency import router as crom_consistency_avg_router
from routes.crom_actuality_module import router as crom_actuality_module
from routes.crom_avg_actuality_module import router as crom_actuality_avg_router
from routes.crom_uniqueness_module import router as crom_uniqueness_router
from routes.crom_radiologyExams_module import router as crom_radiology_exam_router
from routes.crom_systemicTherapies_module import router as crom_systemic_therapies_router
from routes.crom_surgery_module import router as crom_surgery_router
from routes.crom_diagnoses_module import router as crom_diagnoses_router
from routes.crom_radiologyTherapies_module import router as crom_radiology_therapies_router
from routes.crom_pathology_module import router as crom_pathology_router
from routes.crom_hyperthermiaTherapies_module import router as crom_hyperthermia_therapies_router
from routes.crom_patient_module import router as crom_patient_router
from routes.crom_sarcomaBoard_module import router as crom_sarcoma_board_router
from routes.patient_quality_all import router as quality_router

from scheduler.alert_scheduler import start_alert_scheduler

class OAuth2PasswordBearerWithCookie(OAuth2):
    def __init__(self, tokenUrl: str):
        flows = OAuthFlowsModel(password=OAuthFlowPassword(tokenUrl=tokenUrl))
        super().__init__(flows=flows)

oauth2_scheme = OAuth2PasswordBearerWithCookie(
    tokenUrl="http://localhost:8080/realms/sarcoma-dashboard/protocol/openid-connect/token"
)


app = FastAPI(
    title="Sarcoma Dashboard API",
    version="1.0.0",
    description="API für das Datenqualitäts-Dashboard (CROMs, PROMs, Meta-Alerts)",
    dependencies=[],
    openapi_tags=[
        {"name": "CROMs", "description": "CROM-Datenzugriff"},
        {"name": "PROMs", "description": "PROM-Datenzugriff"},
        {"name": "Meta", "description": "Meta-Tabellen & Alerts"},
    ]
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi


from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("💥 VALIDATION ERROR bei Request:")
    print(exc)
    print("Body-Fehler:", exc.errors())
    print("Ursprünglicher Body:", await request.body())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )



# CORS Middleware aktivieren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

start_alert_scheduler()

# Datenbankverbindung für Module
app.include_router(crom_pathology_router)
app.include_router(crom_radiology_exam_router)
app.include_router(crom_systemic_therapies_router)
app.include_router(crom_surgery_router)
app.include_router(crom_diagnoses_router)
app.include_router(crom_radiology_therapies_router)
app.include_router(crom_hyperthermia_therapies_router)
app.include_router(crom_patient_router)
app.include_router(crom_sarcoma_board_router)

#Durschnitt Berechnung von der Vollstädnigkeit
app.include_router(crom_completeness_router)

# Vollständigkeit pro Modul
app.include_router(crom_module_metrics_router)

# Korrektheit pro Modul
app.include_router(crom_correctness_module.router)

# Durchschnittliche Korrektheit pro Patient
app.include_router(crom_correctness_avg_router)

# Konsistenz pro Modul
app.include_router(crom_consistency_router)

# Durchschnittliche Konsistenz pro Modul
app.include_router(crom_consistency_avg_router)

# Aktualität
app.include_router(crom_actuality_module)

# Durchschnittliche Aktualität pro Modul
app.include_router(crom_actuality_avg_router)

# Uniqueness
app.include_router(crom_uniqueness_router, prefix="/api")

# Tabellen anzeigen
app.include_router(crom_tables_router)

# Patientenanzahl in CROM und JSON-Liste mit allen patient_id etc.
app.include_router(crom_patients_router)




# Routen für PROMs
from routes.prom_tables import router as prom_tables_module
from routes.prom_completeness_module import router as prom_completeness_module
from routes.prom_correctness_module import router as prom_correctness_module
from routes.prom_consistency_module import router as prom_consistency_module
from routes.prom_actuality_module import router as prom_actuality_module
from routes.prom_avg_actuality import router as prom_avg_actuality_router
from routes.prom_uniqueness_module import router as prom_uniqueness_module
from routes.prom_avg_completeness import router as prom_avg_completeness_router
from routes.prom_avg_correctness import router as prom_avg_correctness_router
from routes.prom_avg_consistency import router as prom_avg_consistency_router
from routes.prom_patients import router as prom_patients_router
from routes.prom_eq5d_module import router as eq5d_router
from routes import patient_lookup
from routes.prom_biopsy_module import router as prom_biopsy_module

app.include_router(patient_lookup.router)

# PROM Patienten Routen
app.include_router(prom_patients_router)

# PROMs Vollständigkeit
app.include_router(prom_completeness_module)

# Durchschnittliche Vollständigkeit pro Patient
app.include_router(prom_avg_completeness_router)

# PROMs Korrektheit
app.include_router(prom_correctness_module)

# Durchschnittliche Korrektheit pro Patient
app.include_router(prom_avg_correctness_router)

# PROMs Konsistenz
app.include_router(prom_consistency_module)

# Durchschnittliche Konsistenz pro Patient
app.include_router(prom_avg_consistency_router)

# PROMs Aktualität
app.include_router(prom_actuality_module)

# Durchschnittliche Aktualität pro Patient
app.include_router(prom_avg_actuality_router)

# PROMs Eindeutigkeit
app.include_router(prom_uniqueness_module)

#Liste der PROMs Tabellen
app.include_router(prom_tables_module)

# EQ-5D Routen
app.include_router(eq5d_router)

# PROMs Biopsie Routen
app.include_router(prom_biopsy_module)

# Quality für alle CROM/PROM MODULEN 
app.include_router(quality_router)


# Routen für META DB und alerts

from routes.meta_data import router as meta_debug  
from routes.alerts import router as alert

#Liste der Tabellen, einfacher Test für DB Meta
app.include_router(meta_debug)

app.include_router(alert)

from routes.user_info import router as user_info_router
app.include_router(user_info_router)

from routes.field_routes import router as field_routes

app.include_router(field_routes)
