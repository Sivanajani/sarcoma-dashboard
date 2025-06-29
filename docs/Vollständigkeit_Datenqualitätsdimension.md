# Datenqualitätsdimension: Vollständigkeit

Im Rahmen der Datenqualität wird die **Vollständigkeit** so definiert, dass alle für das Modul relevanten Pflichtfelder befüllt sind. Felder gelten als *bedingt erforderlich*, wenn ihr Ausfüllen von anderen Modulen oder Feldern abhängt.

---

## RadiologyExam

Das Modul *RadiologyExam* enthält Daten zu radiologischen Untersuchungen (z. B. CT, MRT), die zur Beurteilung von Läsionen genutzt werden. Diese Untersuchungen sind entscheidend für die Verlaufskontrolle und Therapieevaluation.

### Vollständigkeitslogik

| Feld                         | Typ       | Pflichtfeld?            | Abhängigkeit                                                                     |
| ---------------------------- | --------- | ----------------------- | -------------------------------------------------------------------------------- |
| `exam_date`                  | `date`    |  Ja                    | —                                                                                |
| `exam_type`                  | `enum`    |  Ja                    | —                                                                                |
| `imaging_timing`             | `enum`    |  Ja                    | —                                                                                |
| `imaging_type`               | `enum`    |  Ja                    | —                                                                                |
| `largest_lesion_size_in_mm`  | `int`     |  Ja                    | —                                                                                |
| `medium_lesion_size_in_mm`   | `int`     |  Ja                    | —                                                                                |
| `smallest_lesion_size_in_mm` | `int`     |  Ja                    | —                                                                                |
| `location_of_lesion`         | `enum`    |  Ja                    | —                                                                                |
| `recist_response`            | `enum`    |  Bedingt erforderlich | Nur wenn *SystemicTherapy* vorhanden ist **und** `therapy_type = "Chemotherapy"` |
| `choi_response`              | `enum`    |  Bedingt erforderlich | Nur wenn *SystemicTherapy* vorhanden ist                                         |
| `irecist_response`           | `enum`    |  Bedingt erforderlich | Nur wenn *SystemicTherapy* mit `therapy_type = "Chemotherapy"`                   |
| `pet_response`               | `enum`    |  Ja                    | —                                                                                |
| `metastasis_presence`        | `boolean` |  Ja                    | —                                                                                |


- Wird das Modul *RadiologyExam* ohne zugehörige *SystematicTherapy* ausgefüllt, werden `recist_response`, `choi_response` und `irecist_response` nicht bewertet.
- Wenn jedoch eine *SystematicTherapy* vorhanden ist, müssen alle drei ausgefüllt sein.

**Beispielberechnung**

- Fall A – ohne SystematicTherapy:  
  → 11 von 11 Pflichtfeldern befüllt  
  → Vollständigkeit = **100 %**

- Fall B – mit SystematicTherapy (Chemo):  
  → 14 erwartete Felder, 12 befüllt  
  → Vollständigkeit = **(12 / 14) × 100 ≈ 85.7%**

---

## Pathology

Das Modul *Pathology* erfasst zentrale pathologische Befunde wie Grading, WHO-Diagnose, Proliferationsindex oder molekulare Tests.

