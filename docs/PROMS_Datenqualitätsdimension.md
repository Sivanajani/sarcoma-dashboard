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


