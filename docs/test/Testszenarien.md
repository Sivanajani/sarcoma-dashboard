### Testszenarien radiologytherapy/Aktualitlt gut/geprüft:

| Fall | `therapy_end_date`   | `updated_at` | Erwartung                     |
| ---- | -------------------- | ------------ | ----------------------------- |
| 1    | 2024-03-10           | 2024-12-01   | nicht aktuell (abgeschlossen) |
| 2    | —                    | 2025-06-01   | aktuell (innerhalb 365 Tage)  |
| 3    | —                    | 2023-05-01   | nicht aktuell                 |
| 4    | 2026-01-01 (Zukunft) | 2025-06-01   | aktuell (noch laufend)        |

---

**Testfälle `surgery_actuality`-Logik (bereits getestet):**

| ID   | `surgery_date`       | `updated_at` | Erwartung                                   |
| ---- | -------------------- | ------------ | ------------------------------------------- |
| 5    | 2026-07-02 (Zukunft) | 2025-07-08   | aktuell (geplant, update < 365 Tage)        |
| 12   | 2026-07-02 (Zukunft) | 2023-07-01   | nicht aktuell (geplant, update zu alt)      |
| 19   | 2025-04-01           | 2025-01-01   | nicht aktuell (concluded, update davor)     |
| 3    | 2025-04-01           | 2025-04-10   | aktuell (concluded, update danach)          |
| 8    | 2024-04-01           | 2024-04-05   | aktuell (concluded, update danach)          |
| 33   | 2024-04-01           | 2023-04-01   | nicht aktuell (concluded, update davor)     |

---

**Testfälle `patholgoy`-Logik (bereits getestet):**

| ID   | `final_report_date` | `updated_at`     | Erwartung                             | 
|------|---------------------|------------------|-------------------------------------------------------------------------------------|
| 15   | 2025-07-02          | 2025-07-05       | 100% Bericht abgeschlossen und danach aktualisiert |
| 26   | 2025-07-02          | 2024-07-05       | 0% `updated_at` liegt vor Abschlussdatum |
| 36   | 2023-07-02          | 2024-07-05       | 100% Bericht abgeschlossen und danach aktualisiert  |
| 40   | 2025-08-01 (Zukunft)| 2025-06-30       | 100% Abschlussdatum liegt in der Zukunft, `updated_at` ok    |
| 19   | 2025-08-01 (Zukunft)| 2023-06-01       | 0% `updated_at` zu alt für geplanten Bericht               |

---

### Testfälle für `radiology_exam_actuality`

| Fall | `exam_date` | `updated_at`| Erwartung (Score) | Begründung                                                          |
| ---- | ----------- | ----------- | ----------------- | ------------------------------------------------------------------- |
| 22   | 2024-06-01  | 2024-06-05  | 100 %             | Abgeschlossen, Update nach `exam_date` und aktuell                  |
| 19   | 2024-06-01  | 2024-05-01  | 0 %               | Abgeschlossen, aber Update **vor** `exam_date`                      |
| 12   | 2026-08-01  | 2025-09-01  | 100 %             | Untersuchung in Zukunft, aber kürzlich aktualisiert                 |
| 40   | 2026-08-01  | 2023-08-01  | 0 %               | Zukünftige Untersuchung, aber Update zu alt (>365 Tage)             |
| 26   | 2025-04-01  | 2025-04-01  | 100 %             | Genau gleiches Datum → gültig und aktuell                           |
