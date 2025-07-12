from pydantic import BaseModel
from typing import Optional
from datetime import date


# Gemeinsame Basis
class PathologyBase(BaseModel):
    data_entry_type: str
    biopsy_resection_date: Optional[date] = None
    registrate_date: Optional[date] = None
    first_report_date: Optional[date] = None
    final_report_date: Optional[date] = None
    prior_pathology: Optional[str] = None
    who_diagnosis: Optional[str] = None
    diagnostic_grading: Optional[str] = None
    judgment_of_surgical_margin: Optional[str] = None
    proliferation_index: Optional[str] = None
    mitoses_per_10hpf: Optional[str] = None
    extent_of_necrosis: Optional[str] = None
    closest_distance_to_margin_mm: Optional[int] = None
    biological_barrier_to_closest_margin: Optional[str] = None
    ihc_performed_status: Optional[str] = None
    fish_performed_status: Optional[str] = None
    rna_performed_status: Optional[str] = None
    dna_performed_status: Optional[str] = None
    ihc_result: Optional[str] = None
    fish_result: Optional[str] = None
    rna_result: Optional[str] = None
    dna_result: Optional[str] = None


# Für Lesen (GET)
class PathologyRead(PathologyBase):
    id: int
    patient_id: int

    class Config:
        orm_mode = True


# Für Updates (PUT)
class PathologyUpdate(PathologyBase):
    pass
