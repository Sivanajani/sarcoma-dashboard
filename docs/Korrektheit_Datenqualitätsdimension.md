# **Datenqualitätsdimension: Korrektheit**:

### **Benötigte Listen zur Validierung**

1. `anatomic_region`: Liste gültiger anatomischer Regionen
2. `lesion_side`: Zulässige Seitenangaben: „links“, „rechts“, „beidseitig“, „zentral“, „nicht beurteilbar“
3. `tumor_syndromes`: Liste aller Tumor-Diagnosen
4. `sarcoma_diagnoses`: Liste aller Sarkom-Diagnosen
5. `ALLOWED_ECOG_VALUES`: \[0, 1, 2, 3, 4]
6. `last_status`: „progressiv“, „stabil“, „Remission“, „komplette Remission“, „Rezidiv“, „verstorben“
7. `death_reason`: „tumorbedingt“, „Therapiekomplikation“, „zweite Tumorerkrankung“, „Infektion“, „Unfall“, „Herzversagen“, „unbekannt“, „nicht dokumentiert“
8. `ALLOWED_PRESENTATION_REASONS`: Begrenzte Anzahl sinnvoller Gründe für die Vorstellung im Sarkom-Board
9. Status-Angaben: z. B. „geplant“, „bereits operiert“, „unklar“
10. Therapieformen: z. B. „keine“, „Systemtherapie“, „Bestrahlung“
11. Entscheidungen (ja/nein): „ja“, „nein“, „noch offen“
12. Boolean: `true`, `false`
13. `indication`: Optionale Liste typischer Indikationen, z. B. „Rezidivprävention“, „Primärtherapie“
14. `hyperthermia_type`: z. B. „lokoregionär“, „Ganzkörper“, „intrakavitäre“
15. `schedule`: Mögliche Therapieschemata wie „3×/Woche“, „täglich“, „nach Bedarf“
16. `therapy_type`: z. B. „adjuvant“, „neoadjuvant“, „palliativ“, „kurativ“
17. `reason`: z. B. „adjuvant“, „neoadjuvant“, „palliativ“, „kurativ“, „Rezidiv“
18. `bone_protocol` / `softtissue_protocol`: Strukturierte Protokollnamen (z. B. „EURAMOS“, „VIDE“, „VAIA“)
19. `discontinuation_reason`: z. B. „Nebenwirkungen“, „Progress“, „Patient\:innenwunsch“, „Abbruch wegen Komorbidität“
20. `clinical_trial_inclusion`: z. B. „RCT“, „Registerstudie“, „nicht teilgenommen“, „abgelehnt“
21. `hyperthermia_status`: z. B. „parallel“, „nicht relevant“, „geplant“, „nicht erfolgt“
22. `radiology_indication`: Optional, z. B. „Primärtumor“, „Metastase“, „Rezidiv“
23. `radiology_therapy_type`: z. B. „adjuvant“, „neoadjuvant“, „palliativ“, „kurativ“, „definitiv“, „Boost“, „Re-Bestrahlung“
24. `resection`: z. B. „R0“, „R1“, „R2“
25.	Liste von `Fachdisziplinen`, z. B. ["Chirurgie", "Radiologie"]
26.	`data_entry_type`: z. B. „Biopsie“, „Resektion“
27.	`diagnostic_grading`: z. B. „G1“, „G2“, „G3“, „low grade“, „high grade“
28.	`judgment_of_surgical_margin`: z. B. „R0“, „R1“, „R2“, „nicht beurteilbar“
29.	`proliferation_index / mitoses_per_10hpf`: z. B. „<10“, „10–20“, „>20“ oder absolute Werte
30.	`extent_of_necrosis`: Prozentangaben oder Kategorien wie „gering“, „moderat“, „ausgedehnt“
31.	`biological_barrier_to_closest_margin`: z. B. „Faszie“, „Kapsel“, „Muskel“, „Knochen“, „unbekannt“
32.	`*_performed_status (ihc, fish, rna, dna)`: „durchgeführt“, „nicht durchgeführt“, „ausstehend“
33.	`exam_type`: z. B. „MRI“, „CT“, „PET-CT“, „Sonographie“, „Röntgen“, „nicht spezifiziert“
34.	`imaging_timing`: z. B. „prätherapeutisch“, „postoperativ“, „Verlaufskontrolle“, „Staging“, „Restaging“
35.	`imaging_type`: z. B. „CT“, „MRT“, „PET“, „Röntgen“, „Sonographie“
36.	`location_of_lesion`: Optional standardisierbare Orte wie „Lunge“, „Leber“, „Knochen“, „Weichteil“, „nicht beurteilbar“
37.	`*_response`: für recist_response, choi_response, irecist_response, pet_response – z. B. „CR“, „PR“, „SD“, „PD“, „nicht beurteilbar“, „nicht durchgeführt“

