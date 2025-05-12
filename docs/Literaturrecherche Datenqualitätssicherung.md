# Literaturrecherche: Datenqualitätssicherung in der Sarkomversorgung am KSL

## 1. Einleitung
In der Sarkomversorgung am Kantonsspital Luzern (LUKS) werden regelmässig patientenbezogene Rückmeldungen zum Gesundheitszustand in Form von PROMs (Patient-Reported Outcome Measures) erfasst. Diese standardisierten Befragungen liefern Einblicke in den Therapieverlauf und die wahrgenommene Versorgungsqualität. Damit diese Daten eine belastbare Grundlage für klinische Entscheidungen und wissenschaftliche Auswertungen bilden, ist eine kontinuierliche Überwachung ihrer Qualität unerlässlich. Zu diesem Zweck entsteht ein webbasiertes Dashboard, das Auffälligkeiten wie fehlende Angaben, Widersprüche oder veraltete Einträge automatisiert identifiziert und visuell aufbereitet.

## 2. Definition und Bedeutung von Datenqualität

In der klinischen Forschung ist die Qualität der erhobenen Daten von zentraler Bedeutung. Nur wenn Daten zuverlässig, konsistent und vollständig sind, lassen sich daraus valide Erkenntnisse ableiten und patientenorientierte Entscheidungen treffen. Datenqualität beschreibt in diesem Zusammenhang, wie gut Daten für ihren jeweiligen Analyse- oder Entscheidungszweck geeignet sind (Wang & Strong, 1996; Pipino et al., 2002).

Besonders in sensiblen Bereichen wie der Sarkomversorgung müssen Daten den höchsten Ansprüchen genügen. Um dies sicherzustellen, werden bestimmte Qualitätsdimensionen herangezogen, um den Datensatz strukturiert zu bewerten (Azeroual, 2022; Batini et al., 2009):

- Vollständigkeit: Alle erforderlichen Informationen sind vorhanden.  
- Korrektheit: Die Daten entsprechen der Realität.  
- Konsistenz: Daten widersprechen sich nicht.   
- Aktualität: Die Daten sind zeitlich relevant.  
- Eindeutigkeit: Jede Information ist eindeutig zuordenbar.

Diese Merkmale dienen als Grundlage für technische Prüfungen und visualisierte Qualitätsanalysen – beispielsweise im Rahmen eines Dashboards zur Echtzeitüberwachung (Azeroual, 2022).

### 2.1 Begriffsverständnis: Was ist Datenqualität?
Datenqualität ist mehr als die Abwesenheit von Fehlern – sie umfasst alle Eigenschaften, die darüber entscheiden, ob Daten für ihren konkreten Zweck geeignet sind. In der wissenschaftlichen Literatur spricht man deshalb auch von der Zweckmässigkeit von Daten („fitness for use“) (Wang & Strong, 1996).

Zur Bewertung der Datenqualität werden standardisierte Indikatoren verwendet, die qualitative und quantitative Schwachstellen sichtbar machen. Diese sogenannten Datenqualitätsdimensionen sind ein zentraler Bestandteil datengetriebener Qualitätskontrollen und helfen dabei, gezielte Massnahmen zur Verbesserung abzuleiten (Pipino et al., 2002; Batini et al., 2009).

## 3. Dimensionen und Indikatoren der Datenqualität

### 3.1 Begriff und Funktion von Datenqualitätsdimensionen

Datenqualität ist kein statischer Zustand, sondern ein vielschichtiges Konzept, das je nach Nutzungskontext unterschiedliche Anforderungen stellt. In der klinischen Versorgung und insbesondere in PROM-basierten Datensystemen, wie sie im Kantonsspital Luzern (KSL) im Rahmen der Sarkomversorgung eingesetzt werden, steht die Verlässlichkeit der patientenberichteten Angaben im Mittelpunkt (Azeroual 2022).

Um Datenqualität systematisch zu bewerten und automatisiert zu überwachen, werden in der Literatur sogenannte Datenqualitätsdimensionen herangezogen. Diese Dimensionen erlauben eine differenzierte Analyse von Schwachstellen – etwa fehlende Antworten, Widersprüche oder unplausible Werte – und bilden damit die Grundlage für ein technisches Monitoring im geplanten Dashboard (Pipino et al., 2002; Azeroual 2022).

Ein bewährtes Referenzmodell liefert Wang und Strong (1996), die Datenqualität im Sinne der „Fitness for Use“ definieren – also bezogen auf die Eignung für den konkreten Analyse- oder Entscheidungszweck. Diese Idee wurde in Folgearbeiten, etwa von Pipino et al. (2002), Batini et al. (2009) und Azeroual (2022), weiterentwickelt. Sie betonen, dass objektive Indikatoren (wie der Anteil fehlender Felder) und subjektive Aspekte (wie Verständlichkeit) gemeinsam betrachtet werden müssen, um ein realistisches Bild der Datenlage zu erhalten.

Gerade in der PROM-Erfassung, bei der Patient:innen standardisierte Fragebögen beantworten, ist eine strukturierte Qualitätsbewertung essenziell – etwa um zu prüfen, ob relevante Felder ausgefüllt, logisch konsistent und aktuell sind. Für das KSL-Dashboard werden diese Dimensionen in konkrete technische Prüfregeln übersetzt und visuell dargestellt.

Auch im Buch von **Azeroual (2022)** wird betont, dass der Begriff „Datenqualität“ häufig in enger Verbindung mit „Informationsqualität“ verwendet wird. Dabei wird unterstrichen, dass **qualitativ hochwertige Daten als Voraussetzung für valide Information und Entscheidungsfindung** gelten. Azeroual verweist zudem darauf, dass sich Datenqualitätsdimensionen auch als **Indikatoren für das Datenmanagement** eignen, insbesondere in institutionellen Kontexten mit verteilten Datenquellen und heterogenen Anforderungen.

