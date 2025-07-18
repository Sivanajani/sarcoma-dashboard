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

    if not record_date:
        return {
            "aktualitaet": "nicht beurteilbar",
            "begründung": "Kein Datum vorhanden (Regel A3)",
            "aktualitaet_prozent": 0
        }

    if not isinstance(record_date, date):
        return {
            "aktualitaet": "inkorrekt",
            "begründung": "Ungültiges Datumsformat",
            "aktualitaet_prozent": 0
        }

    if record_date > today:
        return {
            "aktualitaet": "inkorrekt",
            "begründung": "Datum liegt in der Zukunft (Regel A4)",
            "aktualitaet_prozent": 0
        }

    # Modulabhängige Grenzwerte (ggf. zentral definieren)
    module_thresholds = {
        "eq5d": timedelta(days=180),    # 6 Monate
        "biopsy": timedelta(days=365),  # 12 Monate
        # weitere Module können hier ergänzt werden
    }

    threshold = module_thresholds.get(modul)
    if threshold is None:
        return {
            "aktualitaet": "nicht beurteilbar",
            "begründung": f"Unbekanntes Modul: '{modul}'",
            "aktualitaet_prozent": 0
        }

    delta = today - record_date

    if delta > threshold:
        return {
            "aktualitaet": "veraltet",
            "begründung": f"{modul}-Eintrag ist älter als {threshold.days} Tage (Regel A1/A2)",
            "aktualitaet_prozent": 0
        }

    return {
        "aktualitaet": "aktuell",
        "begründung": f"{modul}-Eintrag ist innerhalb des zulässigen Zeitrahmens",
        "aktualitaet_prozent": 100
    }