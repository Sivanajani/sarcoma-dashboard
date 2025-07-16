from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app = FastAPI()

# CORS Middleware aktivieren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# PROMs Vollständigkeit
app.include_router(prom_completeness_module)

# PROMs Korrektheit
app.include_router(prom_correctness_module)

# PROMs Konsistenz
app.include_router(prom_consistency_module)

# PROMs Aktualität
app.include_router(prom_actuality_module)

#Liste der PROMs Tabellen
app.include_router(prom_tables_module)