### 3.2 Auswahl geeigneter Qualitätsdimensionen für PROM-Daten  

Die Auswahl der zu überwachenden Dimensionen erfolgt praxisnah, basierend auf der Literatur und auf typischen Herausforderungen in PROM-Daten. Die folgenden sechs Dimensionen haben sich als besonders relevant und automatisierbar erwiesen:

- Vollständigkeit: Sind alle notwendigen Fragen beantwortet?   
- Korrektheit: Entsprechen vorhandene Angaben realen Bedingungen?   
- Konsistenz: Gibt es logische Widersprüche innerhalb eines Fragebogens?   
- Aktualität: Wurde der Fragebogen im vorgesehenen Zeitraum ausgefüllt?  
- Eindeutigkeit: Ist jeder Fall im System nur einmal vorhanden?  
- Plausibilität: Sind die Antworten fachlich-medizinisch glaubwürdig?  

Diese Dimensionen werden in den folgenden Abschnitten jeweils definiert, mit konkreten PROM-Beispielen illustriert und durch mögliche Metriken ergänzt, die im Dashboard eingesetzt werden können.

#### 3.2.1 Vollständigkeit

**Definition:**  
Vollständigkeit beschreibt den Grad, zu dem alle erwarteten Informationen in einem Datensatz vorhanden sind. Im Kontext von PROMs (patientenberichteten Ergebnisdaten) bedeutet dies insbesondere, dass Patient:innen alle vorgesehenen Fragen vollständig beantwortet haben. Dabei wird zwischen Feldebene (z.B. einzelne Antwortfelder) und Fragebogenebene (z.B. vollständig ausgefüllter Fragebogen) unterschieden. Laut Wang & Strong (1996) ist Vollständigkeit eine der wichtigsten objektiven Dimensionen der Datenqualität (Pipino et al., 2002).

**Beispiel aus der PROM-Erhebung im KSL:**  
Ein standardisierter Sarkom-Fragebogen enthält 20 Fragen zu Schmerz, Mobilität und psychischem Befinden. Wenn eine Patientin nur 14 Fragen beantwortet hat, fehlen 30 % der Informationen – dies beeinträchtigt die Auswertbarkeit und Vergleichbarkeit mit anderen Datensätzen.

**Mögliche Metrik:**  
- Anteil vollständig ausgefüllter Felder pro Patient:in und pro Fragebogen  
- Formel (vereinfacht):  
  `Vollständigkeit [%] = (Anzahl ausgefüllter Felder) / (Gesamtanzahl erwarteter Felder) × 100`
- Bsp.: Fragebogen hat 80 Fragen, Patient hat 70 Fragen ausgefüllt: 70/80 * 100 = 87.5%  
**Interpretation:**  
Ein Vollständigkeitswert unter einem definierten Schwellenwert (z. B. < 90 %) kann auf ein Qualitätsproblem hinweisen – etwa fehlende Motivation, technische Probleme oder unklare Fragestellungen. Solche Fälle können im Dashboard visuell hervorgehoben werden, um gezielt nachzuhaken oder Nachbefragungen einzuleiten.

#### 3.2.2 Korrektheit

**Definition:**  
Korrektheit beschreibt, ob ein erfasster Datenwert der tatsächlichen Realität entspricht. Im Kontext von PROMs bedeutet das, dass die Angaben der Patient:innen sowohl formell korrekt (z.B. gültiges Zahlenformat) als auch inhaltlich plausibel sind – also realistisch und nicht durch Eingabefehler oder Missverständnisse verzerrt. Da eine direkte Verifikation mit der Realität oft schwierig ist, erfolgt die Prüfung meist anhand definierter Wertebereiche oder Vergleichsdaten. Laut Pipino et al. (2002) ist Korrektheit besonders anspruchsvoll zu messen, da sie häufig eine Referenz oder ein "Ground Truth"-Vergleichsmodell erfordert (Pipino et al., 2002).

**Abgrenzung zu Vollständigkeit:**
Während bei der Vollständigkeit Daten fehlen können, geht es bei der Korrektheit um vorhandene, aber inhaltlich fehlerhafte Werte – z.B. extrem hohe Schmerzangaben durch Missverständnis oder versehentliche Doppelantworten.

**Beispiel aus der PROM-Datenerhebung:**
Ein Patient gibt bei einer Schmerzskala (0–10) den Wert 99 an. Obwohl das Feld ausgefüllt ist (→ formal korrekt), liegt ein klarer inhaltlicher Fehler vor. Solche Angaben können die Auswertung verzerren und die Aussagekraft der Daten mindern.

**Mögliche Metrik:**  
- Anteil korrekt validierter Werte im Vergleich zu definierten Gültigkeitsregeln  
- Formel (vereinfachte Einschätzung bei automatisierten Regeln):  
  `Korrektheit [%] = (Anzahl gültiger Werte innerhalb definierter Grenzen) / (Gesamtanzahl geprüfter Werte) × 100`

**Beispielhafter technischer Ansatz:**  
- Definition akzeptabler Wertebereiche (z.B. Skala 0–10 bei numerischen Fragen)  
- Automatische Validierung beim Import oder bei der Anzeige im Dashboard  
- Markierung fehlerhafter Werte zur Nachkontrolle oder Kommentierung  

**Interpretation:**  
Niedrige Korrektheitswerte können auf Verständnisprobleme bei den Fragen, technische Fehler oder unzureichende Eingabevalidierung hinweisen. Eine transparente Darstellung solcher Auffälligkeiten im Dashboard ermöglicht eine schnelle Qualitätskontrolle und gezielte Korrektur.

#### 3.2.3 Konsistenz

