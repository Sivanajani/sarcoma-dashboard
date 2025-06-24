# Datenqualitätsdimension: Vollständigkeit

Im Rahmen der Datenqualität wird die **Vollständigkeit** so definiert, dass alle für das Modul relevanten Pflichtfelder befüllt sind. Felder gelten als *bedingt erforderlich*, wenn ihr Ausfüllen von anderen Modulen oder Feldern abhängt.

---

## RadiologyExam

Das Modul *RadiologyExam* enthält Daten zu radiologischen Untersuchungen (z. B. CT, MRT), die zur Beurteilung von Läsionen genutzt werden. Diese Untersuchungen sind entscheidend für die Verlaufskontrolle und Therapieevaluation.

### Vollständigkeitslogik

| Feld                        | Typ   | Pflichtfeld?            | Abhängigkeit |
|----------------------------|--------|--------------------------|--------------|
| exam_date                  | date  | Ja                       | —            |
| exam_type                  | enum  | Ja                       | —            |
| imaging_timing             | enum  | Ja                       | —            |
| imaging_type               | enum  | Ja                       | —            |
| largest_lesion_size_in_mm | int   | Ja                       | —            |
| medium_lesion_size_in_mm  | int   | Ja                       | —            |
| smallest_lesion_size_in_mm| int   | Ja                       | —            |
| location_of_lesion        | enum  | Ja                       | —            |
| recist_response           | enum  | Bedingt erforderlich     | Nur wenn SystematicTherapy vorhanden ist und `therapy_type = Chemotherapy` |
| choi_response             | enum  | Bedingt erforderlich     | Nur wenn SystematicTherapy vorhanden ist |
| irecist_response          | enum  | Bedingt erforderlich     | Nur wenn `therapy_type = Chemotherapy` |

- Wird das Modul *RadiologyExam* ohne zugehörige *SystematicTherapy* ausgefüllt, werden `recist_response`, `choi_response` und `irecist_response` nicht bewertet.
- Wenn jedoch eine *SystematicTherapy* vorhanden ist, müssen alle drei ausgefüllt sein.

**Beispielberechnung**

- Fall A – ohne SystematicTherapy:  
  → 8 von 8 Pflichtfeldern befüllt  
  → Vollständigkeit = **100 %**

- Fall B – mit SystematicTherapy (Chemo):  
  → 11 erwartete Felder, 10 befüllt  
  → Vollständigkeit = **(10 / 11) × 100 ≈ 91 %**

---

## Pathology

Das Modul *Pathology* erfasst zentrale pathologische Befunde wie Grading, WHO-Diagnose, Proliferationsindex oder molekulare Tests.

### Vollständigkeitslogik

| Feld                   | Typ   | Pflichtfeld?           | Abhängigkeit |
|------------------------|--------|-------------------------|--------------|
| data_entry_type        | enum  | Ja                      | —            |
| responsible_pathologist| enum  | Ja                      | —            |
| biopsy_resection_date  | date  | Ja                      | —            |
| registrate_date        | date  | Ja                      | —            |
| first_report_date      | date  | Ja                      | —            |
| final_report_date      | date  | Ja                      | —            |
| prior_pathology        | enum  | Ja                      | —            |
| who_diagnosis          | enum  | Ja                      | —            |
| diagnostic_grading     | enum  | Ja                      | —            |
| proliferation_index    | enum  | Ja                      | —            |
| mitoses_per_10hpf      | enum  | Ja                      | —            |
| ihc_performed_status   | enum  | Steuernd                | Steuert `ihc_result` |
| fish_performed_status  | enum  | Steuernd                | Steuert `fish_result` |
| rna_performed_status   | enum  | Steuernd                | Steuert `rna_result` |
| dna_performed_status   | enum  | Steuernd                | Steuert `dna_result` |
| ihc_result             | enum  | Bedingt erforderlich    | Nur wenn `ihc_performed_status = Ja` |
| fish_result            | enum  | Bedingt erforderlich    | Nur wenn `fish_performed_status = Ja` |
| rna_result             | enum  | Bedingt erforderlich    | Nur wenn `rna_performed_status = Ja` |
| dna_result             | enum  | Bedingt erforderlich    | Nur wenn `dna_performed_status = Ja` |

- Wenn `*_performed_status = Nein`, darf `*_result` nicht ausgefüllt sein.

**Beispielberechnung**

- Fall A: Alle Pflichtfelder und gültige Kombinationen → 17 von 17 → **100 %**
- Fall B: `fish_result` ausgefüllt, obwohl `fish_performed_status = Nein` → **Fehler + ggf. Red Flag**

---

## Surgery

Das Modul Surgery enthält alle Informationen zu chirurgischen Eingriffen bei Sarkom-Patient:innen. Für die Vollständigkeit gelten in diesem Modul alle Felder als Pflichtfelder – es wird erwartet, dass jedes einzelne Attribut ausgefüllt ist, sobald ein Surgery-Eintrag vorhanden ist.

