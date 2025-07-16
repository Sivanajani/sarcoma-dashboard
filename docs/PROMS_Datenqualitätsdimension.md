# Datenqualitäts

**Vollständigkeit**
Diese Übersicht listet alle als erforderlich definierten Felder je Tabelle für die Dimension Vollständigkeit auf. Nur wenn diese Felder gefüllt sind, gilt der Eintrag als vollständig.

## `personal_data`

Pflichtfelder:

* `institution`
* `pid`
* `first_name`
* `last_name`
* `date_birth`
* `gender`
* `street`
* `house_nr`
* `post_code`
* `city`
* `country`
* `phone_number`
* `email`
* `insurance_company`
* `insurance_class`
* `insurance_number`
* `ahv`
* `consent`

---

## `eq5d`

Pflichtfelder:

* `date`
* `pid`
* `institution`
* `vorname`
* `nachname`
* `mobilitaet`
* `selbstversorgung`
* `gewohnte_aktivitaeten`
* `schmerz`
* `angst`
* `questions`
* `vas`
* `belastung`
* `funktion`

---

## `proms_biopsy`

Pflichtfelder:

* `biopsy_date`
* `biopsy_pid`
* `biopsy_institution`
* `biopsy_vorname`
* `biopsy_nachname`
* `biopsy_email`
* `biopsy_date`
* `biopsy_notwendigkeit`
* `biopsy_angst`
* `biopsy_erklaerung`
* `biopsy_verstehen`
* `biopsy_schmerz_wie_erwartet`
* `biopsy_schmerz`
* `biopsy_medikamente`
* `biopsy_beobachtungszeitraum`
* `biopsy_blutende_wunde`
* `biopsy_probleme_wunde`
* `biopsy_schmerzkontrolle`
* `biopsy_team_raum`
* `biopsy_organisation`
* `biopsy_eqvas`
* `biopsy_questions`

---

## inhaltliche Richtigkeit – Regelbasierte Feldvalidierung

### `eq5d` – Korrektheitsregeln

| Feldname                 | Typ     | Regel                                           |
|--------------------------|---------|--------------------------------------------------|
| `mobilitaet`             | int     | Wert zwischen 1–5 (Likert-Skala)                |
| `selbstversorgung`       | int     | Wert zwischen 1–5                               |
| `gewohnte_aktivitaeten`  | int     | Wert zwischen 1–5                               |
| `schmerz`                | int     | Wert zwischen 1–5                               |
| `angst`                  | int     | Wert zwischen 1–5                               |
| `vas`                    | int     | Wert zwischen 0–100 (visuelle Analogskala)     |
| `belastung`              | int     | Wert zwischen 1–10                              |
| `funktion`               | int     | Wert zwischen 1–10                              |


### `eq5d` – Plausibilitätsregeln

| Regel                                                                                    | Beschreibung                                                          |
|------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| Wenn `mobilitaet`, `selbstversorgung`, `aktivitaeten` = 1, dann `belastung` sollte ≤ 3   | Guter Zustand → geringe Belastung                                     |
| Wenn `schmerz` ≥ 4, dann `vas` sollte ≥ 60                                               | Starker Schmerz → hoher VAS-Wert                                      |
| Wenn `angst` ≤ 2, dann `funktion` sollte nicht extrem niedrig sein (z. B. > 3)           | Niedrige Angst → keine stark beeinträchtigte Funktion                 |
| `belastung` und `funktion` sollten korrelieren (ρ > 0.6)                                 | Beide Felder messen subjektive Einschränkung                          |
| `vas` darf nicht negativ sein                                                            | Negativwerte sind ausgeschlossen                                      |


Natürlich – hier ist ein gut abgestimmter Abschnitt zur **inhaltlichen Richtigkeit** (`Korrektheit` und `Plausibilität`) für das PROM-Modul `proms_biopsy`:

---

### `proms_biopsy` – Korrektheitsregeln