**Definition:**  
Konsistenz beschreibt den Grad an logischer Widerspruchsfreiheit innerhalb eines Datensatzes oder zwischen mehreren Einträgen. PROM-Daten gelten als konsistent, wenn sie inhaltlich zusammenpassen – sowohl untereinander als auch in Bezug auf andere Patientenmerkmale (z.B. Alter, Geschlecht, Erkrankungsverlauf). Inkonsistenzen entstehen häufig durch Mehrfacheinträge, Missverständnisse bei der Befragung oder technische Übertragungsfehler. Laut Batini et al. (2009) ist Konsistenz besonders relevant in Systemen mit mehreren Datenquellen oder bei manueller Dateneingabe.

**Beispiel aus der PROM-Erhebung:**
Eine Patientin kreuzt an, seit sechs Monaten keine Schmerzen mehr zu haben, gibt im nächsten Feld aber eine aktuelle Schmerzintensität von 9/10 an. Solche widersprüchlichen Angaben deuten auf mangelnde Konsistenz hin und können die Interpretation der Daten erheblich erschweren.

**Mögliche Metrik:**  
- Anteil widerspruchsfreier Antworten innerhalb definierter Regelsets
- Formel (vereinfachte Darstellung):  
  `Konsistenz [%] = (Anzahl logisch stimmiger Einträge) / (Gesamtanzahl geprüfter Fälle) × 100`

**Technische Umsetzung im Dashboard:**
- Definition von Validierungsregeln zwischen Fragen (z. B. „Wenn Antwort A = ‚keine Beschwerden‘, dann darf Antwort B ≠ ‚sehr starke Beschwerden‘ sein“)  
- Implementierung regelbasierter Prüfungen (z. B. mit Python oder SQL)  
- Automatische Kennzeichnung widersprüchlicher Antworten zur gezielten Überprüfung  

**Interpretation:**  
Konsistenzfehler schwächen die Aussagekraft der PROM-Auswertungen und können auf fehlerhafte Dateneingabe, mangelndes Verständnis oder unklare Frageformulierungen hindeuten. Im Dashboard sollten solche Fälle klar markiert werden, um gezielt Rückfragen oder Verbesserungen bei der Erhebung zu ermöglichen.  

#### 3.2.4 Aktualität

**Definition:**  
Aktualität beschreibt, wie gut die vorliegenden Daten den gegenwärtigen Zustand einer Patientin oder eines Patienten widerspiegeln. Bei PROM-Daten (Patient-Reported Outcome Measures) ist dies besonders wichtig, da sie den subjektiven Gesundheitszustand zu einem bestimmten Zeitpunkt erfassen sollen. Veraltete oder verspätet erfasste Daten können zu Fehleinschätzungen des Krankheitsverlaufs führen.

**Abgrenzung:**
Ein älteres Datum ist nicht automatisch ein Qualitätsproblem. Entscheidend ist, ob das Datum dem vorgesehenen Erhebungszeitpunkt entspricht – etwa bei Fragebögen, die in regelmässigen Intervallen ausgefüllt werden sollen (z. B. alle 3 oder 6 Monate). Liegt kein aktueller Eintrag vor, obwohl er erwartet wurde, spricht man von mangelnder Aktualität.

**Beispiel aus der PROM-Erhebung:**
Laut Zeitplan sollte ein Patient alle drei Monate einen Fragebogen ausfüllen. Der letzte Eintrag datiert jedoch von vor über sechs Monaten. Das erschwert nicht nur die Verlaufskontrolle, sondern kann auch zu unvollständigen Entscheidungsgrundlagen in der Nachsorge führen.

**Mögliche Metrik:**  
- Anteil der PROM-Einträge, die innerhalb des erwarteten Intervalls eingegangen sind  
- Durchschnittliche Differenz zwischen geplantem und tatsächlichem Erfassungszeitpunkt (Time Lag)
- Formel (Beispiel):  
  `Aktualität [%] = (Anzahl fristgerechter Einträge) / (Anzahl erwarteter Einträge im Zeitraum) × 100` 

**Technische Umsetzung:**  
- Vergleich des tatsächlichen Eintragsdatums mit dem erwarteten Intervall (z.B. `next_due_date`)  
- Kennzeichnung überfälliger Einträge (z. B. farblich im Diagramm)  
- Benachrichtigungen bei fehlender Aktualität (z. B. „Letzter PROM-Eintrag > 90 Tage alt“)

**Interpretation:**  
Fehlende Aktualität bedeutet, dass der klinische Zustand einer Person möglicherweise nicht mehr aktuell abgebildet ist. Das Dashboard kann dies automatisch erkennen und visuell oder durch Alerts hervorheben – ein wichtiger Hinweis für medizinisches Personal, um gezielt nachzuhaken oder erneute Erhebungen anzustossen.

#### 3.2.5 Eindeutigkeit

**Definition:**  
Eindeutigkeit bezeichnet das Ausmass, in dem jede Patient:in, jeder Fragebogen und jede Erhebung nur einmal eindeutig und korrekt im Datensatz vorhanden ist. In einem datenbasierten Monitoring wie dem PROM-Dashboard ist dies entscheidend, um Doppelzählungen zu vermeiden und die Auswertung nicht zu verfälschen.

**Abgrenzung:**  
Im Gegensatz zur Konsistenz, die inhaltliche Widersprüche bewertet, zielt die Eindeutigkeit auf die strukturierte Identifikation: Auch wenn zwei Einträge identisch sind, dürfen sie nicht doppelt im System vorhanden sein – etwa durch Mehrfacheingaben oder fehlerhafte Synchronisation mit anderen Systemen.

**Beispiel aus der PROM-Dokumentation:**
Ein Patient hat denselben Fragebogen versehentlich zweimal eingereicht. Beide Einträge erscheinen im System, ohne als Duplikat erkannt zu werden. Dies führt zu einer künstlichen Erhöhung der Antwortquote und kann Trends verzerren.

**Mögliche Metrik:**  
- Anteil der eindeutigen PROM-Einträge pro Patient:in und Erhebungszeitpunkt  
- Anzahl erkannter Dubletten pro Datensatzklasse (z.B. `(patient_id, date)`)
- Formel (vereinfacht):  
  `Eindeutigkeit [%] = (Anzahl eindeutiger Kombinationen) / (Gesamtzahl Einträge) × 100`

