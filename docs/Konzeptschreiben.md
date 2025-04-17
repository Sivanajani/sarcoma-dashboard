# Konzeptschreiben: Datenqualitäts-Dashboard für das Schweizer Sarkom Netzwerk (SSN)

## 1. Einleitung und Zusammenfassung

Das Schweizer Sarkom Netzwerk (SSN) speichert klinische Daten über Sarkompatienten in einer zentralen Datenbank. Sarkome sind seltene bösartige Tumore, die aus dem Knochen oder Weichgewebe hervorgehen. Im Rahmen der Bachelorarbeit an der FHNW soll ein Dashboard entwickelt werden, das die Datenqualität dieser Daten in Echtzeit analysiert.

Datenqualität ist in der klinischen Forschung essenziell, um valide Ergebnisse zu erzielen und die Patientensicherheit zu gewährleisten. Fehlende oder unplausible Werte können zu falschen Schlussfolgerungen führen, insbesondere bei der Bewertung neuer Therapien oder in der Versorgungsqualität. Das geplante Dashboard soll unter anderem die Vollständigkeit der Einträge überwachen, "Outlier" erkennen und bei Bedarf automatisierte Benachrichtigungen (Alerts) generieren.

## 2. Ziele und Zielgruppen

Ziel der Arbeit ist die Konzeption und prototypische Umsetzung eines Dashboards zur Echtzeitüberwachung der Datenqualität in der SSN-Datenbank. Dabei sollen folgende Teilziele verfolgt werden:

- Durchführung einer Literaturrecherche zu Best Practices der Datenqualitätssicherung
- Entwicklung eines Datenqualitätskonzepts (DQ-Konzept) für klinische Daten
- Identifikation geeigneter Technologien und Visualisierungstools
- Aufbau eines Dashboards (Prototyp) zur Visualisierung der Datenqualität
- Implementierung einfacher Regelwerke (z. B. Vollständigkeitsprüfung, Outlier Detection)
- Definition und Simulation von Alert-Mechanismen

Zielgruppen des Dashboards sind v. a. klinisch tätige Ärzt:innen, die Datenmanagerin sowie Forschende, die mit den SSN-Daten arbeiten. Das System soll langfristig helfen, die Qualität der Erhebung und Dokumentation zu sichern und datenbasierte Entscheidungen zu unterstützen.

## 3. Beschreibung des Konzepts

Das geplante Dashboard wird auf die künftig produktive Datenbankstruktur von SSN aufbauen (PostgreSQL oder ähnlich). Die Datenbank wird aktuell von der Firma Renuo implementiert und voraussichtlich in zwei Wochen bereitgestellt.

Im Rahmen des Projekts soll zuerst ein modulares DQ-Konzept erstellt werden. Dieses beinhaltet:
- Kriterien für Vollständigkeit, Konsistenz, Plausibilität
- Definition typischer Red Flags und Datenqualitätsmetriken
- Ableitung von Visualisierungskonzepten für ein nutzerfreundliches Dashboard

Technologisch wird eine offene Auswahlmöglichkeit gelassen. Denkbare Technologien sind Python (Dash), R Shiny oder webbasierte Frontends. Hosting ist via shinyapps.io oder Google Cloud möglich. Eine Exportfunktion für Abbildungen oder Metriken (z. B. für Publikationen) ist erwünscht.

Funktional soll das Dashboard z. B. anzeigen:
- Welche Felder bei welchen Patienten fehlen
- Wie hoch der Vollständigkeitsgrad eines Fragebogens ist
- Ob ein Fall bestimmte Red Flags (z. B. keine Bildgebung) aufweist

## 4. Nutzen und Vorteile

Ein Datenqualitäts-Dashboard ermöglicht:
- Frühzeitige Identifikation von Fehlern oder Lücken in der Dokumentation
- Direkte Kommunikation an Datenverantwortliche (z. B. via Alerts)
- Steigerung der Validität klinischer Studien
- Unterstützung bei der Versorgungsqualität und wissenschaftlichen Auswertung

Langfristig kann das Dashboard als Standard-Tool für Qualitätssicherung im SSN etabliert werden.

## 5. Risiken und Herausforderungen

- Zugriff auf produktive Datenbank muss abgestimmt werden (Datenschutz, Sicherheit)
- Definition medizinisch sinnvoller Outlier-Logiken benötigt Fachexpertise
- Visualisierungen müssen für Ärzt:innen und Forschende verständlich sein
- Unsicherheit bei Datenstruktur, da DB sich noch im Aufbau befindet
- Mögliche technische Lernkurve bei Toolauswahl

## 6. Zeitplan und Ressourcen

Start der Bachelorarbeit: **05.05.2025**  
Betreuer: **Dr. Abdullah Kahraman und Dr. Philip Heesen (LUKS)**  
Auftraggeber: **Dr. Bruno Fuchs und Dr. Philip Heesen (LUKS)**

Die Arbeit wird über einen Zeitraum von 15 Wochen durchgeführt. 

## Geplanter Zeitplan (Auszug):

### Visueller Sprint-Zeitplan

![Sprint-Zeitplan](./images/sprint.JPG)

### Sprint-Zeitplan – Bachelorarbeit SSN Dashboard

