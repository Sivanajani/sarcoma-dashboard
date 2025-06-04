# Technologie- und Toolauswahl – SSN Dashboard

## 1. Einleitung

Dieses Dokument beschreibt die Auswahl geeigneter Technologien und Visualisierungstools für das geplante Datenqualitäts-Dashboard im Rahmen der Bachelorarbeit „Datenqualitätsmanagement in der Sarkomversorgung“. Ziel ist es, eine technisch fundierte Grundlage für die prototypische Umsetzung zu schaffen. Dabei werden bestehende Abhängigkeiten (z. B. vorkonfigurierte Datenbank) sowie projektbezogene Anforderungen berücksichtigt.

---

## 2. Technische Anforderungen

Die eingesetzten Technologien müssen folgenden Anforderungen gerecht werden:

| Kriterium                 | Anforderung                                                                            |
|---------------------------|----------------------------------------------------------------------------------------|
| **Datenschutz**           | Hosting in sicherer Umgebung (Spital/Cloud), kein externer Datenverkehr               |
| **Interaktivität**        | Benutzerfreundliche, filterbare Dashboards                                            |
| **Erweiterbarkeit**       | Modularer Aufbau, einfache Integration neuer Prüfregeln und Visualisierungen          |
| **Visualisierung**        | Darstellung komplexer Metriken in verständlicher Form (z. B. Trends, Heatmaps)        |
| **Performance**           | Verarbeitung auch grösserer Datenmengen in akzeptabler Zeit                          |
| **Integration**           | Kompatibilität mit der zentralen Datenbank (PostgreSQL)        |

---

## 3. Datenquelle

Die zentrale **PostgreSQL-Datenbank** wird bereitgestellt.  

**Vorteile von PostgreSQL:**
- Unterstützung komplexer Abfragen und Views
- Gute Dokumentation und Stabilität
- Ideal für regelbasierte Qualitätsprüfungen via SQL

---

## 4. Auswahl: Backend-Technologie

**Technologie:** FastAPI (Python)  
**Begründung für Auswahl:**
- Modernes, schnelles API-Framework  
- Unterstützung von Swagger UI (automatische API-Doku)  
- Native Integration mit Pandas, NumPy für Datenanalysen  
- Ideal für regelbasierte Prüfungen & statistische Checks (z. B. z-Score, IQR)  

**Alternative geprüft:** Flask  
Abgelehnt: weniger performant & moderner als FastAPI

---

## 5. Auswahl: Frontend-Technologie

**Technologie:** React (JavaScript)
**Begründung für Auswahl:**

- Weit verbreitetes Framework für interaktive Web-UIs  
- Einfache Anbindung von Visualisierungsbibliotheken (z. B. Chart.js, Recharts, D3.js)  
- Unterstützung von Filterfunktionen, Alert-Anzeigen und responsivem Design  

**Zusätzlich geplant:**  
- **i18n** (z. B. mit i18next) für Mehrsprachigkeit

**Alternativen geprüft:**  
- Dash (Python): zu monolithisch, weniger flexibel im Design  
- R Shiny: für medizinisches Fachpersonal teils ungewohnt, nicht JavaScript-basiert

---

## 6. Visualisierungstools

| Tool        | Einsatzbereich                  | Grund für Auswahl                |
|-------------|----------------------------------|----------------------------------|
| **Chart.js** / **Recharts** | Balken-, Linien-, Donut-Diagramme | Einfache Integration in React, interaktiv |
| **D3.js**   | Komplexere Darstellungen        | Für Heatmaps, Zeitachsen etc.    |
| **Boxplot/Histogramm (Plotly.js)** | Statistische Darstellung von Outliers | Optional für spätere Ausbaustufen |

---

## 7. Alert-Mechanismen

**Geplante Tools:**
- Alert-Funktionen direkt in React mit Ampelfarben + modalen Hinweisen
- Backend-Trigger für kritische Schwellenwerte (z. B. Vollständigkeit < 85 %)
- Optional: E-Mail-Benachrichtigung via SMTP oder Webhook (Slack/MS Teams)

---

## 8. Fazit

Die gewählten Technologien bieten eine **robuste, erweiterbare und benutzerfreundliche** Architektur für die Umsetzung eines Datenqualitäts-Dashboards im klinischen Umfeld. Die Trennung von Backend (FastAPI) und Frontend (React) erlaubt eine modulare Weiterentwicklung. Visualisierungen, Alerts und regelbasierte Prüfungen lassen sich technisch effizient und verständlich umsetzen – auch für medizinisches Fachpersonal ohne IT-Hintergrund.

---

## 9. Referenzen

- [FastAPI – Dokumentation](https://fastapi.tiangolo.com/)  
- [React – Offizielle Seite](https://reactjs.org/)  
- [PostgreSQL – Dokumentation](https://www.postgresql.org/docs/)  
- [Chart.js](https://www.chartjs.org/)  
- [D3.js](https://d3js.org/)  
