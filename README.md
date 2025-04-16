# SSN Datenqualitäts-Dashboard

**Bachelor-Thesis @ FHNW – Medizininformatik**  
**Thema:** Datenqualitätsmanagement in der Sarkomversorgung  
**Start:** 05.05.2025   
**Ende:**  18.08.2025  
**Ort:** Kantonsspital Luzern (KSL) und FHNW (Muttenz)   
**Betreuung:** Dr. Abdullah Kahraman  
**Auftraggeber:** Dr. Bruno Fuchs und Dr. Philip Heesen    

---

## Projektbeschreibung  

Das Schweizer Sarkom Netzwerk (SSN) speichert klinische Daten in einer PostgreSQL-Datenbank. Ziel dieses Projekts ist es, ein Dashboard zu entwickeln, das die Datenqualität in Echtzeit analysiert. Dazu zählen:

- Überprüfung der **Vollständigkeit** der Daten
- Erkennung von **Ausreissern**
- **Alerts** an Ärzt:innen bei fehlerhaften oder fehlenden Einträgen (Nice-to-have)

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
| Sprint 0 – Setup                   | 07.04 – 11.04.2025   | Projektstart, GitLab, Protokoll, Struktur   |
| Sprint 1 – Konzept & Literatur     | 14.04 – 25.04.2025   | Recherche & Konzept schreiben               |
| Sprint 2 – Architektur & Tools     | 28.04 – 09.05.2025   | Tools auswählen, Architektur planen         |
| Sprint 3 – Backend Prototyp        | 12.05 – 23.05.2025   | DQ-Checks in Python/SQL                     |
| Sprint 4 – Frontend Dashboard      | 26.05 – 06.06.2025   | UI bauen, Visualisierungen                  |
| Sprint 5 – Evaluation & Tests      | 09.06 – 20.06.2025   | Testen, Optimieren                          |
| Sprint 6 – Dokumentation           | 23.06 – 04.07.2025   | Thesis schreiben, Abbildungen               |
| Sprint 7 – Abgabe                  | 07.07 – 21.07.2025   | Layout, Review, Einreichen                  |

---

## Verwendete Tools & Technologien (Stand 15.04.25)

| Tool/Tech        | Begründung |
|------------------|------------|
| **GitLab**       | Versionskontrolle, Doku & Zusammenarbeit |
| **PostgreSQL**   | Bestehende SSN-Datenbank |
| **Markdown**     | Dokumentation |
| **VS Code**      | Entwicklungsumgebung |

---