---

## Korrektheitslogik für `croms_diagnoses`

| Feld                               | Wertebereich / Validierungsmöglichkeiten         |
| ---------------------------------- | ------------------------------------------------ |
| `tumor_anatomic_region`            | Validierung über `anatomic_region`-Liste         |
| `tumor_anatomic_lesion_side`       | `"links"`, `"rechts"`, `"beidseitig"`, `"zentral"`, `"nicht beurteilbar"`  |
| `tumor_syndromes`                  | Nein, nur bei vorhandener, gepflegter Syndromliste |
| `tumor_diagnosis`                  | Nein, evtl. mit Liste aller Sarkom-Diagnosen                                         |
| `additional_tumor_anatomic_region` | Validierung wie bei `tumor_anatomic_region`     |
| `additional_tumor_lesion_side`     | `"links"`, `"rechts"`, `"beidseitig"`, `"zentral"`, `"nicht beurteilbar"` |
| `additional_tumor_diagnosis`       | Eingeschränkt prüfbar, da Freitext            |
| `other_diagnosis`                  | Nein, Freitextfeld                |
| `patient_history`                  | Nein, Freitextfeld     |
| `diagnosis_ecog`                   | Ja, nur Werte `[0, 1, 2, 3, 4]` zulässig         |
| `last_contact_date`                | Ja, muss: gültiges Datum sein, nicht in der Zukunft liegen, nach Geburtsdatum liegen |
| `last_status`                      | Ja, nur bestimmte Einträge erlaubt (s. o.)         |
| `death_reason`                     | Ja, nur bestimmte Einträge erlaubt (s. o.)          |

---

### Anmerkungen zu schwer prüfbaren Feldern

#### `tumor_anatomic_region` & `additional_tumor_anatomic_region`

* Es existieren sehr viele valide Varianten (z. B. „linker Oberschenkel“, „retroperitonealer Raum“)
* Auch Kombinationen und Detaillierungen sind möglich
* Die medizinische Ausdrucksweise ist flexibel – eine harte Validierung ist schwierig
  **Empfohlene Alternative:** Vollständigkeit prüfen

#### `tumor_syndromes`

* Nur mit gepflegter Referenzliste prüfbar
* Viele Syndrome, teils selten, international verschieden benannt
  Realistische Validierung ist begrenzt möglich

#### `tumor_diagnosis` & `additional_tumor_diagnosis`

* Diagnosen oft als Freitext mit hoher Variabilität
* Begriffe können aus mehreren Wörtern bestehen
* Strikte Prüfung ist kaum möglich, evtl. NLP oder Mapping-basierte Validierung denkbar

---

### **Korrektheitslogik für `SarcomaBoard`**

