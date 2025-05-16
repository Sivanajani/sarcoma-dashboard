# Modulares Datenqualitätskonzept (DQ-Konzept) – SSN Dashboard

**Version:** 0.1  
**Datum:** 02.05.2025  
**Autorin:** Sivanajani Sivakumar

---

## Übersicht

Das folgende Konzept beschreibt ein modulares Rahmenwerk zur Bewertung der Datenqualität in klinischen Datenbanken am Beispiel des Schweizer Sarkom Netzwerks (SSN). Es basiert auf sechs definierten Dimensionen, die einzeln geprüft, visualisiert und kombiniert überwacht werden können. Jedes Modul stellt eine wiederverwendbare und erweiterbare Komponente zur Qualitätsanalyse dar.

---

## 🧩 Modul 1: Vollständigkeit

**Ziel:**  
Erfassung, ob alle erforderlichen Datenfelder in einem Datensatz ausgefüllt sind.

**Definition:**  
Vollständigkeit beschreibt den Anteil vorhandener, nicht-leerer Felder im Verhältnis zu den erwarteten Pflichtfeldern.

**Metrik:**  
`Vollständigkeit [%] = (Anzahl ausgefüllter Pflichtfelder / Gesamtanzahl erwarteter Felder) × 100`

**Beispiel:**  
Ein Fragebogen mit 80 Feldern, von denen 70 ausgefüllt sind → 87.5 % Vollständigkeit.

**Technische Umsetzung:**  
- SQL-Abfragen auf `NULL`-Werte  
- Python-Skripte mit Pandas zur Batch-Analyse  
- Materialized Views in PostgreSQL

**Visualisierung:**  
- Balkendiagramm je Fragebogen/Patient:in  
- Ampelsystem (z. B. >95 % = grün)

**Alert-Trigger:**  
- Warnung bei < 95 %  
- Kritisch bei < 85 %

---

## 🧩 Modul 2: Korrektheit

**Ziel:**  
Überprüfung, ob dokumentierte Werte den tatsächlichen, realweltlichen Gegebenheiten entsprechen.

**Definition:**  
Ein Wert ist korrekt, wenn er formal und sachlich gültig ist.

**Metrik:**  
`Korrektheit [%] = (Anzahl korrekt validierter Werte / Gesamtanzahl geprüfter Werte) × 100`

**Beispiel:**  
Tumorgrösse liegt im erwarteten Bereich (0.1–30 cm).

**Technische Umsetzung:**  
- Wertelisten, Bereichsprüfungen  
- Abgleich mit Primärdaten (sofern vorhanden)

**Visualisierung:**  
- Fehlertabellen  
- Hervorhebung fehlerhafter Einträge

**Alert-Trigger:**  
- Einzelwert-Fehlermeldung  
- Schwellenwert < 95 %

---

## 🧩 Modul 3: Konsistenz

**Ziel:**  
Erkennung logischer Widersprüche innerhalb oder zwischen Datensätzen.

**Definition:**  
Ein Datensatz ist konsistent, wenn keine widersprüchlichen Werte vorliegen.

**Metrik:**  
`Konsistenz [%] = (Fehlerfreie Fälle / Geprüfte Fälle) × 100`

**Beispiel:**  
Diagnose „nicht metastasiert“, aber metastasenbezogene Chemotherapie.

**Technische Umsetzung:**  
- Regelbasierte Logikprüfungen in SQL/Python  
- Cross-Field-Validierung (z. B. Diagnose ↔ Therapie)

**Visualisierung:**  
- Heatmaps oder Fehlermatrizen  
- Fall-Drilldown

**Alert-Trigger:**  
- Konsistenz unter 90 %

---

## 🧩 Modul 4: Aktualität

**Ziel:**  
Messung, ob Daten aktuell sind bzw. fristgerecht aktualisiert wurden.

**Definition:**  
Aktualität bezeichnet den Zeitbezug der Daten zum tatsächlichen klinischen Verlauf.

**Metrik:**  
`Aktualität [%] = (Anzahl aktueller Einträge / Erwartete Einträge im Zeitraum) × 100`

**Beispiel:**  
Letztes Follow-up > 6 Monate alt → als veraltet markiert

**Technische Umsetzung:**  
- Vergleich mit aktuellen Datumswerten  
- Zeitstempel-basierte Checks (`last_updated_at`)

**Visualisierung:**  
- Zeitachsen, Farbverlauf nach Alter  
- Trenddiagramme

**Alert-Trigger:**  
- Kein Eintrag > 180 Tage  
- Differenz zum Planwert > X Tage

---

## 🧩 Modul 5: Eindeutigkeit

**Ziel:**  
Vermeidung doppelter oder mehrfach erfasster Fälle.

**Definition:**  
Eindeutigkeit ist gegeben, wenn jede Entität (z. B. Patient:in) nur einmal vorhanden ist.

**Metrik:**  
`Eindeutigkeit [%] = (Anzahl eindeutiger IDs / Gesamtanzahl Einträge) × 100`

**Beispiel:**  
Zwei Fälle mit gleicher ID oder identischen Kerndaten → potenzielle Dublette

**Technische Umsetzung:**  
- Dublettenerkennung mit SQL (DISTINCT, COUNT)  
- Fuzzy-Matching (Name, Geburtsdatum)

**Visualisierung:**  
- Dublettenlisten  
- Hinweisbox je betroffener ID

**Alert-Trigger:**  
- >1 Datensatz mit gleicher Patienten-ID

---

## 🧩 Modul 6: Plausibilität

**Ziel:**  
Prüfung, ob Datenwerte medizinisch oder logisch sinnvoll erscheinen.

**Definition:**  
Ein Wert ist plausibel, wenn er innerhalb eines sinnvollen, erwartbaren Bereichs liegt.

**Metrik:**  
`Plausibilität [%] = (Anzahl plausibler Werte / Gesamtanzahl geprüfter Werte) × 100`

**Beispiel:**  
Tumorvolumen = 45.000 cm³ → formal korrekt, aber nicht plausibel

**Technische Umsetzung:**  
- Schwellenwertlogik (Min/Max)  
- z-Score, IQR-Basierte Ausreissererkennung

**Visualisierung:**  
- Boxplots, Histogramme  
- Farbliche Markierung auffälliger Werte

**Alert-Trigger:**  
- Werte ausserhalb erwarteter Bereiche  
- z-Score > ±3

---

## 📦 Erweiterbarkeit

Die Module sind einzeln einsetzbar und kombinierbar. Neue Dimensionen (z. B. Nachvollziehbarkeit, Interpretierbarkeit) können später ergänzt werden. Die modulare Struktur erlaubt eine schrittweise Implementierung im MVP und eine spätere Skalierung.

---

## 🔗 Referenzen

Siehe [Literaturrecherche Datenqualitätssicherung](Literaturrecherche%20Datenqualitätssicherung.md)

---