# Sprint 3 – Mock-Daten & Projektstruktur

**Zeitraum:** 02.06.2025 – 13.06.2025

## Sprint-Ziele

* [x] Aufsetzen der React-basierten WebApp-Struktur
* [x] Generierung und Integration von Mock-Daten für PROM- und CROM-Daten
* [x] Definition der Datenmodelle in TypeScript
* [x] Validierung der Datenstrukturen anhand realistischer Testfälle

---

## Erreichte Ergebnisse

* Projektstruktur für die WebApp aufgesetzt (React + Vite + TypeScript)
* Datei `mockPatients.ts` erstellt: enthält strukturierte Testdaten mit Patient\:innen und Modulen wie Radiology, Surgery, SarcomaBoard etc.
* Definition der zentralen Datentypen (`Patient`, `ModuleEntry`, `DataQualityMetrics`) in TypeScript
* Testweise Anzeige der Mock-Daten im Frontend mit einfacher Tabellenansicht

---

## Herausforderungen

* Die realitätsnahe Abbildung der medizinischen Datenmodelle (z.B. PROM vs. CROM) war komplex
* Die Strukturierung der Datenqualität pro Patient\:in erforderte viele Iterationen
* Abgleich mit dem ER-Modell und Anpassung an TypeScript-Typen war zeitintensiv

---

## Offene Punkte (für Sprint 4)

* Visualisierung der Datenqualitätsmetriken pro Patient\:in (z.B. Fortschrittsbalken, Red Flags)
* Einbau von Filteroptionen (z.B. Zeitraum, Modultyp)
* Verfeinerung der Mock-Daten: zusätzliche Felder & gezielte Lücken für Plausibilitätstests

---

## Nächste Schritte

* Design und Umsetzung der Hauptkomponenten (Sidebar, Header, KPI Cards, Tabellen)
* Entwicklung der ersten DQ-Logik: Vollständigkeit und Red Flags
* Vorbereitung für Backend-Anbindung (FastAPI-Mock-Endpunkte)

---

**Sprint abgeschlossen am:** *13.06.2025*
**Bearbeitet von:** Sivanajani Sivakumar