| Feld                                | Wertebereich / Validierungsmöglichkeiten                               | Liste |
| ----------------------------------- | ---------------------------------------------------------------------- | ----- |
| `presentation_date`                 | Gültiges Datum, darf nicht in der Zukunft liegen                       |       |
| `reason_for_presentation`           | Freitext, evtl. mit typischer Auswahl aus einer kontrollierten Liste   | 8     |
| `status_before_follow_up`           | Potenzielle `allowed`-Liste (z. B. "geplant", "operiert")              | 9     |
| `unplanned_excision_date`           | Sollte vor oder am `presentation_date` liegen                          |       |
| `whoops_surgery_institution_name`   | Kliniknamen schwer standardisierbar                                    |       |
| `status_after_follow_up`            | Potenzielle `allowed`-Liste                                            | 9     |
| `treatment_before_follow_up`        | Auswahl wie "keine", "Systemtherapie" etc.                             | 10    |
| `follow_up_reason`                  | Freitext, ggf. strukturierbar                                          |       |
| `question`                          | Freitext                                                               |       |
| `last_execution`                    | Formatierung unklar – evtl. kontrollierbare Begriffe wie "vor OP" etc. |       |
| `proposed_procedure`                | Freitext                                                               |       |
| `current_ecog`                      | Nur Werte aus `[0, 1, 2, 3, 4]` erlaubt                                | 5     |
| `decision_surgery`                  | `"ja"`, `"nein"`, `"noch offen"`                                       | 11    |
| `decision_surgery_comment`          | Freitext                                                               |       |
| `decision_radio_therapy`            | `"ja"`, `"nein"`, `"noch offen"`                                       | 11    |
| `decision_radio_therapy_comment`    | Freitext                                                               |       |
| `decision_systemic_surgery`         | `"ja"`, `"nein"`, `"noch offen"`                                       | 11    |
| `decision_systemic_surgery_comment` | Freitext                                                               |       |
| `decision_follow_up`                | Freitext                                                               |       |
| `decision_follow_up_comment`        | Freitext                                                               |       |
| `decision_diagnostics`              | Freitext                                                               |       |
| `decision_diagnostics_comment`      | Freitext                                                               |       |
| `decision_palliative_care`          | Freitext                                                               |       |
| `decision_palliative_care_comment`  | Freitext                                                               |       |
| `summary`                           | Freitext                                                               |       |
| `further_details`                   | Freitext                                                               |       |
| `fast_track`                        | Nur `true` oder `false`                                                | 12    |

---

### **Anmerkungen zu schwer prüfbaren Feldern**

* Viele Felder enthalten **Freitext**, was eine **strukturierte Validierung einschränkt**.
* Entscheidungsfelder wie `decision_*` eignen sich gut für **„allowed“-Listen**.
* Für **Statusfelder** wie `status_before_follow_up` kann eine kontrollierte Liste gepflegt werden.
* **Datumfelder** sollten ggf. **im Kontext anderer Felder validiert werden**, z. B.:

  * `unplanned_excision_date` < `presentation_date`
  * `presentation_date` nicht in der Zukunft

---

### **Korrektheitslogik für `hyperthermia`**

| Feld                        | Wertebereich / Validierungsmöglichkeiten                       | Liste |
| --------------------------- | -------------------------------------------------------------- | ----- |
| `indication`                | Freitext, optional typische Auswahlwerte                       | 13    |
| `start_date`                | Gültiges Datum, < `end_date`, nicht in der Zukunft             |       |
| `end_date`                  | Gültiges Datum, ≥ `start_date`, nicht in der Zukunft           |       |
| `hyperthermia_type`         | Nur gültige Typen erlaubt (z. B. „lokoregionär“, „Ganzkörper“) | 14    |
| `therapy_sessions_count`    | Ganzzahlig ≥ 1 (optionaler Maximalwert, z. B. ≤ 50)            |       |
| `schedule`                  | Liste möglicher Therapieschemata (z. B. „3×/Woche“)            | 15    |
| `board_accepted_indication` | Nur `true` oder `false`                                        | 12    |
| `comment`                   | Freitext                                                       |       |
| `therapy_type`              | Klassifizierbar, z. B. „adjuvant“, „neoadjuvant“, „palliativ“  | 16    |
| `therapy_id`                | Interner Fremdschlüssel – keine inhaltliche Validierung nötig  |       |

