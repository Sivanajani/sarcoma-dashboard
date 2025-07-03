from datetime import datetime, date


def is_allowed_value(value, allowed_values: list) -> bool:
    if value is None:
        return False

    def normalize(val):
        return str(val).strip().lower().replace("_", " ")

    normalized_allowed = [normalize(v) for v in allowed_values]

    if isinstance(value, list):
        for v in value:
            if normalize(v) not in normalized_allowed:
                print(f"[DEBUG] '{v}' not in allowed values")
                return False
        return True
    
    if normalize(value) not in normalized_allowed:
        print(f"[DEBUG] '{value}' not in allowed values")
        print(f"[DEBUG] Allowed: {normalized_allowed}")
        return False
    return True



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
    return any(value.lower().startswith(prefix.lower()) for prefix in allowed_prefixes)