### Vollständigkeitslogik

| Feld                                  | Typ     | Pflichtfeld? |
|---------------------------------------|----------|----------------|
| surgery_date                          | date    | Ja             |
| institution                           | enum    | Ja             |
| indication                            | enum    | Ja             |
| surgery_side                          | enum    | Ja             |
| greatest_surgical_tumor_dimension_in_mm | int | Ja           |
| had_tumor_spillage                    | boolean | Ja             |
| anatomic_region                       | enum    | Ja             |
| resection                             | enum    | Ja             |
| hemipelvectomy                        | enum    | Ja             |
| reconstruction                        | enum    | Ja             |
| amputation                            | enum    | Ja             |
| resected_tumor_margin                 | enum    | Ja             |
| participated_disciplines             | enum[]  | Ja (min. 1)    |

**Beispielberechnung**

- Fall A: 13 von 13 → **100 %**
- Fall B: 12 von 13 → **≈ 92 %**

---

## RadiologyTherapy

Das Modul *RadiologyTherapy* enthält strukturierte Informationen zur Strahlentherapie. Es dokumentiert Indikation, Therapiezeitraum, Dosierung, Volumen und Nebenbefunde. Diese Informationen sind zentral für die Beurteilung der Tumorkontrolle und Nachsorge. In diesem Modul wird jedes einzelne Feld als Pflichtfeld betrachtet – die Vollständigkeit erreicht 100 %, wenn alle Attribute ausgefüllt sind.

### Vollständigkeitslogik

| Feld                                           | Typ     | Pflichtfeld? |
|------------------------------------------------|----------|----------------|
| indication                                     | enum    | Ja             |
| therapy_type                                   | enum    | Ja             |
| referal_date                                   | date    | Ja             |
| first_contact_date                             | date    | Ja             |
| therapy_start_date                             | date    | Ja             |
| therapy_end_date                               | date    | Ja             |
| institute                                      | enum    | Ja             |
| oncologist                                     | enum    | Ja             |
| total_dose_in_gy                               | numeric | Ja             |
| given_fractions                                | int     | Ja             |
| ptv_volume_in_cm3                              | float   | Ja             |
| gtv_volume_in_cm3                              | float   | Ja             |
| was_tumor_located_in_radiated_area             | boolean | Ja             |
| was_tumor_located_with_pre_existing_lymph_edema| boolean | Ja             |
| comments                                       | text    | Ja             |

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

| Feld                     | Typ     | Pflichtfeld?       | Anmerkung                         |
|--------------------------|----------|---------------------|------------------------------------|
| reason                   | enum    | Ja                  | —                                  |
| treatment_line           | int     | Ja                  | —                                  |
| cycles_planned           | enum    | Ja                  | —                                  |
| bone_protocol            | enum    | Ja                  | —                                  |
| softtissue_protocol      | enum    | Ja                  | —                                  |
| oncologist               | enum    | Ja                  | —                                  |
| institution              | enum    | Ja                  | —                                  |
| cycle_start              | date    | Ja                  | —                                  |
| cycle_end                | date    | Ja                  | —                                  |
| discontinuation_reason   | enum    | Ja                  | —                                  |
| rct_concomittant_status  | enum    | Ja                  | —                                  |
| comments                 | text    | Ja                  | Muss sinnvoll befüllt sein         |
| clinical_trial_inclusion | enum    | Ja                  | —                                  |
| drug_type                | enum    | Ja                  | —                                  |
| drug_dose                | numeric | Ja                  | —                                  |
| drug_dose_unit           | enum    | Ja                  | —                                  |
| drug_frequency           | numeric | Ja                  | —                                  |
| drug_frequency_unit      | numeric | Ja                  | —                                  |
| drug_route               | enum    | Ja                  | —                                  |
| drug_administration_day  | string  | Ja                  | —                                  |
| toxicity_name            | enum    | Warnung bei leer | Optional, aber erwartet            |
| toxicity_grade           | enum    | Warnung bei leer | Optional, aber erwartet            |
| toxicity_date            | date    | Warnung bei leer | Optional, aber erwartet            |

- Alle Felder bis auf die letzten drei sind **immer erforderlich**.
- Die Felder `toxicity_name`, `toxicity_grade`, `toxicity_date` gelten als **erwartet**, jedoch nicht zwingend:
  - Wenn leer → **gelbe Warnung anzeigen**
  - Wenn ausgefüllt → **kein Einfluss auf Vollständigkeit**, aber bessere Datenqualität
- Ein fehlender Pflichtwert (aus den oberen 20 Feldern) reduziert die Vollständigkeit direkt.


### Beispielberechnung

- **Fall A – alle Felder inkl. Toxizität befüllt:**  
  → 23 von 23 Feldern ausgefüllt  
  → **Vollständigkeit = 100 %**