---

### **Anmerkungen zu schwer prüfbaren Feldern**

* Datumspaare (`start_date` / `end_date`) sollten im zeitlichen Verhältnis plausibel sein.
* `therapy_sessions_count` sollte positiv sein, sinnvoller Maximalwert möglich (z. B. 30–50 Sitzungen).
* Freitextfelder wie `indication` und `comment` lassen sich nur eingeschränkt prüfen – eine Liste häufiger Einträge kann helfen.
* Typ-Felder wie `hyperthermia_type`, `schedule` und `therapy_type` eignen sich gut für kontrollierte `allowed`-Listen.
* Das Boolean-Feld `board_accepted_indication` ist klar validierbar.

---

## **Korrektheitslogik für SystemicTherapy**

| Feld                       | Validierung                                      | Liste |
| -------------------------- | ------------------------------------------------ | ----- |
| `reason`                   | Standardisierte Auswahl aus kontrollierter Liste | 17    |
| `treatment_line`           | Ganzzahl ≥ 1                                     | –     |
| `cycles_planned`           | Freitext, falls möglich standardisieren          | –     |
| `bone_protocol`            | Strukturierter Name eines Protokolls             | 18    |
| `softtissue_protocol`      | Strukturierter Name eines Protokolls             | 18    |
| `institution_name`         | Freitext, keine Listenvalidierung möglich        | –     |
| `cycle_start_date`         | Gültiges Datum, nicht in der Zukunft             | –     |
| `cycle_end_date`           | Gültiges Datum, ≥ `cycle_start_date`             | –     |
| `discontinuation_reason`   | Standardisierte Gründe für Abbruch               | 19    |
| `was_rct_concomittant`     | Nur true oder false                              | 12    |
| `comments`                 | Freitext                                         | –     |
| `clinical_trial_inclusion` | Strukturierte Studienzugehörigkeit               | 20    |
| `hyperthermia_status`      | Standardisierte Optionen                         | 21    |

---

## **Anmerkungen zu schwer prüfbaren Feldern**

* `comments`, `cycles_planned` und `institution_name` sind **Freitextfelder** – hier nur eingeschränkte Validierung möglich.
* Für Felder wie `reason`, `discontinuation_reason`, `hyperthermia_status` ist eine **kontrollierte Auswahl sinnvoll** (Allowed-Listen).
* Datumspaare wie `cycle_start_date` und `cycle_end_date` sollten in **zeitlich plausibler Reihenfolge** vorliegen.

---

### **Korrektheitslogik für `RadiologyTherapy`**

| Feldname              | Wertebereich / Validierungsmöglichkeiten          | Liste |
| --------------------- | ------------------------------------------------- | ----- |
| `indication`          | Freitext, optional standardisierbar               | 22    |
| `therapy_type`        | Freitext, aber idealerweise standardisiert        | 23    |
| `referral_date`       | Gültiges Datum, nicht in der Zukunft              | –     |
| `first_contact_date`  | Gültiges Datum, nicht in der Zukunft              | –     |
| `therapy_start_date`  | Gültiges Datum, nach `first_contact_date`         | –     |
| `therapy_end_date`    | Gültiges Datum, ≥ `therapy_start_date`            | –     |
| `institution_name`    | Freitext, keine Listenvalidierung                 | –     |
| `total_dose_in_gy`    | Float > 0 (z. B. 10–80 Gy), medizinisch plausibel | –     |
| `given_fractions`     | Ganzzahl > 0 (z. B. 1–40), realistisch            | –     |
| `ptv_volume_in_cm3`   | Float ≥ 0 (z. B. 0–3000 cm³)                      | –     |
| `gtv_volume_in_cm3`   | Float ≥ 0 (z. B. 0–3000 cm³)                      | –     |
| `was_tumor_located_in_radiated_area`    | Nur `true` oder `false`         | 12    |
| `was_tumor_located_with_pre_existing_lymph_edema` | Nur `true` oder `false`    | 12    |
| `comments`            | Freitext                                          | –     |
| `hyperthermia_status` | Nur erlaubte Werte                                | 21    |

