from fastapi import APIRouter, Depends
from auth.keycloak import get_current_user_payload

router = APIRouter()

@router.get("/me")
def get_me(user: dict = Depends(get_current_user_payload)):
    return {
        "user_id": user.get("sub"),
        "username": user.get("preferred_username"),
        "email": user.get("email"),
        "name": user.get("name"),
        "roles": user.get("realm_access", {}).get("roles", [])
    }