| Feldname                      | Typ  | Regel                                                     |
| ----------------------------- | ---- | --------------------------------------------------------- |
| `biopsy_schmerz`              | int  | Wert zwischen 0–10 (Schmerzskala)                         |
| `biopsy_eqvas`                | int  | Wert zwischen 0–100 (visuelle Analogskala)                |
| `biopsy_team_raum`            | int  | Wert zwischen 1–10 (subjektive Zufriedenheit)             |
| `biopsy_organisation`         | int  | Wert zwischen 1–10 (subjektive Zufriedenheit)             |
| `biopsy_schmerz_wie_erwartet` | str  | Muss `"Ja"`, `"Nein"` oder `"Ungefähr wie erwartet"` sein |
| Alle Boolean-Felder           | bool | Muss bool sein (`True`, `False` oder `None`)              |

> **Hinweis:** Felder wie `biopsy_notwendigkeit`, `biopsy_angst`, `biopsy_medikamente` etc. gelten als korrekt, wenn sie `True`, `False` oder `None` sind (keine Typfehler oder Strings).

---

### `proms_biopsy` – Plausibilitätsregeln

| Regel                                                                                            | Beschreibung                                                      |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Wenn `biopsy_schmerz` ≥ 7, dann `biopsy_eqvas` sollte ≥ 60 sein                                  | Starker Schmerz → hoher VAS                                       |
| Wenn `biopsy_notwendigkeit` ist `False` und `biopsy_angst` ist `True` → potenzieller Widerspruch | Eingriff wird nicht als notwendig empfunden, aber Angst vorhanden |
| Wenn `biopsy_schmerz` ≤ 2, dann `biopsy_medikamente` sollte `False` oder `None` sein             | Kein/geringer Schmerz → Schmerzmittel ungewöhnlich                |
| `biopsy_team_raum` und `biopsy_organisation` sollten korrelieren (Differenz ≤ 3)                 | Beide messen subjektive Zufriedenheit mit Ablauf und Umgebung     |
| Wenn `biopsy_erklaerung` ist `False` und `biopsy_verstehen` ist `True`, dann ist das unplausibel | Ohne Erklärung kein vollständiges Verständnis erwartet            |
| `biopsy_eqvas` darf nicht negativ sein                                                           | Negativwerte sind ausgeschlossen                                  |

---

## Konsistenz
## Konsistenzregeln – `proms_biopsy`

| Regel-ID | Felder                                           | Konsistenzregel                                                                | Begründung                                                            |
| -------- | ------------------------------------------------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| K1       | `biopsy_schmerz`, `biopsy_schmerz_wie_erwartet`  | Wenn `schmerz` ≥ 7 → `schmerz_wie_erwartet` sollte nicht „wie erwartet“ sein   | Starker Schmerz wird normalerweise als „mehr als erwartet“ empfunden  |
| K2       | `biopsy_angst`, `biopsy_erklaerung`              | Wenn `angst` = `True` & `erklaerung` = `True` → Potenzieller Widerspruch       | Angst trotz guter Erklärung kann Hinweis auf zusätzliche Probleme sein|
| K3       | `biopsy_verstehen`, `biopsy_erklaerung`          | Wenn `erklaerung` = `True` → `verstehen` sollte auch `True` sein               | Erklärung sollte verstanden werden                                    |
| K4       | `biopsy_medikamente`, `biopsy_schmerz`           | Wenn `medikamente` = `True` → Schmerz sollte ≤ 6 sein                          | Schmerzmittel sollten wirksam sein                                    |
| K5       | `biopsy_blutende_wunde`, `biopsy_probleme_wunde` | Wenn `blutende_wunde` = `False`, aber `probleme_wunde` = `True` → Inkonsistenz | Ohne Blutung sollten keine Wundprobleme auftreten                     |
| K6       | `biopsy_eqvas`, `biopsy_schmerz`                 | Wenn `schmerz` ≥ 7 → `eqvas` sollte ≥ 60 sein                                  | Hoher Schmerz sollte sich im VAS widerspiegeln                        |
| K7       | `biopsy_verstehen`, `biopsy_questions`           | Wenn `verstehen` = `False` → `questions` sollte nicht leer sein                | Bei Unverständnis sollten Fragen gestellt werden                      |
| K8       | `biopsy_schmerzkontrolle`, `biopsy_schmerz`      | Wenn `schmerz` ≥ 7 → `schmerzkontrolle` sollte `False` sein                    | Schmerz schlecht kontrolliert                                         |
| K9       | `biopsy_team_raum`, `biopsy_organisation`        | Beide sollten in ähnlichem Bereich liegen (± 1)                                | Subjektive Bewertung von Umgebung & Organisation sollten korrelieren  |