---

### **Anmerkungen zu schwer prüfbaren Feldern**

* Felder wie `comments`, `institution_name` und `indication` bleiben Freitext oder semi-strukturiert. Eine Vorschlagsliste häufig genutzter Einträge kann optional unterstützen.
* Zahlenwerte wie `total_dose_in_gy`, `given_fractions`, `ptv_volume_in_cm3` und `gtv_volume_in_cm3` sollten medizinisch plausible Grenzwerte einhalten (z. B. keine negativen Werte, keine Extremwerte > 3000 cm³).

---

### **Korrektheitslogik für `Surgery`**
| Feld                             | Wertebereich / Validierungsmöglichkeiten      | Liste  |
| -------------------------------- | --------------------------------------------- | ------ |
| `surgery_date`                   | Gültiges Datum, nicht in der Zukunft          | -      |
| `institution_name`               | Freitext                                      | -      |
| `indication`                     | Freitext                                      | –      |
| `surgery_side`                   | Auswahl aus erlaubten Seitenangaben           | 2      |
| `greatest_surgical_tumor_dimension_in_mm` | Ganzzahl ≥ 0 (z. B. 1–300 mm)        | –      |
| `had_tumor_spillage`             | Nur `true` oder `false`                       | 12     |
| `anatomic_region`                | Auswahl gültiger Regionen                     | 1      |
| `resection`                      | z. B. „R0“, „R1“, „R2                         | 24     |
| `hemipelvectomy`                 | Freitext oder strukturierte Auswahl           | –      |
| `reconstruction`                 | Freitext oder standardisierbar                | –      |
| `amputation` | z. B. „keine“, „Oberschenkel“, „Unterschenkel“, „Hemipelviktomie“ | 1      |
| `resected_tumor_margin`          | z. B. „R0“, „R1“, „R2“                        | 24     |
| `first_revision_details`         | Freitext                                      | –      |
| `second_revision_details`        | Freitext                                      | –      |
| `participated_disciplines`       | Liste gültiger Disziplinen                    | 25     |


---
### **Anmerkungen zu schwer prüfbaren Feldern**

* `resection` und `resected_tumor_margin` sollten auf die R-Klassifikation (R0–R2) eingeschränkt sein.
* Die Tumorgrösse (`greatest_surgical_tumor_dimension_in_mm`) sollte medizinisch plausible Werte enthalten (1–300 mm).
* Arrays wie `participated_disciplines` und `hemipelvectomy` sollten, wenn möglich, auf erlaubte Werte eingeschränkt werden, z. B. über Dropdown-Auswahl im UI.

---

### **Korrektheitslogik für `Pathology`**

