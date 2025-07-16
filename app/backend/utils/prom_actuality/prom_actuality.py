from datetime import date, timedelta

def check_prom_aktualitaet(record_date: date, modul: str) -> dict:
    """
    Prüft die Aktualität eines PROM-Datensatzes anhand seines Datums.
    
    Args:
        record_date (date): Das Erhebungsdatum des PROM-Eintrags.
        modul (str): Name des Moduls, z. B. "eq5d", "biopsy".

    Returns:
        dict: Ergebnis mit Status (aktuell/veraltet/nicht beurteilbar/inkorrekt) und Erklärung.
    """
    today = date.today()

    if record_date is None:
        return {
            "aktualitaet": "nicht beurteilbar",
            "begründung": "Kein Datum vorhanden (Regel A3)",
            "aktualitaet_prozent": 0
        }
    
    if record_date > today:
        return {
            "aktualitaet": "inkorrekt",
            "begründung": "Datum liegt in der Zukunft (Regel A4)",
            "aktualitaet_prozent": 0
        }
    
    # Modulabhängige Grenzwerte
    if modul == "eq5d":
        threshold = timedelta(days=180)  # 6 Monate
    elif modul == "biopsy":
        threshold = timedelta(days=365)  # 12 Monate
    else:
        return {
            "aktualitaet": "nicht beurteilbar",
            "begründung": f"Unbekanntes Modul: {modul}",
            "aktualitaet_prozent": 0
        }

    delta = today - record_date

    if delta > threshold:
        return {
            "aktualitaet": "veraltet",
            "begründung": f"{modul}-Eintrag ist älter als zulässig (Regel A1/A2)",
            "aktualitaet_prozent": 0
        }
    
    return {
        "aktualitaet": "aktuell",
        "begründung": f"{modul}-Eintrag ist innerhalb des zulässigen Zeitrahmens",
        "aktualitaet_prozent": 100
    }