**Technische Umsetzung:**  
- Verwendung von kombinierten Schlüsseln (z. B. patient_id + timestamp)  
- Plausibilitätsprüfung: Gibt es zwei Einträge am selben Tag?  
- Fuzzy-Matching bei unstrukturierten Datenfeldern (z. B. Name, Geburtsdatum)  

**Interpretation:**  
Fehlende Eindeutigkeit kann erhebliche Auswirkungen auf die Datenanalyse und das Vertrauen in PROM-Auswertungen haben. Das Dashboard kann hier aktiv unterstützen, indem es Dubletten sichtbar macht und entsprechende Korrekturvorschläge anbietet.

#### 3.2.6 Plausibilität

**Definition:**  
Plausibilität beschreibt, ob erfasste Werte im jeweiligen medizinischen und kontextuellen Rahmen glaubwürdig erscheinen. Anders als Korrektheit – die einen Abgleich mit einer verifizierten Quelle erfordert – prüft Plausibilität, ob ein Wert in sich stimmig und fachlich nachvollziehbar ist. Gerade bei patientenberichteten Daten wie PROMs kann es zu Eingaben kommen, die formal korrekt, aber inhaltlich zweifelhaft sind (Batini et al., 2009).

**Abgrenzung:**  
Plausibilität liegt zwischen Korrektheit und Konsistenz: Während Korrektheit sich an der Realität orientiert und Konsistenz an innerer Widerspruchsfreiheit, bewertet Plausibilität die medizinische Wahrscheinlichkeit und die logische Erwartung an einen Wert – auch ohne externen Abgleich.

**Beispiel aus den PROM-Daten:**
Ein:e Patient:in gibt bei der Selbsteinschätzung einen Schmerzscore von „15“ auf einer Skala von 0 bis 10 ein. Formal korrekt (Zahl), aber nicht plausibel. Oder: Ein Fragebogen enthält eine Antwort auf eine Frage zu Nebenwirkungen – obwohl gar keine Therapie dokumentiert ist.

**Mögliche Metrik:**  
- Anteil der Werte, die vordefinierten Plausibilitätsregeln entsprechen  
- Anzahl auffälliger Abweichungen vom Erwartungsbereich  
- Formel (vereinfacht):  
  `Plausibilität [%] = (Anzahl plausibler Einträge) / (Gesamtzahl geprüfter Einträge) × 100`

**Technische Umsetzung:**  
- Regelbasierte Validierungen: z. B. „Schmerzscore ≤ 10“, „BMI zwischen 10 und 60“    
- Statistische Anomalie-Erkennung: z. B. IQR, z-Score oder Zeitreihenanalysen  
- Visualisierung: z.B. Boxplots mit Ausreissern oder Heatmaps  

**Interpretation:**  
Plausibilitätsprüfungen sind essenziell für die Qualitätssicherung von PROM-Daten, da sie helfen, systematische Eingabefehler und unlogische Antworten frühzeitig zu erkennen. Das Dashboard sollte diese automatisch identifizieren und auffällige Fälle visuell hervorheben, damit gezielt nachvalidiert oder kommentiert werden kann.

#### 3.2.7 Abgrenzung: Korrektheit, Konsistenz und Plausibilität

Die Dimensionen Korrektheit, Konsistenz und Plausibilität werden in der Praxis häufig miteinander verwechselt oder synonym verwendet – unterscheiden sich aber hinsichtlich ihrer Bewertungslogik deutlich. Für die technische Umsetzung eines Dashboards zur Datenqualitätsüberwachung – insbesondere bei PROM-Daten – ist eine klare Trennung dieser Begriffe notwendig, um gezielte Prüfregeln und passende Visualisierungen zu entwickeln.

| Dimension       | Bewertungsfokus                          | Definition                              | Beispiel                           |
|-----------------|---------------------------------|----------------------------------------|------------------------------------|
| **Korrektheit**   | Abgleich mit der Realität (Realitätstreue)      | Entspricht der Wert dem tatsächlichen Sachverhalt? (z. B. durch Abgleich mit Primärdaten. „Ground Truth“)                         | OP-Datum in System: 01.10 statt korrekt 10.01 → formal gültig, aber sachlich falsch                          |
| **Konsistenz**    | Logische Kohärenz intern         | Stimmen Informationen **innerhalb** oder **zwischen** PROMs logisch überein?           | Diagnose „nicht metastasiert“, aber metastasenbezogene Chemotherapie dokumentiert          |
| **Plausibilität** | Medizinisch-logische Erwartung   | Ist der Wert **im Kontext fachlich nachvollziehbar**, auch ohne Verifikation?                | Tumorgrösse 45.000 cm³ oder Schmerzscore „15“ auf Skala von 0–10 – formal korrekt, aber unplausibel     |

Diese Unterscheidung hilft bei der gezielten Auswahl und Umsetzung von Prüfmechanismen im Dashboard zur Datenqualitätsüberwachung.

Die drei Dimensionen ergänzen sich, sollten aber separat implementiert und interpretiert werden. Im Dashboard zur Datenqualitätsüberwachung von PROM-Daten am Kantonsspital Luzern sollten eigene Regeln und Visualisierungen für jede dieser Kategorien vorgesehen werden – insbesondere, da viele Auffälligkeiten nicht auf technische Fehler, sondern auf fehlendes Kontextverständnis oder Eingabeungenauigkeit zurückzuführen sind.


### 3.3 Übersichtstabelle: Datenqualitätsdimensionen