| Feld                                   | Wertebereich / Validierungsmöglichkeiten           | Liste |
| -------------------------------------- | -------------------------------------------------- | ----- |
| `data_entry_type`                      | Muss entweder „Biopsie“ oder „Resektion“ sein      | 26    |
| `biopsy_resection_date`                | Gültiges Datum, nicht in der Zukunft               | –     |
| `registrate_date`                      | Gültiges Datum, chronologisch vor `report_date`    | –     |
| `first_report_date`                    | Gültiges Datum                                     | –     |
| `final_report_date`                    | Gültiges Datum, ≥ `first_report_date`              | –     |
| `prior_pathology`                      | Freitext, optional strukturierbar                  | –     |
| `who_diagnosis`                        | Freitext oder ICD-O-Code                           | –     |
| `diagnostic_grading`                   | z. B. „G1“, „G2“, „G3“, „low grade“, „high grade“  | 27    |
| `judgment_of_surgical_margin`          | z. B. „R0“, „R1“, „R2“, „nicht beurteilbar“        | 28    |
| `proliferation_index`                  | Prozentangabe oder Kategorie                       | 30    |
| `mitoses_per_10hpf`                    | Zahl oder Kategorie wie „<10“, „>20“               | 30    |
| `extent_of_necrosis`                   | Prozent oder Kategorie                             | 29    |
| `closest_distance_to_margin_mm`        | Zahl ≥ 0 (in mm), z. B. 0–50                       | –     |
| `biological_barrier_to_closest_margin` | z. B. „Faszie“, „Kapsel“, „Muskel“, „Knochen“      | 31    |
| `ihc_performed_status`                 | „durchgeführt“, „nicht durchgeführt“, „ausstehend“ | 32    |
| `fish_performed_status`                | siehe oben                                         | 32    |
| `rna_performed_status`                 | siehe oben                                         | 32    |
| `dna_performed_status`                 | siehe oben                                         | 32    |
| `ihc_result`                           | Freitext oder strukturierte Marker-Befunde         | 33    |
| `fish_result`                          | siehe oben                                         | 33    |
| `rna_result`                           | siehe oben                                         | 33    |
| `dna_result`                           | siehe oben                                         | 33    |

---

### **Anmerkungen zu schwer prüfbaren Feldern**

* `who_diagnosis` kann zwar als Freitext eingetragen sein, sollte aber möglichst auf ICD-O-3 basieren.
* Die Ergebnisse von IHC, FISH, RNA und DNA können sehr variabel sein – strukturierte Auswertung ist ideal, aber schwierig automatisiert zu validieren.
* Für `closest_distance_to_margin_mm` sollte ein medizinisch realistischer Wertebereich gelten, z. B. 0–50 mm.
* Der Eintragstyp (`data_entry_type`) ist wichtig für die Einordnung der Daten und muss korrekt gepflegt werden.

---

### **Validierungslogik für `croms_radiology_exams`**

| **Feld**                     | **Wertebereich / Validierungsmöglichkeiten**          | **Liste** |
| ---------------------------- | ----------------------------------------------------- | --------- |
| `exam_date`                  | Gültiges Datum, nicht in der Zukunft                  | –         |
| `exam_type`                  | Auswahl aus typischen radiologischen Untersuchungen   | 33        |
| `imaging_timing`             | Eingeschränkte Auswahl, ggf. standardisierbar         | 34        |
| `imaging_type`               | Pflichtfeld; valide Bildgebungsverfahren              | 35        |
| `largest_lesion_size_in_mm`  | Ganzzahl ≥ 0, typischer Bereich z. B. 1–300           | –         |
| `medium_lesion_size_in_mm`   | Ganzzahl ≥ 0, typischer Bereich z. B. 1–300           | –         |
| `smallest_lesion_size_in_mm` | Ganzzahl ≥ 0, typischer Bereich z. B. 1–300           | –         |
| `location_of_lesion`         | Standardisierbare Lokalisationen                      | 36        |
| `recist_response`            | Auswahl aus RECIST-Kategorien                         | 37        |
| `choi_response`              | Analog zu `recist_response`                           | 37        |
| `irecist_response`           | Analog zu `recist_response`                           | 37        |
| `pet_response`               | Analog zu `recist_response`                           | 37        |
| `metastasis_presence`        | `true`, `false` oder `NULL` (falls nicht beurteilbar) | 12        |

---

### **Anmerkungen zu schwer prüfbaren Feldern**

* `exam_type` und `imaging_type` sind inhaltlich oft redundant. Eine Vereinheitlichung ist empfehlenswert.
* **Lesionsgrössen** sollten in einem medizinisch realistischen Bereich liegen – z.B. 1–300 mm. Extremwerte (< 1 oder > 500 mm) sollten gekennzeichnet oder ausgeschlossen werden.
* Die `*_response`-Felder sollten idealerweise auf **standardisierte Bewertungssysteme** (z. B. RECIST) gemappt werden, um Vergleichbarkeit zu gewährleisten.
