# Datenqualitätsdimension: Konsistenz

Konsistenz beschreibt den Grad an logischer Widerspruchsfreiheit innerhalb eines Datensatzes oder zwischen mehreren Einträgen. PROM-Daten gelten als konsistent, wenn sie inhaltlich zusammenpassen – sowohl untereinander als auch in Bezug auf andere Patientenmerkmale (z.B. Alter, Geschlecht, Erkrankungsverlauf). Inkonsistenzen entstehen häufig durch Mehrfacheinträge, Missverständnisse bei der Befragung oder technische Übertragungsfehler. Laut Batini et al. (2009) ist Konsistenz besonders relevant in Systemen mit mehreren Datenquellen oder bei manueller Dateneingabe.

## Konsistenzlogik für Diagnosis

## Konsistenzregel 1:

### `tumor_anatomic_region` und `tumor_anatomic_lesion_side` müssen **gemeinsam gepflegt oder gemeinsam leer** sein.

### **Regelbeschreibung:**

> **Regelname:** Anatomische Region und Seite – Kopplungsregel
> **Betroffene Felder:** `tumor_anatomic_region`, `tumor_anatomic_lesion_side`
> **Typ:** Konsistenzprüfung (Feldkombination)

**Definition:**
Wenn eine anatomische Tumorregion (`tumor_anatomic_region`) angegeben wird, muss auch die zugehörige Seite (`tumor_anatomic_lesion_side`) angegeben werden – und umgekehrt. Beide Felder bilden eine logische Einheit. Einzelne Angaben führen zu Interpretationsunsicherheit über die genaue Tumorlokalisation.


### **Beispiele**

| `tumor_anatomic_region` | `tumor_anatomic_lesion_side` | Ergebnis | Begründung                                    |
| ----------------------- | ---------------------------- | -------- | --------------------------------------------- |
| Femur                   | links                        | OK       | Beide Angaben vorhanden                       |
| –                       | –                            | OK       | Beide Felder leer (keine Tumorregion erfasst) |
| Femur                   | –                            | Fehler   | Region vorhanden, aber Seite fehlt            |
| –                       | rechts                       | Fehler   | Seite vorhanden, aber Region fehlt            |

---

### **Formale Logik:**

> `(region is NULL AND side is NULL)`
> **ODER**
> `(region is NOT NULL AND side is NOT NULL)`
> Alles andere ist **inkonsistent**

---
## Konsistenzregel 2 – Dokumentation

### Zusätzliche Tumorregion & Seite – Kopplungsregel

**Felder:** `additional_tumor_anatomic_region`, `additional_tumor_lesion_side`
**Typ:** Konsistenzregel (Feldpaar)

---

### **Definition:**

Wenn eine zusätzliche anatomische Tumorregion (`additional_tumor_anatomic_region`) angegeben wird, muss auch die zugehörige Seite (`additional_tumor_lesion_side`) angegeben sein – und umgekehrt. Die Felder bilden eine logische Einheit, die nur sinnvoll ist, wenn beide gepflegt sind. Einzeln hinterlegte Werte führen zu fehlender Kontextinterpretierbarkeit.

---

### **Beispiele:**

| `additional_tumor_anatomic_region` | `additional_tumor_lesion_side` | Ergebnis | Begründung                         |
| ---------------------------------- | ------------------------------ | -------- | ---------------------------------- |
| Thorax                             | rechts                         | OK       | Beide Angaben vorhanden            |
| –                                  | –                              | OK       | Keine Zusatzregion dokumentiert    |
| Thorax                             | –                              | Fehler   | Region vorhanden, aber Seite fehlt |
| –                                  | links                          | Fehler   | Seite vorhanden, aber Region fehlt |

---

### **Formale Bedingung:**

```text
(bool(additional_region) == bool(additional_side))
```

> Nur dann konsistent, wenn **beide leer** oder **beide gefüllt** sind.

---

### **Fehlermeldung (für Backend / API):**

> *„Zusätzliche Tumorregion und Seite müssen gemeinsam ausgefüllt oder gemeinsam leer sein.“*

---

## Konsistenzregel 3 – ECOG bei Verstorbenen

**Modul:** `Diagnosis` (`croms_diagnoses`)
**Regelname:** `ECOG bei Verstorbenen`
**Betroffene Felder:** `diagnosis_ecog`, `last_status` bzw. `death_reason`

---

### Beschreibung