| **Dimension**       | **Definition**          | **Beispiel (PROM-Daten, Sarkomversorgung)**    | **Typische Metrik**                                 |
| ------------------- | ----------------------- | ---------------------------------------------- | --------------------------------------------------- |
| **Vollständigkeit** | Alle notwendigen Daten sind vorhanden  | Einzelne PROM-Fragen (z.B. zu Schmerz oder Mobilität) wurden von Patient:innen nicht beantwortet | (Anzahl ausgefüllter Felder) / (Gesamtanzahl erwarteter Felder) × 100 |
| **Korrektheit**     | Daten stimmen mit der Realität überein | Follow-up-Datum wurde fehlerhaft mit 01.10 statt 10.01 erfasst  | (Korrekte Werte) / (Geprüfte Werte) × 100   |
| **Konsistenz**      | Daten sind widerspruchsfrei innerhalb und zwischen PROMs | Patient gibt „keine Schmerzen“ an, kreuzt aber eine starke Einschränkung im Alltag an. | (Widerspruchsfreie Fälle) / (Geprüfte Fälle) × 100 |
| **Aktualität**      | Daten sind zum Zeitpunkt der Nutzung noch gültig | Letzter PROM-Bogen liegt mehr als ein Jahr zurück, obwohl halbjährliche Erhebung vorgesehen ist    | (Aktuelle Einträge) / (Erwartete Einträge im Zeitraum) × 100          |
| **Eindeutigkeit**   | Jede Entität (z.B. Patient:in) ist nur einmal eindeutig vorhanden   | Derselbe Patient wurde zweimal erfasst (z.B. durch Tippfehler bei Namen/Geburtsdatum)   | (Eindeutige IDs) / (Gesamtanzahl IDs) × 100   |
| **Plausibilität**   | Werte erscheinen im medizinischen Kontext nachvollziehbar und realistisch | Schmerzscore „12“ auf einer Skala von 0 bis 10 oder Diagnosedatum nach Therapiebeginn    | (Plausible Werte) / (Geprüfte Werte) × 100 |


### 3.4 Herausforderungen und Grenzen bei der Messung von Datenqualitätsdimensionen

Die strukturierte Bewertung von Datenqualität ist eine zentrale Voraussetzung für die gezielte Verbesserung patientenberichteter Ergebnisdaten (PROMs). Dabei stellt nicht nur die Definition geeigneter Dimensionen eine Herausforderung dar, sondern vor allem ihre technische Umsetzung in einem automatisierten Dashboard. Insbesondere im klinischen Umfeld – mit sensiblen Inhalten, variabler Dokumentationstiefe und teils unstrukturierten Eingaben – sind bestimmte Einschränkungen zu beachten.

#### Subjektivität und Validierungsprobleme
Dimensionen wie Korrektheit oder Plausibilität sind in vielen Fällen nur begrenzt objektiv messbar. PROM-Antworten spiegeln subjektive Einschätzungen von Patient:innen wider – etwa bei Fragen zum Wohlbefinden oder zur Schmerzintensität. Ob diese Angaben „korrekt“ oder „plausibel“ sind, lässt sich ohne ärztliche Beurteilung oder Kontextwissen oft nicht eindeutig feststellen. Eine automatisierte Prüfung kann hier allenfalls Anomalien erkennen, keine absolute Richtigkeit.

#### Abhängigkeit vom Nutzungskontext
Die Einschätzung der Datenqualität hängt stark vom Verwendungszweck ab. Ein PROM-Bogen mit 90 % ausgefüllten Feldern kann für ein einfaches Monitoring ausreichend, für eine komplexe Langzeitanalyse jedoch unbrauchbar sein. Das Prinzip der „fitness for use“ (Wang & Strong, 1996) betont, dass Datenqualität keinen absoluten Wert besitzt, sondern stets im Anwendungskontext betrachtet werden muss.

#### Automatisierungslücken
Viele Prüfungen lassen sich technisch gut umsetzen (z.B. auf leere Felder oder Datenformate). Doch regelbasierte Inkonsistenzen (z.B. widersprüchliche Angaben in Fragebogenantworten) oder semantische Plausibilitätsprüfungen (z.B. unrealistische Schmerzverläufe) erfordern oft menschliches Fachwissen. Besonders bei Freitexten oder seltenen Sonderfällen stösst die Automatisierung an ihre Grenzen – hier sind manuelle Stichproben oder Validierungsfeedbacks notwendig. 

#### Interpretationsspielräume bei Schwellenwerten
Ein numerischer Wert allein sagt selten etwas über die klinische Relevanz aus. Beispielsweise kann ein Vollständigkeitswert von 85 % gravierend sein, wenn zentrale Angaben wie Tumorstadium fehlen – oder vernachlässigbar, wenn es sich um optionale Zusatzfragen handelt. Aus diesem Grund ist es entscheidend, dass Metriken im Dashboard kontextsensitiv visualisiert und interpretierbar aufbereitet werden – idealerweise mit Schwellenwerten und Ampellogik.

**Fazit:**  
Die Erfassung und Visualisierung von Datenqualitätsdimensionen ist ein zentraler Bestandteil deines PROM-Dashboards. Gleichzeitig erfordert ihre Bewertung ein ausgewogenes Zusammenspiel aus technischer Automatisierung, medizinischem Kontextwissen und differenzierter Interpretation. Ziel ist es nicht, absolute Urteile zu fällen, sondern gezielte Hinweise auf mögliche Schwächen zu geben – damit klinisches Personal frühzeitig reagieren und die Datenqualität nachhaltig verbessern kann.

---

## 4. Methoden der Datenqualitätssicherung

Die Sicherstellung der Datenqualität erfolgt nicht ausschliesslich durch nachträgliche Kontrollen, sondern durch ein gezieltes Zusammenspiel aus technischen Prüfmechanismen, organisatorischen Prozessen und – in bestimmten Fällen – manueller Fachexpertise. Welche Methode zur Anwendung kommt, hängt vom Datentyp, vom Erhebungsprozess sowie von der Zielsetzung ab. Für die PROM-Daten im LUKS steht dabei die technische Automatisierung im Vordergrund.