---

## Konsistenzregeln – `EQ5D`

| Regel-ID | Felder                                      | Konsistenzregel                                                           | Begründung                                                                 |
| -------- | ------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| K1       | `mobilitaet`, `funktion`                    | Wenn `mobilitaet` = 1 (keine Probleme), dann `funktion` sollte ≥ 7 sein   | Gute Mobilität sollte sich in hoher Funktionsfähigkeit widerspiegeln       |
| K2       | `schmerz`, `belastung`                      | Wenn `schmerz` ≥ 4, dann `belastung` sollte ≥ 5 sein                      | Starke Schmerzen verursachen hohe Belastung                                |
| K3       | `selbstversorgung`, `gewohnte_aktivitaeten` | Wenn `selbstversorgung` ≥ 4, dann `gewohnte_aktivitaeten` sollte ≥ 4 sein | Eingeschränkte Selbstversorgung geht oft mit Aktivitätseinbußen einher     |
| K4       | `angst`, `questions`                        | Wenn `angst` ≥ 4, dann `questions` sollte **nicht leer** sein             | Hohe Angst sollte mit Rückfragen einhergehen                               |
| K5       | `funktion`, `belastung`                     | `funktion` und `belastung` sollten ±2 zueinander liegen                   | Subjektives Belastungsempfinden und Funktionsfähigkeit sollten korrelieren |
| K6       | `schmerz`, `vas`                            | Wenn `schmerz` ≥ 4, dann `vas` sollte ≥ 60 sein                           | Hoher Schmerz → hoher VAS-Wert                                             |
| K7       | `mobilitaet`, `selbstversorgung`            | Wenn `mobilitaet` ≥ 4, dann `selbstversorgung` sollte nicht = 1           | Eingeschränkte Mobilität geht selten mit völliger Selbstständigkeit einher |
| K8       | `angst`, `funktion`                         | Wenn `angst` ≤ 2, dann `funktion` sollte nicht < 4 sein                   | Keine Angst sollte nicht mit sehr schlechter Funktion einhergehen          |

---

## Aktualitätsprüfung

* **Sind die PROM-Daten "frisch" genug, um im klinischen Verlauf noch relevant zu sein?**
* **Gibt es veraltete oder überfällige Einträge?**

## *Aktualitätsregeln* bei `eq5d` und `biopsy`

| Regel-ID | Modul  | Feld(e)        | Bedingung                                           | Begründung                                                            |
| -------- | ------ | -------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| A1       | eq5d   | `date`         | `date` < heute − 6 Monate → **veraltet**            | PROMs sollten regelmäßig (z. B. alle 3–6 Monate) erhoben werden       |
| A2       | biopsy | `biopsy_date`  | `biopsy_date` < heute − 12 Monate → **veraltet**    | Biopsie-Erfahrungen verlieren nach einem Jahr an Relevanz für Verlauf |
| A3       | beide  | `date` fehlt   | Kein Datum → **nicht bewertbar**                    | Ohne Datum kann Aktualität nicht geprüft werden                       |
| A4       | beide  | `date` > heute | Datum liegt in der Zukunft → **inkorrekt/Artefakt** | Daten können nicht aus der Zukunft stammen                            |

---

## Was bedeutet **Eindeutigkeit** bei PROMs?

Eindeutigkeit bedeutet, dass **für denselben Patienten (PID) und denselben Zeitpunkt (Datum)** **nicht mehrere Einträge existieren dürfen**, die sich z.B. nur minimal unterscheiden. Ziel ist es, **Dubletten** oder **falsche Mehrfacheinträge** zu erkennen.

---

## Regeln für **Eindeutigkeit**:

| Regel-ID | Modul  | Feld(er)                    | Bedingung / Prüfung                                                                     |
| -------- | ------ | --------------------------- | --------------------------------------------------------------------------------------- |
| U1       | eq5d   | `pid`, `date`               | **Nur 1 Eintrag pro Patient pro Tag erlaubt**                                           |
| U2       | biopsy | `biopsy_pid`, `biopsy_date` | **Nur 1 Biopsy-Eintrag pro Patient pro Tag erlaubt**                                    |
| U3       | beide  | kompletter Datensatz        | Optional: Wenn zwei Einträge exakt gleich sind → potenzielle Duplikate (Deduplizierung) |
