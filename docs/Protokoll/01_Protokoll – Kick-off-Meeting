# Protokoll – Kick-off-Meeting SSN-Dashboard

**Datum:** Freitag, 11. April 2025  
**Uhrzeit:** 11:00 – 13:00 Uhr  
**Ort:** Kantonsspital Luzern (LUKS)  
**Teilnehmende:**  
- Dr. Bruno Fuchs  
- Dr. Philip Heesen
- Vincent Perret  
- Sivanajani Sivakumar  

---

## Besprochene Inhalte

### Einblick in bestehende Systeme
- Dr. Heesen zeigte das aktuelle PROM-System.
- Einführung in das Zusammenspiel von:
  - **Fragebogen (Input)**
  - **Cockpit (Output)**
- Jeder Patient erhält eine eindeutige **Patienten-ID (PID)**.

### Aktueller Stand
- **Kein Dashboard** ist bisher vorhanden.
- Die **Datenbank** wird derzeit von der Firma **[Renuo](https://www.renuo.ch/)** aufgebaut.
  - Voraussichtliche Fertigstellung: in ca. 2 Wochen.
  - Enthält **klinische Patientendaten**.
  - Datenbanktechnologie: vermutlich **PostgreSQL** oder **SQL**.
- **Server-Hosting**: [Google Cloud](https://cloud.google.com/) und shinyapps.io ([shinyapps.io](https://www.shinyapps.io))

---

## Rückfragen & Antworten

| Frage | Antwort |
|-------|---------|
| Gibt es ein bestehendes Dashboard? | Nein |
| Welche Tools sollen verwendet werden? | Frei wählbar – orientiert an Best Practices |
| Wer nutzt das Dashboard? | Datenmanagerin und Ärzt:innen |
| Download-Funktion für Daten? | Wünschenswert, v. a. für Publikationen |
| Verwendung des Dashboards? | Forschung **und** Versorgungsqualität |

---

## Hinweise & Anforderungen

- **Datensicherheit** ist zentral (Patientendaten!).
- **Outlier Detection** und **Missing Value Handling** müssen recherchiert und konzeptioniert werden.
- **Logiken** erforderlich, z. B.:
  - Bei Patienten ohne OP oder Biopsie → entsprechende Eingabeoptionen
  - Prozentuale Ausfüllrate des Fragebogens
  - Alert bei zu niedriger Ausfüllrate
- **Red Flags & Qualitätschecks**:
  - Z. B. Bildgebung fehlt → Red Flag im System

---

## Vereinbarte nächste Schritte

1. **Literaturrecherche** zum Thema Datenqualitätssicherung starten
2. **Konzeptschreiben** erstellen

---

## Kommunikation

- Rückfragen per Mail an:  
  `fuchs@sarcoma.surgery` & `philip.heesen@uzh.ch`
- **Kurze und klare Mails bevorzugt**
- Alternativ: **Word-Dokument mit Fragen** sammeln und per Mail senden, nicht anhäufen
---

## Sonstiges

- Kein offizieller Abgabetermin für das Konzeptschreiben
- Outlier-Definition und Qualitätskriterien sind noch offen → durch Recherche zu erarbeiten