### Vollständigkeitslogik
| Feld                    | Typ    | Pflichtfeld?    | Abhängigkeit       |
| ----------------------- | ------ | --------------- | ------------------ |
| `data_entry_type`       | `enum` |  Ja             | —                  |
| `biopsy_resection_date` | `date` |  Ja             | —                  |
| `registrate_date`       | `date` |  Ja             | —                  |
| `first_report_date`     | `date` |  Ja             | —                  |
| `final_report_date`     | `date` |  Ja             | —                  |
| `prior_pathology`       | `enum` |  Ja             | —                  |
| `who_diagnosis`         | `enum` |  Ja             | —                  |
| `diagnostic_grading`    | `enum` |  Ja             | —                  |
| `judgment_of_surgical_margin`  | `enum` |  Ja      | —                  |
| `proliferation_index`   | `enum` |  Ja             | —                  |
| `mitoses_per_10hpf`     | `enum` |  Ja             | —                  |
| `extent_of_necrosis`    | `enum` |  Ja             | —                  |
| `closest_distance_to_margin_mm`| `int`  |  Ja      | —                  |
| `biological_barrier_to_closest_margin` | `enum` |  Ja  | —              |
| `ihc_performed_status`  | `enum` |  Steuernd       | Steuert `ihc_result` |
| `fish_performed_status` | `enum` |  Steuernd       | Steuert `fish_result`|
| `rna_performed_status`  | `enum` |  Steuernd       | Steuert `rna_result` |
| `dna_performed_status`  | `enum` |  Steuernd       | Steuert `dna_result` |
| `ihc_result`            | `enum` |  Bedingt erforderlich | Nur wenn `ihc_performed_status = Ja` |
| `fish_result`           | `enum` |  Bedingt erforderlich | Nur wenn `fish_performed_status = Ja` |
| `rna_result`            | `enum` |  Bedingt erforderlich | Nur wenn `rna_performed_status = Ja`  |
| `dna_result`                           | `enum` |  Bedingt erforderlich | Nur wenn `dna_performed_status = Ja`  |


- Wenn `*_performed_status = Nein`, darf `*_result` nicht ausgefüllt sein.

**Beispielberechnung**

- Fall A: Alle Pflichtfelder und gültige Kombinationen → 18 von 18 → **100 %**
- Fall B: `fish_result` ausgefüllt, obwohl `fish_performed_status = Nein` → **Fehler + ggf. Red Flag**

---

## Surgery

Das Modul Surgery enthält alle Informationen zu chirurgischen Eingriffen bei Sarkom-Patient:innen. Für die Vollständigkeit gelten in diesem Modul alle Felder als Pflichtfelder – es wird erwartet, dass jedes einzelne Attribut ausgefüllt ist, sobald ein Surgery-Eintrag vorhanden ist.

### Vollständigkeitslogik

| Feld                                      | Typ       | Pflichtfeld? |
| ----------------------------------------- | --------- | ------------ |
| `surgery_date`                            | `date`    | Ja         |
| `institution_name`                        | `string`  | Ja         |
| `indication`                              | `enum`    | Ja         |
| `surgery_side`                            | `enum`    | Ja         |
| `greatest_surgical_tumor_dimension_in_mm` | `int`     | Ja         |
| `had_tumor_spillage`                      | `boolean` | Ja         |
| `anatomic_region`                         | `enum`    | Ja         |
| `resection`                               | `enum`    | Ja         |
| `hemipelvectomy`                          | `enum[]`  | Ja         |
| `reconstruction`                          | `enum`    | Ja         |
| `amputation`                              | `enum`    | Ja         |
| `resected_tumor_margin`                   | `enum`    | Ja         |
| `first_revision_details`                  | `string`  | Ja         |
| `second_revision_details`                 | `string`  | Optional?  |
| `participated_disciplines`                | `enum[]`  | Ja         |


**Beispielberechnung**

- Fall A: 14 von 14 → **100 %**
- Fall B: 13 von 14 → **≈ 92 %**

---

## RadiologyTherapy

Das Modul *RadiologyTherapy* enthält strukturierte Informationen zur Strahlentherapie. Es dokumentiert Indikation, Therapiezeitraum, Dosierung, Volumen und Nebenbefunde. Diese Informationen sind zentral für die Beurteilung der Tumorkontrolle und Nachsorge. In diesem Modul wird jedes einzelne Feld als Pflichtfeld betrachtet – die Vollständigkeit erreicht 100 %, wenn alle Attribute ausgefüllt sind.

### Vollständigkeitslogik

