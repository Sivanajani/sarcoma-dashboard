from sqlalchemy import text
from db.engine import engine_prom

def check_uniqueness_eq5d():
    """
    Prüft die Eindeutigkeit der EQ5D-Einträge pro Patient:in und Tag (Regel U1).
    Gibt alle Duplikate zurück.
    """
    with engine_prom.connect() as conn:
        result = conn.execute(text("""
            SELECT pid, date, COUNT(*) as count
            FROM eq5d
            GROUP BY pid, date
            HAVING COUNT(*) > 1
        """))
        duplicates = result.mappings().all()
    return [{"pid": row["pid"], "date": row["date"], "anzahl": row["count"]} for row in duplicates]


def check_uniqueness_biopsy():
    """
    Prüft die Eindeutigkeit der Biopsy-Einträge pro Patient:in und Tag (Regel U2).
    Gibt alle Duplikate zurück.
    """
    with engine_prom.connect() as conn:
        result = conn.execute(text("""
            SELECT biopsy_pid, biopsy_date, COUNT(*) as count
            FROM proms_biopsy
            GROUP BY biopsy_pid, biopsy_date
            HAVING COUNT(*) > 1
        """))
        duplicates = result.mappings().all()
    return [{"pid": row["biopsy_pid"], "date": row["biopsy_date"], "anzahl": row["count"]} for row in duplicates]
