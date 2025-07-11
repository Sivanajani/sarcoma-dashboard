# Uniqueness-Logik für alle Module

| Modul            | Feldkombination für Uniqueness                                          |
| ---------------- | ----------------------------------------------------------------------- |
| Diagnosis        | `patient_id`, `tumor_diagnosis`                                         |
| Surgery          | `patient_id`, `surgery_date`, `anatomic_region`                         |
| Pathology        | `patient_id`, `data_entry_type`, `biopsy_resection_date`                |
| RadiologyExam    | `patient_id`, `exam_date`, `imaging_type`                               |
| RadiologyTherapy | `patient_id`, `therapy_start_date`, `therapy_type`                      |
| SarcomaBoard     | `patient_id`, `presentation_date`                                       |
| SystemicTherapy  | `patient_id`, `cycle_start_date`, `treatment_line`                      |
| Hyperthermia     | `patient_id`, `start_date`, `hyperthermia_type`    |