| Feld                                              | Typ       | Pflichtfeld? |
| ------------------------------------------------- | --------- | ---------- |
| `indication`                                      | `enum`    | Ja         |
| `therapy_type`                                    | `enum`    | Ja         |
| `referral_date`                                   | `date`    | Ja         |
| `first_contact_date`                              | `date`    | Ja         |
| `therapy_start_date`                              | `date`    | Ja         |
| `therapy_end_date`                                | `date`    | Ja         |
| `institution_name`                                | `string`  | Ja         |
| `total_dose_in_gy`                                | `float`   | Ja         |
| `given_fractions`                                 | `int`     | Ja         |
| `ptv_volume_in_cm3`                               | `float`   | Ja         |
| `gtv_volume_in_cm3`                               | `float`   | Ja         |
| `was_tumor_located_in_radiated_area`              | `boolean` | Ja         |
| `was_tumor_located_with_pre_existing_lymph_edema` | `boolean` | Ja         |
| `comments`                                        | `text`    | Ja         |
| `hyperthermia_status`                             | `enum`    | Ja         |
| `oncologist`                                      | `enum`    | Nich im DB |

### Beispielberechnung

- **Fall A – vollständig ausgefüllt:**  
  → 15 von 15 Feldern befüllt  
  → Vollständigkeit = **100 %**

- **Fall B – `gtv_volume_in_cm3` fehlt:**  
  → 14 von 15 Feldern befüllt  
  → Vollständigkeit = **(14 / 15) × 100 ≈ 93 %**


---

## SystemicTherapy

Das Modul *SystemicTherapy* dokumentiert die Durchführung systemischer Therapien (z. B. Chemotherapie). Dazu gehören Informationen zur Behandlungslinie, verabreichten Substanz, Zyklusdaten, Dosierung und Verträglichkeit. Diese Angaben sind essenziell für Verlauf, Wirksamkeit und Nebenwirkungsbeurteilung. In diesem Modul sind **alle Felder Pflicht**, mit Ausnahme der **Toxizitätsfelder**, bei denen das Fehlen eine **Warnung (gelb)** auslöst.

### Vollständigkeitslogik

| Feld                       | Typ     | Pflichtfeld? |
| -------------------------- | ------- | ------------ |
| `reason`                   | enum    | Ja         |
| `treatment_line`           | int     | Ja         |
| `cycles_planned`           | enum    | Ja         |
| `bone_protocol`            | enum    | Ja         |
| `softtissue_protocol`      | enum    | Ja         |
| `institution_name`         | string  | Ja         |
| `cycle_start_date`         | date    | Ja         |
| `cycle_end_date`           | date    | Ja         |
| `discontinuation_reason`   | enum    | Ja         |
| `was_rct_concomittant`     | boolean | Ja         |
| `comments`                 | text    | Ja         |
| `clinical_trial_inclusion` | enum    | Ja         |
| `hyperthermia_status`      | enum    | Ja         |

Toxizitätsfelder (toxicity_name, toxicity_grade, toxicity_date) sind aktuell nicht in der Datenbank vorhanden und werden daher nicht berücksichtigt. Bei späterer Integration können sie mit gelber Warnlogik eingebunden werden.

- Die Felder `toxicity_name`, `toxicity_grade`, `toxicity_date` gelten als **erwartet**, jedoch nicht zwingend, aber sie sind auch nicht vorhandne im DB (stant 29.06.25):
  - Wenn leer → **gelbe Warnung anzeigen**
  - Wenn ausgefüllt → **kein Einfluss auf Vollständigkeit**, aber bessere Datenqualität
- Ein fehlender Pflichtwert (aus den oberen 20 Feldern) reduziert die Vollständigkeit direkt.


### Beispielberechnung

- **Fall A – alle Felder inkl. Toxizität befüllt:**  
  → 13 von 13 Feldern ausgefüllt  
  → **Vollständigkeit = 100 %**

