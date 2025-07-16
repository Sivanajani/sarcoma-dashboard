from fastapi import APIRouter
from utils.prom_uniqueness import check_uniqueness_eq5d, check_uniqueness_biopsy

router = APIRouter()

@router.get("/api/proms/eq5d/uniqueness")
def get_eq5d_uniqueness_violations():
    return check_uniqueness_eq5d()

@router.get("/api/proms/biopsy/uniqueness")
def get_biopsy_uniqueness_violations():
    return check_uniqueness_biopsy()