| AUFGABENNAME                                        | FUNKTIONSTYP                   | STARTDATUM  | ENDDATUM    | DAUER (Tage) |
|-----------------------------------------------------|--------------------------------|-------------|-------------|--------------|
| **SPRINT 0**                                        | **Setup & Orientierung**           | **07.04.2025**  | **18.04.2025**  | **12**            |
| Kick-off-Meeting                                    |                                | 11.04.2025  | 11.04.2025  | 1            |
| GitLab einrichten                                   |                                | 15.04.2025  | 15.04.2025  | 1            |
| Protokolle & Notizen dokumentieren                  |                                | 11.04.2025  | 16.04.2025  | 6            |
| **SPRINT 1**                                        | **Literatur & Konzept**            | **05.05.2025**  | **16.05.2025**  | **12**           |
| Erstellung „Konzeptschreiben.md“                    |                                | 05.05.2025  | 12.05.2025  | 8           |
| Literaturrecherche zur Datenqualitätssicherung      |                                | 05.05.2025  | 09.05.2025  | 5            |
| Austausch mit Betreuenden bzgl. Outlier/Red Flags   |                                | 12.05.2025  | 14.05.2025  | 3            |
| Entscheidung: Welche Tools & Frameworks?            |                                | 15.05.2025  | 16.05.2025  | 2            |
| **SPRINT 2**                                        | **Tool-Setup & Architektur**       | **19.05.2025**  | **30.05.2025**  | **12**           |
| Technologiewahl finalisieren                        |                                | 19.05.2025  | 19.05.2025  | 1            |
| Erste DQ-Kriterien definieren                       |                                | 21.05.2025  | 23.05.2025  | 3            |
| Architektur-Skizze (Datenbank + Frontend)           |                                | 23.05.2025  | 30.05.2025  | 9            |
| **SPRINT 3**                                        | **Prototyp Backend / DQ-Checks**   | **02.06.2025**  | **13.06.2025**  | **12**           |                |
| SQL- oder Python-Skripte zur DQ-Analyse             |                                | 02.06.2025  | 06.06.2025  | 5            |
| Testen an Beispieldaten                             |                                | 09.06.2025  | 10.06.2025  | 2            |
| Vollständigkeit, einfache Regeln                    |                                | 11.06.2025  | 12.06.2025  | 2            |
| Alerts diskutieren                                  |                                | 13.06.2025  | 13.06.2025  | 1            |
| **SPRINT 4**                                        | **Frontend / Dashboard-Prototyp**  | **16.06.2025**  | **27.06.2025**  | **12**          |
| Dashboard-Ansicht (Mockup → Code)                   |                                | 16.06.2025  | 18.06.2025  | 3            |                
| Visualisierung von DQ-Metriken                      |                                | 19.06.2025  | 24.06.2025  | 6            |                
| Anzeige: Vollständigkeit, Red Flags, Outlier        |                                | 25.06.2025  | 27.06.2025  | 3            |                
| **SPRINT 5**                                        | **Evaluation & Optimierung**       | **30.06.2025**  | **11.07.2025**  | **12**          |
| Usability-Test                                      |                                | 30.06.2025  | 30.06.2025  | 1            |      
| Verbesserung UX/UI                                  |                                | 30.06.2025  | 02.07.2025  | 3            |      
| Validierung mit Testdaten                           |                                | 02.07.2025  | 07.07.2025  | 6            |      
| Export-Optionen (Bilder, Tabellen)                  |                                | 08.07.2025  | 11.07.2025  | 4            |      
| **SPRINT 6**                                        | **Dokumentation & Vorbereitung**   | **14.07.2025**  | **25.07.2025**  | **12**          |
| Dokumentation technischer Umsetzung                 |                                | 14.07.2025  | 16.07.2025  | 3            |       
| Testfälle & Ergebnisse beschreiben                  |                                | 17.07.2025  | 18.07.2025  | 2                            |
| Schreiben Hauptteil Thesis                          |                                | 19.07.2025  | 25.07.2025  | 7                            |
| **SPRINT 7**                     | **Abgabe & Abschluss**             | **28.07.2025**  | **08.08.2025**  | **12**                           |
| Slides / Poster vorbereiten                         |                                | 07.08.2025  | 08.08.2025  | 2                            |
| Letzter Review, Layout, Formatierung                |                                | 28.07.2025  | 08.08.2025  | 12           |                
| Lessons Learned / Nachbereitungs-Treffen            |                                | 05.08.2025  | 08.08.2025  | 4            |                
| Backup & Archivierung                               |                                | 05.08.2025  | 08.08.2025  | 4            |                


## 7. Erfolgskriterien

- Vollständigkeit und Nachvollziehbarkeit des Konzepts
- Funktionierender Prototyp mit echten Beispieldaten
- Positives Feedback von Nutzenden 
- Identifikation relevanter Metriken zur Qualitätssicherung

## 8. Schlussfolgerung und Ausblick

Die Entwicklung des Dashboards ist ein entscheidender Schritt zur Verbesserung der Datenqualität im SSN. Es bietet nicht nur einen Mehrwert für Forschung und klinische Versorgung, sondern unterstützt auch die Einhaltung regulatorischer Standards. Zukünftig kann das System um automatisierte Analysen, benutzerdefinierte Filter oder maschinelles Lernen zur intelligenten Datenqualitätsüberwachung erweitert werden.

---
Sivanajani Sivakumar