---

## Hyperthermia

Das Modul *Hyperthermia* dokumentiert die Durchführung einer Hyperthermiebehandlung als begleitende Massnahme zur systemischen oder lokalen Therapie. Es enthält Informationen zur Indikation, zeitlichen Durchführung, Therapietyp und Sitzungsanzahl.

### Vollständigkeitslogik

| Feld                        | Typ     | Pflichtfeld? |
| --------------------------- | ------- | ------------ |
| indication                  | enum    | Ja         |
| start\_date                 | date    | Ja         |
| end\_date                   | date    | Ja         |
| hyperthermia\_type          | enum    | Ja         |
| therapy\_sessions\_count    | int     | Ja         |
| schedule                    | string  | Ja         |
| board\_accepted\_indication | boolean | Ja         |
| comment                     | text    | Ja         |
| therapy\_type               | enum    | Ja         |
| therapy\_id                 | bigint  | Ja         |


- Alle **10 Felder** müssen ausgefüllt sein, um eine vollständige Datendokumentation zu gewährleisten.
- Leere Felder, leere Strings oder nicht gesetzte Werte (z. B. `null`, `undefined`) werden als **unvollständig** gewertet.
- Auch `schedule` als Freitext-Feld muss einen **sinnvollen Eintrag** enthalten (nicht nur Leerzeichen).

### Beispielberechnung

- **Fall A – alles ausgefüllt:**  
  → 10 von 10 Feldern  
  → **Vollständigkeit = 100 %**

- **Fall B – `board_accepted_indication` fehlt:**  
  → 9 von 10 Feldern  
  → **Vollständigkeit = (9 / 10) × 100 = 90%**

---

## SarcomaBoard

Das Modul *SarcomaBoard* dokumentiert die Besprechungen und Entscheidungen aus interdisziplinären Tumorboards zur Behandlung von Sarkom-Patient:innen. Die strukturierte Erfassung dieser Entscheidungen ist zentral für Nachvollziehbarkeit, Therapiekonsistenz und Verlaufskontrolle.

### Vollständigkeitslogik

| Feld                                | Typ       | Pflichtfeld? |
| ----------------------------------- | --------- | ------------ |
| `presentation_date`                 | `date`    | Ja         |
| `reason_for_presentation`           | `enum`    | Ja         |
| `status_before_follow_up`           | `enum`    | Ja         |
| `unplanned_excision_date`           | `date`    | Ja         |
| `whoops_surgery_institution_name`   | `string`  | Ja         |
| `status_after_follow_up`            | `enum`    | Ja         |
| `treatment_before_follow_up`        | `enum`    | Ja         |
| `follow_up_reason`                  | `enum`    | Ja         |
| `question`                          | `text`    | Ja         |
| `last_execution`                    | `enum`    | Ja         |
| `proposed_procedure`                | `text`    | Ja         |
| `current_ecog`                      | `int`     | Ja         |
| `decision_surgery`                  | `enum`    | Ja         |
| `decision_surgery_comment`          | `text`    | Ja         |
| `decision_radio_therapy`            | `enum`    | Ja         |
| `decision_radio_therapy_comment`    | `text`    | Ja         |
| `decision_systemic_surgery`         | `enum`    | Ja         |
| `decision_systemic_surgery_comment` | `text`    | Ja         |
| `decision_follow_up`                | `enum`    | Ja         |
| `decision_follow_up_comment`        | `text`    | Ja         |
| `decision_diagnostics`              | `enum`    | Ja         |
| `decision_diagnostics_comment`      | `text`    | Ja         |
| `decision_palliative_care`          | `enum`    | Ja         |
| `decision_palliative_care_comment`  | `text`    | Ja         |
| `summary`                           | `text`    | Ja         |
| `fast_track`                        | `boolean` | Ja         |
| `further_details`                   | `text`    | Nein       |
| `presenting_physician`              | `enum`    | Nein, ist auch nicht in der DB!       |


