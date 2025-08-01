from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, jwk
import requests
import os

# Token-URL für OAuth2PasswordBearer (wird für Swagger verwendet, nicht zur Prüfung)
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="http://localhost:8080/realms/sarcoma-dashboard/protocol/openid-connect/token"
)

# Keycloak-Konfiguration
REALM = "sarcoma-dashboard"
KEYCLOAK_URL = os.getenv("KEYCLOAK_INTERNAL_URL", "http://localhost:8080")
REALM_URL = f"{KEYCLOAK_URL}/realms/{REALM}"


# Lädt den ersten öffentlichen JWK-Schlüssel aus dem JWKS-Set
def get_public_jwk() -> dict:
    try:
        jwks_url = f"{REALM_URL}/protocol/openid-connect/certs"
        jwks = requests.get(jwks_url).json()
        print("Alle JWKs:", jwks)  # Debug-Ausgabe

        for key in jwks["keys"]:
            if key.get("use") == "sig" and key.get("alg") == "RS256":
                print("Verwendeter Signatur-Key:", key["kid"])  # Debug
                return key

        raise Exception("Kein geeigneter Signaturschlüssel gefunden.")
    except Exception as e:
        print("Fehler beim Laden des JWK:", e)
        raise HTTPException(status_code=500, detail="Public key fetch error")



# Gibt nur die user_id (sub) zurück
def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    try:
        print("TOKEN BEGINN:", token[:30])  # nur Anfang des Tokens loggen
        jwk_data = get_public_jwk()
        key = jwk.construct(jwk_data, algorithm="RS256")
        payload = jwt.decode(
            token,
            key=key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        print("Decoded JWT payload:", payload)
        return payload["sub"]
    except JWTError as e:
        print("JWT Decode Error:", e)
        raise HTTPException(status_code=401, detail="Invalid token")


# Gibt den kompletten Payload zurück
def get_current_user_payload(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        print("TOKEN BEGINN:", token[:30])  # Debug-Ausgabe des Tokens
        jwk_data = get_public_jwk()
        key = jwk.construct(jwk_data, algorithm="RS256")  # korrekter JWK
        payload = jwt.decode(
            token,
            key=key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        print("Decoded JWT payload:", payload)
        return payload
    except JWTError as e:
        print("JWT Decode Error:", e)
        raise HTTPException(status_code=401, detail="Invalid token")