Die ECOG-Bewertung (`diagnosis_ecog`) misst den physischen Allgemeinzustand und ist nur bei lebenden Patient\:innen relevant. Ist ein Patient verstorben, sollte dieses Feld **nicht mehr befüllt sein**, da es retrospektiv keinen Aussagewert mehr hat.

---

### Logik der Konsistenzregel

Wenn der Patient verstorben ist, darf kein aktueller ECOG-Score vorhanden sein.

**Konkret:**

* Wenn `last_status` = `"verstorben"`
  → dann muss `diagnosis_ecog` leer sein (`NULL` oder `None`)
  Optionale Alternative: Statt `last_status` kann auch `death_reason` als robustere Referenz verwendet werden

---

### Beispiele

| last\_status | death\_reason    | diagnosis\_ecog | Konsistent?                        |
| ------------ | ---------------- | --------------- | ---------------------------------- |
| verstorben   | Tumorprogression | `None`          | Ja                                 |
| verstorben   | Tumorprogression | `2`             | Nein                               |
| lebend       | `None`           | `1`             | Ja                                 |
| lebend       | `None`           | `None`          | Nein *(→ siehe Vollständigkeit)*   |

---

### Hinweis

Diese Konsistenzregel ist **nicht identisch mit der Vollständigkeitsregel**:

* Die **Vollständigkeitsregel** erwartet, dass `diagnosis_ecog` **ausgefüllt** ist – **es sei denn**, `death_reason` ist gesetzt
* Die **Konsistenzregel** prüft im Gegenzug, dass kein ECOG-Wert vorhanden ist, **wenn** der Patient verstorben ist (`last_status = "verstorben"` oder `death_reason ≠ NULL`)

---

Perfekt, hier ist die **Dokumentation zur Konsistenzregel 4** für das Modul `Diagnosis`:

---

## Konsistenzregel 4 – `death_reason` ↔ `last_status`

**Regelname:** `Todesursache nur bei Verstorbenen`
**Betroffene Felder:** `death_reason`, `last_status`

---

### Beschreibung

Ein Eintrag im Feld `death_reason` ist **nur sinnvoll**, wenn der Patient auch tatsächlich als **verstorben** markiert wurde (`last_status = "verstorben"`). Umgekehrt wird bei einem lebenden Patienten kein `death_reason` erwartet.

---

### Logik der Konsistenzregel

* **Wenn** `death_reason` **ausgefüllt ist**
  → **dann muss** `last_status = "verstorben"` sein 
* **Wenn** `last_status ≠ "verstorben"`
  → **dann muss** `death_reason` **leer** sein 

---

### Beispiele

| last\_status | death\_reason    | Konsistent?                                    |
| ------------ | ---------------- | ---------------------------------------------- |
| verstorben   | Tumorprogression | Ja                                             |
| lebend       | `None`           | Ja                                             |
| lebend       | Unfall           | Nein                                           |
| verstorben   | `None`           | *Optional* → okay, aber evtl. unvollständig    |

---

### Hinweis

Diese Regel prüft **inhaltliche Konsistenz**, nicht Vollständigkeit.
Wenn ein Patient als `verstorben` markiert ist, aber kein `death_reason` eingetragen wurde, **ist das konsistent**, aber ggf. **nicht vollständig** (→ siehe Vollständigkeit).

---

## Konsistenzlogik für SarcomaBoard

| Regel                                                                                                         | Beschreibung                      | Validierungsidee                                     |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------- |
| **1. `decision_* = "ja"` → `status_after_follow_up` ≠ leer** | Wenn eine Entscheidung (OP, Radiotherapie, Systemtherapie) getroffen wurde, sollte ein Folge-Status dokumentiert sein. | Wenn `decision_X = ja` → `status_after_follow_up` muss gesetzt sein   |
| **2. `status_before_follow_up` ≠ `status_after_follow_up`**  | Sollte sich im Follow-up etwas ändern? Falls gleich: evtl. Hinweis auf fehlende Aktualisierung  | Optional, informativ – nicht zwingend als Fehler   |
| **3. `current_ecog` gesetzt → `status_before_follow_up` oder `status_after_follow_up` sollte vorhanden sein** | Wenn ECOG gesetzt wurde, sollte auch ein medizinischer Status dokumentiert sein                                        | Konsistenz zwischen klinischem Zustand und Verlauf                                 |

---

## Konsistenzlogik für Hyperthermia

