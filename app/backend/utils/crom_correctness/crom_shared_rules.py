from datetime import datetime, date
import re
from sqlalchemy import text

def is_allowed_value(value, allowed_values: list) -> bool:
    if value is None:
        return False

    def normalize(val):
        return re.sub(r"\s+", " ", str(val).strip().lower()
                    .replace("_", " ")
                    .replace("-", " ")
                    .replace(":", " ")
                    .replace("/", " ")
                    .replace(",", " "))

    normalized_allowed = [normalize(v) for v in allowed_values]

    def value_matches(val):
        val = normalize(val)
        for allowed in normalized_allowed:
            pattern = rf"\b{re.escape(allowed)}\b"
            if re.search(pattern, val):
                return True
        print(f"[DEBUG] '{val}' not matching any allowed values")
        return False

    if isinstance(value, list):
        return all(value_matches(v) for v in value)

    return value_matches(value)

def is_valid_date(date_str: str, birth_date: str = None) -> bool:
    try:
        if not date_str:
            return False

        if isinstance(date_str, (datetime, date)):
            date_str = date_str.isoformat()

        if birth_date and isinstance(birth_date, (datetime, date)):
            birth_date = birth_date.isoformat()

        print(f"[DEBUG] Checking date: {date_str} vs today: {datetime.today().strftime('%Y-%m-%d')}")

        date_val = datetime.strptime(date_str, "%Y-%m-%d")
        today = datetime.today()

        if birth_date:
            birth = datetime.strptime(birth_date, "%Y-%m-%d")
            return birth <= date_val <= today

        return date_val <= today
    except Exception as e:
        print(f"[ERROR] Invalid date: {date_str}, error: {e}")
        return False

def is_prefixed_allowed_value(value: str, allowed_prefixes: list[str]) -> bool:
    if not isinstance(value, str):
        return False
    val = value.lower().replace("_", " ")
    return any(val.startswith(prefix.lower()) for prefix in allowed_prefixes)

def has_allowed_suffix(value: str, allowed_suffixes: list[str]) -> bool:
    """
    Prüft, ob der Eintrag mit einem der erlaubten Suffixe endet (Groß-/Kleinschreibung egal, inkl. Normalisierung).
    """
    if not isinstance(value, str):
        return False

    def normalize(val):
        return str(val).strip().lower().replace("_", " ").replace("-", " ")

    normalized_value = normalize(value)

    for suffix in allowed_suffixes:
        normalized_suffix = normalize(suffix)
        if normalized_value.endswith(normalized_suffix):
            return True

    print(f"[DEBUG] '{value}' has no allowed suffix from list {allowed_suffixes}")
    return False

def is_allowed_schedule_value(value: str, full_allowed: list[str], allowed_suffixes: list[str]) -> bool:
    """
    Kombiniert Vollwert-Check und Suffix-Check:
    - z. B. erlaubt: „täglich“, „nach Bedarf“ (volle Werte)
    - oder: „3x /Woche“, „10x /Monat“ (flexibler Präfix, erlaubtes Suffix)
    """
    if not isinstance(value, str):
        return False

    def normalize(val):
        return str(val).strip().lower().replace("_", " ").replace("-", " ").replace(":"," ")

    norm_val = normalize(value)
    norm_full = [normalize(v) for v in full_allowed]
    norm_suffixes = [normalize(s) for s in allowed_suffixes]

    if norm_val in norm_full:
        return True

    for suffix in norm_suffixes:
        if norm_val.endswith(suffix):
            return True

    print(f"[DEBUG] '{value}' is neither a full allowed value nor has valid suffix")
    return False

def validate_cycles_planned(value: str) -> bool | None:
    """
    Validiert 'cycles_planned' grob:
    - Akzeptiert Freitext
    - Gibt True zurück, wenn eine vernünftige Zahl (1–20) enthalten ist
    - Gibt None zurück, wenn kein numerischer Wert enthalten ist (Freitext wie 'nach Bedarf')
    - Gibt False zurück, wenn eine zu hohe oder zu niedrige Zahl enthalten ist
    """
    if not isinstance(value, str):
        return False
    
    numbers = re.findall(r'\d+', value)
    if not numbers:
        return None  # kein Zyklus angegeben → weder richtig noch falsch

    return any(1 <= int(n) <= 20 for n in numbers)

def compute_correctness_result(entry: dict, validation_fn, birth_date: str = None, module_name: str = "") -> dict:
    result = validation_fn(entry, birth_date)

    # Nur Felder prüfen, die im Entry auch wirklich ausgefüllt sind
    relevant_fields = {
        key: value
        for key, value in result.items()
        if entry.get(key) not in [None, "", [], {}] and value is not None
    }

    correct_count = sum(1 for v in relevant_fields.values() if v is True)
    total_count = len(relevant_fields)
    percent = round((correct_count / total_count) * 100, 2) if total_count > 0 else None

    return {
        "module": module_name,
        "correct": correct_count,
        "total": total_count,
        "percent": percent,
        "field_results": result
    }


def fetch_birth_date(conn, patient_id):
    birth_result = conn.execute(
        text("SELECT birth_date FROM croms_patients WHERE id = :pid"),
        {"pid": patient_id}
    ).mappings().fetchone()
    return birth_result["birth_date"].isoformat() if birth_result and birth_result["birth_date"] else None