- **Fall B – alle Pflichtfelder befüllt, Toxizität leer:**  
  → 20 von 20 Pflichtfeldern befüllt  
  → **Vollständigkeit = 100 %**, aber **Warnung anzeigen**

- **Fall C – 1 Pflichtfeld fehlt (z. B. `drug_dose`) + Toxizität leer:**  
  → 19 von 20 Pflichtfeldern befüllt  
  → **Vollständigkeit = 95 % + Warnung**

---

## Hyperthermia

Das Modul *Hyperthermia* dokumentiert die Durchführung einer Hyperthermiebehandlung als begleitende Massnahme zur systemischen oder lokalen Therapie. Es enthält Informationen zur Indikation, zeitlichen Durchführung, Therapietyp und Sitzungsanzahl.

### Vollständigkeitslogik

| Feld                      | Typ     | Pflichtfeld? |
|---------------------------|----------|----------------|
| indication                | enum    | Ja             |
| indication_other          | enum    | Ja             |
| start_date                | date    | Ja             |
| end_date                  | date    | Ja             |
| hyperthermia_type         | enum    | Ja             |
| therapy_sessions_count    | int     | Ja             |
| schedule                  | string  | Ja             |
| board_accepted_indication | enum    | Ja             |

- Alle **8 Felder** müssen ausgefüllt sein, um eine vollständige Datendokumentation zu gewährleisten.
- Leere Felder, leere Strings oder nicht gesetzte Werte (z. B. `null`, `undefined`) werden als **unvollständig** gewertet.
- Auch `schedule` als Freitext-Feld muss einen **sinnvollen Eintrag** enthalten (nicht nur Leerzeichen).

### Beispielberechnung

- **Fall A – alles ausgefüllt:**  
  → 8 von 8 Feldern  
  → **Vollständigkeit = 100 %**

- **Fall B – `board_accepted_indication` fehlt:**  
  → 7 von 8 Feldern  
  → **Vollständigkeit = (7 / 8) × 100 = 87.5 %**

---

## SarcomaBoard

Das Modul *SarcomaBoard* dokumentiert die Besprechungen und Entscheidungen aus interdisziplinären Tumorboards zur Behandlung von Sarkom-Patient:innen. Die strukturierte Erfassung dieser Entscheidungen ist zentral für Nachvollziehbarkeit, Therapiekonsistenz und Verlaufskontrolle.

### Vollständigkeitslogik

| Feld                              | Typ     | Pflichtfeld? |
|-----------------------------------|----------|----------------|
| presentation_date                 | date    | Ja             |
| reason_for_presentation           | enum    | Ja             |
| presenting_physician              | enum    | Ja             |
| question                          | text    | Ja             |
| last_execution                    | enum    | Ja             |
| proposed_procedure                | text    | Ja             |
| current_ecog                      | int     | Ja             |
| decision_surgery                  | enum    | Ja             |
| decision_surgery_comment          | text    | Ja             |
| decision_radio_therapy            | enum    | Ja             |
| decision_radio_therapy_comment    | text    | Ja             |
| decision_systemic_surgery         | enum    | Ja             |
| decision_systemic_surgery_comment | text    | Ja             |
| decision_follow_up                | enum    | Ja             |
| decision_follow_up_comment        | text    | Ja             |
| decision_diagnostics              | enum    | Ja             |
| decision_diagnostics_comment      | text    | Ja             |
| decision_palliative_care          | enum    | Ja             |
| decision_palliative_care_comment  | text    | Ja             |
| summary                           | text    | Ja             |
| further_details                   | text    | Nein           |
| fast_track                        | boolean | Ja             |

- Alle **21 Felder ausser `further_details`** gelten als Pflichtfelder.
- Das Feld `further_details` kann leer bleiben, ohne dass dies die Vollständigkeit beeinflusst.

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

| Feld                    | Typ   | Pflichtfeld? |
|-------------------------|--------|----------------|
| main_referral_diagnosis | text  | Ja             |
| cancer_syndrome         | enum  | Ja             |
| previous_cancer         | string| Ja             |
| other_diagnoses         | text  | Ja             |
| patient_history         | text  | Ja             |
| diagnosis_ecog          | int   | Ja             |
| last_contact_date       | date  | Ja             |
| last_status             | enum  | Ja             |
| death_reason            | enum  | Nein           |
| follow_up_physician     | enum  | Ja             |

- Es werden **9 Felder für die Vollständigkeit** berücksichtigt.
- Das Feld `death_reason` kann leer bleiben, ohne dass dies die Vollständigkeit reduziert.

### Beispielberechnung

- **Fall A – alle Felder ausser `death_reason` befüllt:**  
  → 9 von 9 Pflichtfeldern  
  → **Vollständigkeit = 100 %**

- **Fall B – `previous_cancer` fehlt:**  
  → 8 von 9 Pflichtfeldern  
  → **Vollständigkeit = (8 / 9) × 100 ≈ 89 %**

---

## Tumor

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