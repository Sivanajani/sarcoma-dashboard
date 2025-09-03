/**
 * DatabasePage.tsx
 *
 * Zweck:
 * - Zentrale Seite zum Zugriff auf und zur Bearbeitung von CROM- und PROM-Daten
 *   über das Frontend.
 *
 * Aufbau:
 * - `CromDatabase`: Komponente für Suche, Anzeige und Bearbeitung der
 *   Clinician Reported Outcome Measures (CROMs).
 * - `PromDatabase`: Komponente für Suche, Anzeige und Bearbeitung der
 *   Patient Reported Outcome Measures (PROMs).
 *
 * Funktionsweise:
 * - Die Seite zeigt nacheinander beide Datenbankzugriffs-Komponenten an,
 *   getrennt durch eine horizontale Linie.
 * - Jede Unterkomponente enthält eigene Such- und Bearbeitungslogik.
 *
 * Styling:
 * - Umfasst den Container mit der CSS-Klasse `dashboard-main`.
 *
 * Nutzung:
 * ```tsx
 * import DatabasePage from './DatabasePage';
 * 
 * <Route path="/database" element={<DatabasePage />} />
 * ```
 *
 * Abhängigkeiten:
 * - `CromDatabase` (lokal)
 * - `PromDatabase` (lokal)
 */


import CromDatabase from './CromDatabase';
import PromDatabase from './PromDatabase';
import {useTranslation } from 'react-i18next';

const DatabasePage = () => {
  const { t } = useTranslation();
  return (
    <div className="dashboard-main">
      <h1>{t('databasePage.datenbankzugriff')}</h1>
      <CromDatabase />
      <hr style={{ margin: '2rem 0' }} />
      <PromDatabase />
    </div>
  );
};

export default DatabasePage;