### 4.1 Manuelle vs. automatisierte Prüfungen

In der Praxis werden zwei Ansätze unterschieden:
- **Manuelle Prüfungen**: Diese erfolgen durch medizinisches Fachpersonal – etwa im Rahmen von Stichproben, Validierungsreviews oder Nachdokumentationen. Sie eignen sich vor allem für komplexe Einzelfälle mit Kontextbezug, sind jedoch ressourcenintensiv und schwer skalierbar.  
- **Automatisierte Prüfungen**: Hierbei werden Daten mithilfe vordefinierter Regeln oder statistischer Verfahren automatisch überprüft – entweder direkt bei der Eingabe, periodisch im Hintergrund oder visuell im Dashboard. Sie bieten Konsistenz, Schnelligkeit und Skalierbarkeit, erfordern aber eine sorgfältige Regeldefinition und technische Implementierung.
Ergänzt durch gezielte manuelle Validierung bei auffälligen Fällen oder Indikatoren.

### 4.2 Validierungsregeln und Plausibilitätsprüfungen

Ein zentrales Instrument der Datenqualitätsprüfung sind regelbasierte Validierungen, die typischerwe
**Fazit:** Für das PROM-Dashboard am LUKS steht die automatisierte Prüfung im Vordergrund, idealerweise eise in folgenden Bereichen eingesetzt werden:
- **Feldvalidierungen**: Prüfung auf erlaubte Wertebereiche, zulässige Datentypen oder Pflichtfeldbefüllung.
- **Logikregeln:** z.B. „Therapiebeginn darf nicht vor Diagnosedatum liegen“ oder „Wenn Geschlecht = männlich, dann Schwangerschaft = nein“.  
- **Kontextsensitive Regeln:** Berücksichtigung patientenspezifischer Angaben oder Studienprotokolle (z.B. altersabhängige Wertebereiche).

