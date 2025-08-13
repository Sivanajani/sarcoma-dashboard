## Übersicht: Alle unterstützten Alert-Regeltypen

| Regel-Typ        | `condition`                  | Beschreibung                                     | Beispiel (`field`, `value`)                              | Typischer Anwendungsfall    |
| ---------------- | ---------------------------- | ------------------------------------------------ | -------------------------------------------------------- | --------------------------- |
| Metrik-Vergleich | `<`, `<=`, `>`, `>=`, `==`   | Vergleich mit einem aggregierten KPI oder `flag` | `metric = "flag"`, `condition = "=="`, `threshold = 2`   | Wenn Flag = red             |
| Feld fehlt       | `missing`, `is_null`, `null` | Das Feld ist leer oder fehlt                     | `field = "tumor_diagnosis"`, `condition = "missing"`     | Pflichtfeldprüfung          |
| Zahlen-Vergleich | `<`, `<=`, `>`, `>=`, `==`   | Zahlenwert vergleichen                           | `field = "tumor_size"`, `value = 100`, `condition = "<"` | Tumorgröße unter 100 mm     |
| Gleich           | `==`                         | Exakter Vergleich (auch Strings)                 | `field = "surgery_side"`, `value = "left"`               | Seite der OP ist links      |
| Ungleich         | `!=`                         | Exakter Vergleich ≠                              | `field = "resection"`, `value = "r0"`                    | Wenn NICHT r0               |
| Enthält          | `contains`                   | Substring enthalten                              | `field = "indication"`, `value = "sarcoma"`              | Indikation enthält sarcoma  |
| Beginnt mit      | `starts_with`                | Feld beginnt mit Text                            | `field = "tumor_diagnosis"`, `value = "GIST"`            | Diagnose beginnt mit „GIST“ |
| Endet mit        | `ends_with`                  | Feld endet mit Text                              | `field = "resection"`, `value = "1"`                     | Resection endet mit „1“     |

---

## Details zur Umsetzung in der DB:

### Metrik-Alert:

```sql
INSERT INTO alerts (metric, condition, threshold, module, email, source, active)
VALUES ('flag', '==', 2, 'croms_surgeries', 'you@example.com', 'croms', true);
```

### Feld fehlt:

```sql
INSERT INTO alerts (field, condition, module, email, source, active)
VALUES ('tumor_diagnosis', 'missing', 'croms_diagnoses', 'you@example.com', 'croms', true);
```

### Zahlenwert unter 100:

```sql
INSERT INTO alerts (field, value, condition, module, email, source, active)
VALUES ('greatest_surgical_tumor_dimension_in_mm', '100', '<', 'croms_surgeries', 'you@example.com', 'croms', true);
```

### Textvergleiche:

```sql
-- surgery_side == left
('surgery_side', 'left', '==', ...)

-- indication contains sarcoma
('indication', 'sarcoma', 'contains', ...)

-- resection != r0
('resection', 'r0', '!=', ...)
```

---

##  Bonus: Condition-Liste für dein Alert-Formular (Dropdown-Vorschlag)

```json
[
  "==",
  "!=",
  "<",
  "<=",
  ">",
  ">=",
  "contains",
  "starts_with",
  "ends_with",
  "missing"
]
```


---

## Alert-Regeln laut `alert.py`

### **Allgemeine Felder pro Alert**

Diese Felder brauchst du auf jeden Fall im Formular:

* `patient_external_code` (z. B. "123456")
* `email` (für Benachrichtigung)
* `source` → `"croms"` oder `"proms"`
* `module` → z. B. `"croms_diagnoses"` oder `"proms_eq5d"`
* `active` (true/false)
* `message` (optional)
* mindestens **eine der folgenden:**

---

### **Typ 1: Metrik-Check**

**Funktioniert mit `metric` und optional `threshold`, `condition`.**

Zwei Varianten:

1. `metric = "summary_flag"` (für Gesamtauswertung)
2. `metric = "flag"` (z. B. im Modul `diagnoses`)
3. `metric = irgendwas_andres` (z. B. `completeness`, `actuality_score`, `recist_response` etc.)

**Conditions erlaubt:**

* `==`, `!=`, `<`, `<=`, `>`, `>=`

---

### **Typ 2: Feld fehlt (missing)**

**Funktioniert mit `field` und `condition = "missing"` (oder `"null"`, `"is_null"`)**

→ typischer Use Case für Pflichtfeld fehlt (z. B. `biopsy_date` in `pathology`)

---

### **Typ 3: Feldvergleich (Zahl oder Text)**

**Funktioniert mit `field`, `condition` und `value`**

**Erlaubte `condition`:**

* `==`, `!=`, `contains`, `starts_with`, `ends_with`, `<`, `<=`, `>`, `>=`

---

## Zusammenfassung für Frontend-Formular

Das Alert-Erstellungsformular soll folgendes unterstützen:

| Feld                        | Typ                              | Beschreibung                                 |
| --------------------------- | -------------------------------- | -------------------------------------------- |
| Patient (ID)                | Textfeld                         | `patient_external_code`                      |
| Modul                       | Dropdown (abhängig von `source`) | z. B. `croms_diagnoses`, `proms_eq5d`        |
| Source                      | Dropdown: `"croms"` / `"proms"`  | wird gebraucht zum Unterscheiden             |
| Metrik                      | Optionaler Dropdown              | `summary_flag`, `flag`, `completeness`, etc. |
| Schwellenwert (`threshold`) | Optional (Zahl)                  | z. B. `2` bei `flag`                         |
| Vergleich (`condition`)     | Dropdown                         | z. B. `<`, `==`, `missing`, etc.             |
| Feldname (`field`)          | Optional                         | z. B. `biopsy_date`, `recist_response`       |
| Vergleichswert (`value`)    | Optional                         | z. B. `"PD"` oder `10`                       |
| Nachricht                   | Textfeld                         | was per Mail verschickt wird                 |
| Ziel-Email                  | Textfeld                         |                                              |
| Aktiviert                   | Checkbox                         | Default: true                                |
