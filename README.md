# SSN Datenqualitäts-Dashboard

**Bachelor-Thesis @ FHNW – Medizininformatik**  
**Thema:** Datenqualitätsmanagement in der Sarkomversorgung  
**Start:** 05.05.2025   
**Abgabe:**  18.08.2025 um 12Uhr  
**Ort:** Kantonsspital Luzern und FHNW (Muttenz)   
**Betreuung:** Dr. Abdullah Kahraman und Dr. Philip Heesen   
**Auftraggeber:** Dr. Bruno Fuchs und Dr. Philip Heesen  
**Experte:** TBD       

---

## Projektbeschreibung  

Das Schweizer Sarkom Netzwerk (SSN) speichert klinische Daten in einer PostgreSQL-Datenbank. Ziel dieses Projekts ist es, ein Dashboard zu entwickeln, das die Datenqualität in Echtzeit analysiert. Dazu zählen:

- Überprüfung der **Vollständigkeit** der Daten
- Erkennung von **Ausreissern**
- **Alerts** an Ärzt:innen bei fehlerhaften oder fehlenden Einträgen 

Die offizielle Projektbeschreibung zur Bachelorarbeit kann hier eingesehen werden: [Projektbeschreibung](./docs/Projektbeschreibung.pdf)

---

## Projektstruktur (Stand 15.04.25)

```
ssn-datenqualitaet/
│
├── docs/                    # Konzept, Literatur, Protokoll, etc.
│   ├── Konzeptschreiben.md
│   ├── protokolle/
│   │   └── 01_Protokoll – Kick-off-Meeting.md
│   ├── images/
│   │   └── sprint.JPG
│   └── sprints/
│       └── sprint00.md   
├── src/                     # Prototyping-Code (Python, Dash, SQL)
└── README.md                # Diese Projektübersicht

```
---
## Meilensteine (Milestones) – Sprintübersicht

| Milestone      | Zeitraum             | Beschreibung                                |
|--------------------------------------|----------------------|---------------------------------------------|
| Sprint 0 – Setup                   | 07.04 – 18.04.2025   | Projektstart, GitLab, Protokoll, Struktur   |
| Sprint 1 – Konzept & Literatur     | 05.05 – 16.05.2025   | Recherche & Konzept schreiben               |
| Sprint 2 – Architektur & Tools     | 19.05 – 30.05.2025   | Tools auswählen, Architektur planen         |
| Sprint 3 – Backend Prototyp        | 02.06 – 13.06.2025   | DQ-Checks in Python/SQL                     |
| Sprint 4 – Frontend Dashboard      | 16.06 – 27.06.2025   | UI bauen, Visualisierungen                  |
| Sprint 5 – Evaluation & Tests      | 30.06 – 11.07.2025   | Testen, Optimieren                          |
| Sprint 6 – Dokumentation           | 14.07 – 25.07.2025   | Thesis schreiben, Abbildungen               |
| Sprint 7 – Abgabe                  | 28.07 – 08.08.2025   | Layout, Review, Einreichen                  |

---

## Verwendete Tools & Technologien (Stand 15.04.25)

| Tool/Tech        | Begründung |
|------------------|------------|
| **GitLab**       | Versionskontrolle, Doku & Zusammenarbeit |
| **PostgreSQL**   | Bestehende SSN-Datenbank |
| **Markdown**     | Dokumentation |
| **VS Code**      | Entwicklungsumgebung |

---