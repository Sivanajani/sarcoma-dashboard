## 🧾 📬 Fragen zur Datenbankstruktur (für Rücksprache mit dem/der DB-Verantwortlichen)

### 🔹 1. **Mehrfacheinträge pro Patient\:in**

> *„Können klinische Module wie `RadiologyExam`, `Surgery`, `Pathology` etc. mehrere Einträge pro Patient\:in enthalten, also z. B. mehrere zeitlich getrennte Untersuchungen oder Behandlungen?“*

✅ Ziel: Sicherstellen, ob Arrays gebraucht werden

---

### 🔹 2. **Pflicht- vs. optionale Module**

> *„Gibt es Module, die **immer vorhanden sein müssen** (z. B. Diagnosis, Tumor, SarcomaBoard), und andere, die nur bei bestimmten klinischen Verläufen benötigt werden (z. B. Surgery oder SystemicTherapy)? Wenn ja, welche gehören zu welcher Gruppe?“*

✅ Ziel: Klären, was zur Grundversorgung gehört

---

### 🔹 3. **Regeln für kontextabhängige Vollständigkeit**

> *„Gibt es medizinisch-logische Abhängigkeiten, z. B.: Wenn `decision_surgery = true` im SarcomaBoard, muss ein Surgery-Eintrag folgen? Oder wenn RadiologyExam einen Progress zeigt, sollte dann immer eine SystemicTherapy eingeleitet werden?“*

✅ Ziel: Red Flag Detection vorbereiten

---

### 🔹 4. **Datenschutz & Verschlüsselung**

> *„Welche Felder genau gelten als sensitiv und müssen verschlüsselt werden? Reicht es, nur die Patiententabelle zu anonymisieren, wenn alle anderen Tabellen nur indirekt (über `patient_id`) zuordenbar sind?“*

✅ Ziel: Klare Grenze für PII-Schutz

---

### 🔹 5. **Einheitlichkeit & Validität**

> *„Welche Felder müssen auf jeden Fall einheitlich befüllt sein (z. B. Enums wie `r_status`, `toxicity_grade`)? Gibt es erlaubte Werte-Listen (Codebooks), die wir validieren sollten?“*

✅ Ziel: Qualität der Daten validieren

---

### 🔹 6. **PROMs und Fragebögen**

> *„Werden PROMs (Patient Reported Outcome Measures) separat gespeichert, z. B. als eigene Entität? Wenn ja, sind sie direkt mit `patient_id` verknüpft und können über das Dashboard ausgewertet werden?“*

✅ Ziel: PROM-Datenzugang verstehen

---

### 🔹 7. **Zeitorientierung der Daten**

> *„Sollen klinische Daten (z. B. Radiology, Surgery) chronologisch abbildbar sein? Gibt es z. B. eine Zeitachse, die im Dashboard berücksichtigt werden soll (z. B. Verlauf über Monate/Jahre)?“*

✅ Ziel: Später für Timeline oder Verlauf

---

### 🔹 8. **SarcomaBoard-Rolle im Ablauf**

> *„Ist das SarcomaBoard der zentrale Einstiegspunkt für den klinischen Ablauf? Werden dort Entscheidungen protokolliert, die später verpflichtend umgesetzt werden sollten (z. B. Entscheidung für Operation)?“*

✅ Ziel: SarcomaBoard als zentrale Steuerstelle verstehen