- Alle **27 Felder ausser `further_details`** gelten als Pflichtfelder.
- Das Feld `further_details` kann leer bleiben, ohne dass dies die Vollständigkeit beeinflusst.
- `presenting_physician` hat es nicht im DB-Dump.

### Beispielberechnung

- **Fall A – alles ausgefüllt (ausser `further_details`):**  
  → 21 von 21 Pflichtfeldern  
  → **Vollständigkeit = 100 %**

- **Fall B – `summary` fehlt, `further_details` leer:**  
  → 20 von 21 Pflichtfeldern  
  → **Vollständigkeit = (20 / 21) × 100 ≈ 95 %**

---
## Diagnosis

Das Modul *Diagnosis* dokumentiert die Haupt- und Nebendiagnosen sowie die krankheitsbezogene Vorgeschichte der Patient:innen. Es enthält wesentliche Informationen für Verlauf, Nachsorge und Statusbewertung.

### Vollständigkeitslogik

| Feld                                    | Typ      | Pflichtfeld? |
| --------------------------------------- | -------- | ------------ |
| `tumor_anatomic_region`                 | `string` | Ja         |
| `tumor_anatomic_lesion_side`            | `string` | Ja         |
| `tumor_syndromes`                       | `array`  | Ja         |
| `tumor_diagnosis`                       | `text`   | Ja         |
| `additional_tumor_anatomic_region`      | `string` | Ja         |
| `additional_tumor_anatomic_lesion_side` | `string` | Ja         |
| `additional_tumor_diagnosis`            | `text`   | Ja         |
| `other_diagnosis`                       | `text`   | Ja         |
| `patient_history`                       | `text`   | Ja         |
| `diagnosis_ecog`                        | `int`    | Ja         |
| `last_contact_date`                     | `date`   | Ja         |
| `last_status`                           | `enum`   | Ja         |
| `death_reason`                          | `enum`   | Nein       |


- Es werden **12 Felder für die Vollständigkeit** berücksichtigt.
- Das Feld `death_reason` kann leer bleiben, ohne dass dies die Vollständigkeit reduziert.

### Beispielberechnung

- **Fall A – alle Felder ausser `death_reason` befüllt:**  
  → 12 von 12 Pflichtfeldern  
  → **Vollständigkeit = 100 %**

- **Fall B – `previous_cancer` fehlt:**  
  → 11 von 12 Pflichtfeldern  
  → **Vollständigkeit = (11 / 12) × 100 ≈ 91.7%**

---

## Tumor

**Dieses Modul gibt es nicht nur im ER-Diagarmm (stand 29.06.25), es ist wahrscheinlich mit Diagnosis verschmolzen!**

Das Modul *Tumor* enthält grundlegende Informationen zur Lage und klinischen Vorgeschichte der Tumorerkrankung. Diese Angaben sind essenziell für die Einordnung, Therapieplanung und Dokumentation im Verlauf.

### Vollständigkeitslogik

| Feld                  | Typ   | Pflichtfeld? |
|-----------------------|--------|----------------|
| anatomic_region       | enum  | Ja             |
| anatomic_lesion_side  | enum  | Ja             |
| clinical_history      | text  | Ja             |

- Alle **3 Felder sind verpflichtend**.
- `clinical_history` als Freitext darf **nicht leer** sein oder nur aus Leerzeichen bestehen.
- Eine nicht ausgefüllte `anatomic_region` oder `anatomic_lesion_side` führt direkt zu einem **unvollständigen Datensatz**.

### Beispielberechnung

- **Fall A – alle Felder ausgefüllt:**  
  → 3 von 3 Feldern  
  → **Vollständigkeit = 100 %**

- **Fall B – `clinical_history` leer:**  
  → 2 von 3 Feldern  
  → **Vollständigkeit = (2 / 3) × 100 ≈ 66 %**