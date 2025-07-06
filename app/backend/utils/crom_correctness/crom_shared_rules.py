from datetime import datetime, date
import re
from sqlalchemy import text

def try_parse_date(date_str):
    if isinstance(date_str, (datetime, date)):
        return date_str
    
    for fmt in ("%Y-%m-%d", "%d.%m.%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None


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
            if val == allowed:
                return True
        
        #print(f"[DEBUG] '{val}' not matching any allowed values")
        return False

    if isinstance(value, (list, set)):
        return all(value_matches(v) for v in value)

    return value_matches(value)

def is_valid_date(date_str: str, birth_date: str = None) -> bool:
    try:
        if not date_str:
            return False

        # Falls schon datetime oder date, in ISO umwandeln
        if isinstance(date_str, (datetime, date)):
            date_str = date_str.isoformat()

        if birth_date and isinstance(birth_date, (datetime, date)):
            birth_date = birth_date.isoformat()

        #print(f"[DEBUG] Checking date: {date_str} vs today: {datetime.today().strftime('%Y-%m-%d')}")

        # Datum parsen
        date_val = try_parse_date(date_str)
        if not date_val:
            #print(f"[ERROR] Unable to parse date: {date_str}")
            return False

        # Konvertiere zu datetime.date, wenn datetime
        if isinstance(date_val, datetime):
            date_val = date_val.date()

        today = datetime.today().date()

        if birth_date:
            birth = try_parse_date(birth_date)
            if not birth:
                #print(f"[ERROR] Unable to parse birth date: {birth_date}")
                return False
            if isinstance(birth, datetime):
                birth = birth.date()
            return birth <= date_val <= today

        return date_val <= today

    except Exception as e:
        #print(f"[ERROR] Invalid date: {date_str}, error: {e}")
        return False

def is_before_date(date_a: str, date_b: str) -> bool:
    try:
        parsed_a = try_parse_date(date_a)
        parsed_b = try_parse_date(date_b)

        if not parsed_a or not parsed_b:
            return False

        return parsed_a < parsed_b
    except Exception as e:
        #print(f"[ERROR] is_before_date: {e}")
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

    #print(f"[DEBUG] '{value}' has no allowed suffix from list {allowed_suffixes}")
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

    #print(f"[DEBUG] '{value}' is neither a full allowed value nor has valid suffix")
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
 

def validate_referral_date_field(entry: dict, birth_date: str = None) -> dict:
    referral = entry.get("referral_date")
    result = {}

    # Wenn kein Datum angegeben → kein valider Wert möglich
    if not referral:
        result["referral_date"] = False
        return result

    parsed_referral = try_parse_date(referral)
    if not parsed_referral:
        #print(f"[ERROR] referral_date nicht parsebar: {referral}")
        result["referral_date"] = False
        return result

    if isinstance(parsed_referral, datetime):
        parsed_referral = parsed_referral.date()

    today = datetime.today().date()

    # Check: referral_date <= today
    if parsed_referral > today:
        #print(f"[ERROR] referral_date {parsed_referral} liegt in der Zukunft.")
        result["referral_date"] = False
        return result

    # Check: referral_date >= birth_date
    if birth_date:
        parsed_birth = try_parse_date(birth_date)
        if not parsed_birth:
            #print(f"[ERROR] birth_date nicht parsebar: {birth_date}")
            result["referral_date"] = False
            return result

        if isinstance(parsed_birth, datetime):
            parsed_birth = parsed_birth.date()

        if parsed_referral < parsed_birth:
            #print(f"[ERROR] referral_date {parsed_referral} liegt vor birth_date {parsed_birth}")
            result["referral_date"] = False
            return result
    
    first_contact = entry.get("first_contact_date")
    if first_contact:
        parsed_first_contact = try_parse_date(first_contact)
        if not parsed_first_contact:
            #print(f"[ERROR] first_contact_date nicht parsebar: {first_contact}")
            result["referral_date"] = False
            return result

        if isinstance(parsed_first_contact, datetime):
            parsed_first_contact = parsed_first_contact.date()

        if parsed_referral > parsed_first_contact:
            #print(f"[ERROR] referral_date {parsed_referral} liegt nach first_contact_date {parsed_first_contact}")
            result["referral_date"] = False
            return result

    result["referral_date"] = True
    return result

def validate_therapy_start_date_field(entry: dict, birth_date: str = None) -> dict:
    result = {}
    therapy_start = entry.get("therapy_start_date")

    if not therapy_start:
        result["therapy_start_date"] = False
        return result

    parsed_start = try_parse_date(therapy_start)
    if not parsed_start:
        #print(f"[ERROR] therapy_start_date nicht parsebar: {therapy_start}")
        result["therapy_start_date"] = False
        return result

    if isinstance(parsed_start, datetime):
        parsed_start = parsed_start.date()

    today = datetime.today().date()
    if parsed_start > today:
        #print(f"[ERROR] therapy_start_date {parsed_start} liegt in der Zukunft.")
        result["therapy_start_date"] = False
        return result

    if birth_date:
        parsed_birth = try_parse_date(birth_date)
        if not parsed_birth:
            #print(f"[ERROR] birth_date nicht parsebar: {birth_date}")
            result["therapy_start_date"] = False
            return result

        if isinstance(parsed_birth, datetime):
            parsed_birth = parsed_birth.date()

        if parsed_start < parsed_birth:
            #print(f"[ERROR] therapy_start_date {parsed_start} liegt vor birth_date {parsed_birth}")
            result["therapy_start_date"] = False
            return result
    
    first_contact = entry.get("first_contact_date")
    if first_contact:
        parsed_first_contact = try_parse_date(first_contact)
        if not parsed_first_contact:
            #print(f"[ERROR] first_contact_date nicht parsebar: {first_contact}")
            result["therapy_start_date"] = False
            return result

        if isinstance(parsed_first_contact, datetime):
            parsed_first_contact = parsed_first_contact.date()

        if parsed_start < parsed_first_contact:
            #print(f"[ERROR] therapy_start_date {parsed_start} liegt vor first_contact_date {parsed_first_contact}")
            result["therapy_start_date"] = False
            return result

    result["therapy_start_date"] = True
    return result
    

def is_greater_equal_date(date_str: str, reference_str: str) -> bool:
    try:
        date_val = try_parse_date(date_str)
        ref_val = try_parse_date(reference_str)
        if not date_val or not ref_val:
            return False
        return date_val >= ref_val
    except Exception as e:
        #print(f"[ERROR] Fehler bei is_greater_equal_date: {e}")
        return False


def is_valid_float_in_range(value, min_value=None, max_value=None) -> bool:
    try:
        val = float(value)
        if min_value is not None and val < min_value:
            return False
        if max_value is not None and val > max_value:
            return False
        return True
    except (ValueError, TypeError):
        return False


def is_valid_int_in_range(value, min_value=None, max_value=None) -> bool:
    try:
        val = int(value)
        if min_value is not None and val < min_value:
            return False
        if max_value is not None and val > max_value:
            return False
        return True
    except (ValueError, TypeError):
        return False


def is_greater_equal_float(value, min_value=0, max_value=None, warn_if_above=None) -> bool:
    try:
        if value is None:
            return False

        val = float(value)

        if val < min_value:
            #print(f"[ERROR] Value {val} is less than minimum {min_value}")
            return False

        if max_value is not None and val > max_value:
            #print(f"[ERROR] Value {val} is greater than maximum {max_value}")
            return False

        if warn_if_above is not None and val > warn_if_above:
            #print(f"[WARNING] Value {val} is above recommended threshold {warn_if_above}")
            return True

    except Exception as e:
        #print(f"[ERROR] Invalid float: {value}, error: {e}")
        return False


def validate_volume_with_warning(value, field_name="volume", min_value=0, max_warning_threshold=2500):
    try:
        val = float(value)
        if val < min_value:
            return {"valid": False, "warning": None}
        warning = None
        if val > max_warning_threshold:
            warning = f"{field_name} unusually high (> {max_warning_threshold} cm³)"
        return {"valid": True, "warning": warning}
    except (ValueError, TypeError):
        return {"valid": False, "warning": None}

def is_percentage_or_allowed_value(value, allowed_values: list) -> bool:
    if value is None:
        return False

    try:
        val_str = str(value).strip().replace("%", "").replace(",", ".")
        percent = float(val_str)
        if 0 <= percent <= 100:
            return True
    except ValueError:
        pass  # Kein gültiger Prozentwert – weiter mit normaler Prüfung

    # Fallback: ist es ein erlaubter Wert in der Liste?
    return is_allowed_value(value, allowed_values)

def is_fuzzy_biological_barrier_value(value, allowed_substrings: list) -> bool:
    """
    Erlaubt:
    - genaue erlaubte Werte (wie 'fascia')
    - sowie zusammengesetzte Werte wie 'muscle fascia', wenn sie erlaubte Teilstrings enthalten
    """
    if not value:
        return False

    def normalize(val):
        return re.sub(r"\s+", " ", str(val).strip().lower()
                    .replace("_", " ")
                    .replace("-", " ")
                    .replace(":", " ")
                    .replace("/", " ")
                    .replace(",", " "))

    norm_value = normalize(value)
    normalized_substrings = [normalize(v) for v in allowed_substrings]

    # Exakter Match
    if norm_value in normalized_substrings:
        return True

    # Teilstring-Match (z. B. "muscle fascia" enthält "fascia")
    for allowed in normalized_substrings:
        if allowed in norm_value:
            return True

    #print(f"[DEBUG] '{value}' matched none of {allowed_substrings}")
    return False

