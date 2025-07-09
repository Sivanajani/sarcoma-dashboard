# Aktualitätslogik

Aktualität beschreibt, wie gut die vorliegenden Daten den gegenwärtigen Zustand einer Patientin oder eines Patienten widerspiegeln. Bei PROM-Daten (Patient-Reported Outcome Measures) ist dies besonders wichtig, da sie den subjektiven Gesundheitszustand zu einem bestimmten Zeitpunkt erfassen sollen. Veraltete oder verspätet erfasste Daten können zu Fehleinschätzungen des Krankheitsverlaufs führen. Ein älteres Datum ist nicht automatisch ein Qualitätsproblem. Entscheidend ist, ob das Datum dem vorgesehenen Erhebungszeitpunkt entspricht – etwa bei Fragebögen, die in regelmässigen Intervallen ausgefüllt werden sollen (z. B. alle 3 oder 6 Monate). Liegt kein aktueller Eintrag vor, obwohl er erwartet wurde, spricht man von mangelnder Aktualität.

---

## Aktualitätslogik für das Modul `Diagnosis`

| **Feld**            | **Beschreibung**                              | **Bewertungsregeln**                                                                                                                  |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `last_contact_date` | Datum des letzten bekannten Patientenkontakts | • Wenn kein Datum vorhanden ist → Diagnosemodul gilt als **nicht aktuell**. <br> • Wenn das Datum **in der Zukunft liegt** → **nicht gültig** und **nicht aktuell**. <br> • Wenn das Datum **älter als 365 Tage** ist → **nicht aktuell**. <br> • Wenn das Datum **innerhalb der letzten 365 Tage** liegt → Modul ist **aktuell**. |
| `last_status`       | Letzter bekannter klinischer Status           | Wird für die Aktualität **nicht direkt bewertet**, kann aber ergänzend zur Beurteilung des Verlaufs herangezogen werden.              |
| `death_reason`      | Grund für Tod (nur relevant bei Verstorbenen) | Wird bei **verstorbenen Patient\:innen** ergänzend berücksichtigt, aber **nicht für die Aktualitätsbewertung** verwendet.             |

---

## Aktualitätslogik für SarcomaBoard

| **Feld**                  | **Beschreibung**                                    | **Bewertungsregeln**                                                                                                              |
| ------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `presentation_date`       | Datum der letzten Vorstellung im Tumorboard         | • Wenn kein Datum vorhanden ist → Modul gilt als **nicht aktuell**. <br> • Wenn das Datum in der **Zukunft liegt** → **nicht gültig** und **nicht aktuell**. <br> • Wenn das Datum **älter als 180 Tage** ist → **nicht aktuell**. <br> • Wenn das Datum **innerhalb der letzten 180 Tage** liegt → Modul ist **aktuell**. |
| `unplanned_excision_date` | Datum einer unklaren OP vor Tumorboard-Präsentation | Wird für die Aktualität **nicht direkt bewertet**, aber kann für Konsistenz-Checks verwendet werden (z. B. OP vor Board). |
| `last_execution`          | Unklarer Kontext (z. B. „nach OP“)                  | Wird **nicht für die Aktualitätsbewertung** verwendet.                                                        |

---