|Regel                                                                |	Beschreibung                                                                                             |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| Datums-Konsistenz: start_date/ end_date	                            | Wenn beide Daten (start_date, end_date) vorhanden sind, muss start_date ≤ end_date gelten.               |
| Sitzungsanzahl vs. Indikation: therapy_sessions_count               |	Wenn therapy_sessions_count gesetzt ist, muss indication ebenfalls angegeben sein.                       |
| board_accepted_indication vs. indication: board_accepted_indication |	Wenn board_accepted_indication = True, sollte auch indication gesetzt sein.                              |
| start_date benötigt indication                                      |	Wenn start_date vorhanden ist, sollte indication gesetzt sein.                                           |
| therapy_type benötigt indication: therapy_type                      | Wenn therapy_type gesetzt ist, sollte auch indication gesetzt sein                         |

---

## Korrektheitslogik für Systemic Therapy

| **Regel** | **Beschreibung**                                                                              | **Validierungslogik**                                                                   | 
| --------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | 
| 1         | **treatment\_line > 1 → cycle\_start\_date muss gesetzt sein**                                | Wenn `treatment_line` > 1 → `cycle_start_date` darf nicht leer sein                     | 
| 2         | **Wenn `hyperthermia_status` gesetzt ist, sollte auch `reason` oder `comments` gefüllt sein** | Logisch: Wenn Hyperthermie geplant ist, sollte ein Kontext dokumentiert sein            | 
| 3         | **discontinuation\_reason gesetzt → cycle\_end\_date muss vorhanden sein**                    | Wenn eine Beendigungs-Begründung vorhanden ist, muss das Therapieende dokumentiert sein | 
| 4         | **Wenn `was_rct_concomittant` = true → clinical\_trial\_inclusion sollte nicht leer sein**    | Wenn Begleitstudie aktiv, dann sollte Studienname gesetzt sein                          | 
| 5         | **Wenn `bone_protocol` oder `softtissue_protocol` gesetzt → `reason` darf nicht leer sein**   | Es braucht einen medizinischen Grund für ein Protokoll                                  | 

---

## **Konsistenzregeln für `croms_radiology_therapies`**

| **Regelname**                   | **Beschreibung**                                                    | **Validierungslogik**                                   |
| ------------------------------- | --------------------------------------------------------------------| ------------------------------------------------------- |
| `start_end_consistency`         | Wenn `therapy_start_date` oder `therapy_end_date` gesetzt sind, dann müssen **beide** vorhanden sein | → `(start AND end)` oder `(NOT start AND NOT end)` |
| `dose_fraction_consistency`     | Wenn `total_dose_in_gy` gesetzt ist, muss auch `given_fractions` gesetzt sein – und umgekehrt | → `(dose AND fractions)` oder `(NOT dose AND NOT fractions)` |
| `volume_consistency`            | Wenn `ptv_volume_in_cm3` gesetzt ist, sollte auch `gtv_volume_in_cm3` gesetzt sein (oder beide leer)  | → `(ptv AND gtv)` oder `(NOT ptv AND NOT gtv)`               |
| `hyperthermia_needs_indication` | Wenn `hyperthermia_status` gesetzt ist, muss `indication` gesetzt sein (Kontextpflicht)   | → `if hyperthermia → indication OR comments`                 |
| `first_before_start`            | Wenn `therapy_start_date` und `first_contact_date` vorhanden sind, dann muss `first_contact_date` ≤ `therapy_start_date` sein | → `first_contact_date <= therapy_start_date`                 |

---

## **Konsistenzregeln für `croms_surgeries`**

| Regelname                         | Beschreibung                            | Validierungslogik                                              |
| --------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| `amputation_needs_region`         | Wenn eine Amputation durchgeführt wurde, muss auch eine anatomische Region dokumentiert sein     | → `amputation` ≠ "keine" → `anatomic_region` muss gesetzt sein |
| `revision_needs_margin`           | Wenn `first_revision_details` oder `second_revision_details` gesetzt ist → `resected_tumor_margin` muss vorhanden sein | Revisionen setzen meist unzureichenden Tumorrand voraus        |
| `surgery_side_needs_region`       | Wenn `surgery_side` gesetzt ist, sollte auch `anatomic_region` angegeben werden       | → `surgery_side` ≠ leer → `anatomic_region` ≠ leer             |
| `reconstruction_needs_indication` | Wenn `reconstruction` gesetzt ist → `indication` sollte nicht leer sein       | → `reconstruction` ≠ leer → `indication` ≠ leer                |
| `disciplines_needs_resection`     | Wenn mehrere Disziplinen beteiligt waren, sollte das Resection-Feld ausgefüllt sein    | → `participated_disciplines.length ≥ 2` → `resection` ≠ leer   |

---