Plausibilitätsprüfungen erweitern diese Logik um fachlich-inhaltliche Einschätzungen – etwa durch die Identifikation unrealistischer, aber formal zulässiger Werte (z.B. Tumorvolumen = 45'000 cm³ oder BMI = 2). Diese Regeln beruhen auf medizinischem Erfahrungswissen, Schwellenwertdefinitionen oder heuristischen Annahmen

### 4.3  Statistische Verfahren und Ausreissererkennung
Neben regelbasierten Ansätzen kommen statistische Methoden zum Einsatz, um Auffälligkeiten systematisch zu identifizieren. Besonders geeignet sind diese Verfahren für quantitative PROM-Daten, die über längere Zeiträume hinweg erhoben werden. Zum Beispiel:
- **Boxplots / Interquartilsabstand (IQR)** zur Bestimmung ungewöhnlicher Werte
- **z-Score** zur Identifikation von Extremwerten relativ zur Streuung
- **Trendanalysen**, insbesondere in longitudinalen Daten (z.B. abrupte Stimmungswechsel bei Patienten)

Diese Methoden lassen sich automatisiert im Dashboard umsetzen und über grafische Elemente wie Verteilungskurven, Ampelsymbole oder Verlaufscharts darstellen.

### 4.4 Alerts und Monitoring bei Fehlern

Ein zentrales Element zur Sicherstellung der Datenqualität ist die Integration von Warnsystemen. Diese ermöglichen eine frühzeitige Identifikation und Reaktion auf kritische Abweichungen:

- **Schwellenwertalarme:** z.B. bei Vollständigkeit < 90 % oder mehr als X Tage seit letztem Eintrag.  
- **Regelverletzungsalarme:** z.B. bei widersprüchlichen Daten oder fehlerhaften Zeitangaben.

Alerts sollten visuell eindeutig, priorisiert (z.B. farbcodiert) und zielgerichtet adressierbar sein – etwa über Benachrichtigungen im Dashboard oder automatische E-Mails an definierte Ansprechpartner:innen.

**Fazit:**  
Die Datenqualitätssicherung für PROM-Daten am LUKS basiert auf einem methodischen Mix: automatisierte Prüfregeln und statistische Erkennungsmethoden sind zentrale Bausteine, ergänzt durch selektive manuelle Validierung und klar definierte Alert-Mechanismen. Diese Kombination ermöglicht eine effektive und ressourcenschonende Überwachung der Datenqualität – mit unmittelbarem Mehrwert für die klinische Versorgung und Forschung im Bereich Sarkom.

## 5. Technische Architektur des Dashboards

Zur Echtzeitüberwachung der Datenqualität in der Sarkomversorgung wird ein modular aufgebautes System entwickelt. Es besteht aus einer PostgreSQL-Datenbank als Quelle, einem Backend für Regelprüfungen und Schnittstellen sowie einem interaktiven React-Frontend zur Visualisierung. Alerts und Benachrichtigungen runden das System ab und sorgen für schnelle Reaktionsmöglichkeiten bei Qualitätsproblemen. Das heisst, dass die geplante Architektur basiert auf einem entkoppelten System mit **React (Frontend)**, **FastAPI (Backend)** und **PostgreSQL (Datenbank)**, gehostet auf einem gesicherten **Google-Cloud-Server**.

### 5.1 Datenquelle: PostgreSQL
Die Datenbasis bilden strukturierte PROM-Daten, die in einer PostgreSQL-Datenbank gespeichert sind. PostgreSQL eignet sich aufgrund seiner Stabilität, Skalierbarkeit und Abfragefunktionen besonders gut für datenqualitätsbezogene Auswertungen. PostgreSQL Vorteile:

- Hohe Transaktionssicherheit und Zuverlässigkeit bei medizinischen Daten  
- Effiziente SQL-Abfragen für Qualitätsmetriken (z. B. IS NULL, DISTINCT, JOIN)  
- Unterstützung von Materialized Views, Triggers und Stored Procedures zur Automatisierung von Prüfprozessen  

Beispiel: Eine View wie `dq_vollstaendigkeit` kann den wöchentlichen Anteil fehlender Felder pro Fragebogentyp berechnen und dem Dashboard als Datenquelle dienen.

### 5.2 Backend: FastAPI für Regelprüfung und Schnittstellen

Das Backend wird mit **FastAPI** entwickelt, einem performanten Python-Framework für Web-APIs. Es fungiert als Bindeglied zwischen Datenbank und Frontend und übernimmt die regelbasierte Prüfung sowie die Berechnung zentraler Metriken. Folgende Funktionen:

- Verbindung zur PostgreSQL-Datenbank mittels SQLAlchemy  
- Umsetzung regelbasierter Prüfungen (z. B. Vollständigkeit, Plausibilität, Konsistenz)  
- Berechnung von Metriken, die zyklisch aktualisiert und in Tabellen wie quality_metrics oder rule_violations gespeichert werden  
- Bereitstellung dieser Informationen über REST-Endpunkte

Bibliotheken im Einsatz:
- Pandas und NumPy für Datenmanipulation  
- SciPy für statistische Verfahren (z. B. z-Score, IQR)  
- Optional: Celery für asynchrone Aufgaben und periodische Berechnungen  

### 5.3 Frontend: React-Webanwendung

Das Frontend wird als **React-Anwendung** mit Fokus auf Benutzerfreundlichkeit, Klarheit und Erweiterbarkeit entwickelt. Es ermöglicht:

- Interaktive Visualisierung der Qualitätsmetriken (z.B. Liniendiagramme, Ampelindikatoren, Tabellen mit Drilldown)  
- Dynamische Filterfunktionen (z.B. nach Zeitraum, Fragebogentyp, Patientengruppe)  
- Anzeige auffälliger Werte, Regelverletzungen und Datenlücken  

### 5.4 Alerts und Benachrichtigungen

Das System bietet neben der passiven Visualisierung auch aktive Benachrichtigungen, um bei kritischen Abweichungen schnell reagieren zu können.

Möglichkeiten:
- UI-basierte Alerts: z. B. farblich hervorgehobene Metriken bei Unterschreitung definierter Schwellenwerte (z. B. Vollständigkeit < 90 %)  
- E-Mail-Benachrichtigungen: automatisierter Versand bei Regelverletzungen an verantwortliche Stellen  

---
## 6. Bewertungskriterien und Metriken

Die Überwachung der Datenqualität im Rahmen eines Dashboards erfordert klar definierte Metriken, mit denen sich die in Kapitel 3 beschriebenen Qualitätsdimensionen zuverlässig und automatisiert bewerten lassen. Diese Kennzahlen bilden die Grundlage für Visualisierungen, Alerts und kontinuierliche Verbesserungsmassnahmen im klinischen Umfeld.

### 6.1 Berechnung standardisierter Metriken

Basierend auf der Fachliteratur (u. a. Wang & Strong, Batini et al., Forschner) können für jede Dimension spezifische, quantifizierbare Metriken definiert werden. Sie lassen sich automatisiert berechnen und dienen sowohl der punktuellen Analyse als auch dem longitudinalen Monitoring.

| **Dimension**       | **Beispielhafte Metrik (Formel)**                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| **Vollständigkeit** | `(Anzahl ausgefüllter Pflichtfelder) / (Gesamtanzahl erwarteter Felder) × 100`                          |
| **Korrektheit**     | `(Anzahl korrekt validierter Werte) / (Gesamtanzahl geprüfter Werte) × 100`                             |
| **Konsistenz**      | `(Anzahl widerspruchsfreier Datensätze) / (Gesamtanzahl geprüfter Datensätze) × 100`                    |
| **Aktualität**      | `(Anzahl aktueller Einträge innerhalb des Soll-Zeitrahmens) / (Gesamtanzahl erwarteter Einträge) × 100` |
| **Eindeutigkeit**   | `(Anzahl eindeutig identifizierbarer Entitäten) / (Gesamtanzahl Einträge) × 100`                        |
| **Plausibilität**   | `(Anzahl regelkonformer Werte) / (Gesamtzahl geprüfter Werte) × 100`                                    |


Die Berechnungen können im Backend (z.B. mit Python, Pandas und SQL-Abfragen) implementiert und regelmässig aktualisiert werden. Dabei empfiehlt sich ein zyklisches Monitoring, um Trends und Verschlechterungen zeitnah zu erkennen.

### 6.2 Definition von Schwellenwerten und Bewertungsskalen

Für jede Qualitätsdimension werden kontextspezifische Schwellenwerte definiert, um auffällige Datenbereiche schnell identifizieren zu können. Die Festlegung dieser Grenzwerte basiert auf:

- Good Clinical Practice (GCP)-Empfehlungen
- Erfahrungswerten aus vergleichbaren Forschungsprojekten
- Relevanz und Kritikalität der jeweiligen Datenfelder (z.B. Diagnose > Telefonnummer)

**Beispielhafte Schwellenwerte für klinische Daten:**

| **Dimension**   | **Warnung (gelb)** | **Kritisch (rot)** |
| --------------- | ------------------ | ------------------ |
| Vollständigkeit | unter 95 %         | unter 85 %         |
| Aktualität      | älter als 30 Tage  | älter als 60 Tage  |
| Plausibilität   | unter 98 % korrekt | unter 90 % korrekt |


Diese Schwellenwerte können flexibel angepasst und dynamisch im Dashboard visualisiert werden – etwa durch:
- **Ampelsymbole** (grün, gelb, rot)  
- **Trendindikatoren** (z. B. Pfeile für Verbesserungen/Verschlechterungen)  
- **Alerts und Notifikationen** bei Grenzwertüberschreitungen  

**Fazit:**  
Die konsequente Anwendung standardisierter Metriken und definierter Schwellenwerte ist essenziell für eine fundierte Bewertung der Datenqualität. Sie ermöglicht eine strukturierte, visuell aufbereitete und skalierbare Überwachung der PROM-Daten – als Grundlage für datenbasierte Entscheidungen in der Sarkomversorgung am Kantonsspital Luzern.

---
## 7. Anforderungen an das Dashboard

### 7.1 Zielgruppen und Benutzer:innen

Das Dashboard ist so konzipiert, dass es unterschiedlichen Nutzergruppen einen gezielten Zugriff auf relevante Qualitätsinformationen ermöglicht. Dabei stehen jeweils andere Perspektiven und Handlungsoptionen im Vordergrund:

| **Nutzergruppe**                | **Zentrale Aufgaben und Nutzungsschwerpunkte**                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Ärzt\:innen / Klinikleitung** | Überblick über die Datenqualität auf Patienten-, Zeit- oder Zentrumsebene; Identifikation von Lücken in PROM-Erhebungen oder Follow-ups |
| **IT / Datenmanagement**        | Technische Prüfung der Datenintegrität, Pflege und Weiterentwicklung von Validierungsregeln, systematische Fehlersuche                  |


### 7.2 Reaktionsmöglichkeiten auf Qualitätsprobleme

Das Dashboard soll nicht nur Informationen anzeigen, sondern konkrete Reaktionsmöglichkeiten auf erkannte Probleme ermöglichen. Ziel ist eine aktive Steuerung der Datenqualität im Alltag der Sarkomversorgung.

Geplante Funktionen:
- **Visuelle Warnungen** (z.B. farbliche Markierung bei Grenzwertverletzung)
- **Benachrichtigungen** per E-Mail bei kritischen Fehlern oder Auslassungen

Diese Funktionen unterstützen ein schnelles, zielgerichtetes Handeln – sei es durch Rücksprache mit verantwortlichen Fachpersonen, Nachdokumentation fehlender Werte oder technische Korrekturen.

---

## 8. Zusammenfassung und Ausblick

Diese Arbeit hat die Grundlagen, Anforderungen und Umsetzungsmöglichkeiten zur Sicherung der Datenqualität im klinischen Kontext aufgearbeitet – mit besonderem Fokus auf PROM-Daten in der Sarkomversorgung am Kantonsspital Luzern. Im Zentrum stand die Konzeption eines Dashboards zur Echtzeitüberwachung relevanter Qualitätsdimensionen.

### 8.1 Zentrale Erkenntnisse

- **Datenqualität ist kontextabhängig und mehrdimensional.** Relevante Dimensionen wie Vollständigkeit, Korrektheit, Konsistenz, Aktualität, Eindeutigkeit und Plausibilität lassen sich durch geeignete Metriken bewerten und technisch überwachen.  
- **Automatisierbare Qualitätsmetriken sind essenziell**, um Abweichungen frühzeitig zu erkennen, Trends sichtbar zu machen und gezielt auf Probleme zu reagieren.  
- **Die eingesetzte Architektur (PostgreSQL, FastAPI, React)** bietet eine modulare, erweiterbare und datenschutzkonforme Grundlage zur Entwicklung eines Dashboards, das technisch robust und zugleich nutzerfreundlich ist.  
- Die Konzepte und Methoden müssen stets anwendungsnah und rollenspezifisch gestaltet werden – mit Fokus auf Transparenz, Nachvollziehbarkeit und intuitive Bedienbarkeit.Datenqualität ist kontextabhängig und mehrdimensional.


### 8.2 Offene Fragen und Herausforderungen

Trotz der konzeptionellen Basis gibt es offene Punkte, die in der nächsten Projektphase konkretisiert werden müssen:

- **Definition von Schwellenwerten**: Welche Grenzwerte gelten als kritisch, wann wird eine Benachrichtigung ausgelöst?  
- **Nutzerakzeptanz und Usability**: Wie wird das Dashboard gestaltet, damit es intuitiv und effektiv nutzbar ist – auch für medizinisches Fachpersonal ohne IT-Hintergrund?  
- **Validierung der Prüfregeln**: Wie lässt sich vermeiden, dass fehlerhafte Prüfmechanismen zu unnötigen Alarmen oder Fehleinschätzungen führen?  

### 8.3 Ausblick: Konzept- und Umsetzungsphase

Im nächsten Schritt folgt die technische Konzeptions- und Prototypphase, in der die Anforderungen aus der Analyse in konkrete Systembausteine übersetzt werden. Geplante Aufgaben sind u. a.:

- Definition und Modellierung der Datenqualitätsmetriken im Datenbankschema  
- Implementierung regelbasierter Prüfungen und Schwellenwertlogik im Backend  
- Entwicklung eines interaktiven, responsiven Dashboards mit zielgruppenspezifischer Visualisierung

Das langfristige Ziel ist ein **robustes, sicheres und benutzerfreundliches Tool**, das im Spitalumfeld die Datenqualität auf transparente Weise messbar macht und zur kontinuierlichen Verbesserung beiträgt – sowohl im Rahmen klinischer Studien als auch bei patientennahen digitalen Erhebungen.

---

## 9. Quellenverzeichnis

Azeroual, O., 2022. Untersuchungen zur Datenqualität und Nutzerakzeptanz von Forschungsinformationssystemen: Framework zur Überwachung und Verbesserung der Qualität von Forschungsinformationen, Research. Springer Vieweg, Wiesbaden.

Batini, C., Cappiello, C., Francalanci, C., Maurino, A., 2009. Methodologies for data quality assessment and improvement. ACM Comput. Surv. 41, 1–52. https://doi.org/10.1145/1541880.1541883.

Pipino, L.L., Lee, Y.W., Wang, R.Y., 2002. Data quality assessment. Commun. ACM 45, 211–218. https://doi.org/10.1145/505248.506010.

Wang, R.Y., Strong, D.M., 1996. Beyond Accuracy: What Data Quality Means to Data Consumers. Journal of Management Information Systems 12, 5–33. https://doi.org/10.1080/07421222.1996.11518099.