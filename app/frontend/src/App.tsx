/**
 * App-Komponente (Haupteinstiegspunkt der React-Anwendung)
 *
 * Zweck:
 * - Definiert das Hauptlayout (Sidebar + Header + Hauptinhalt) des Dashboards.
 * - Stellt die zentrale Routing-Struktur bereit.
 * - Bindet globale UI-Elemente wie den DuplicateNotifier ein.
 *
 * Verwendete Hauptkomponenten:
 * - `Sidebar`: Navigation zwischen den Hauptbereichen.
 * - `Header`: Kopfzeile mit Spracheinstellungen, Benutzerinfos etc.
 * - `Overview`: Übersicht mit KPI-Karten und Buttons, um zur Tabelle zu scrollen.
 * - `PatientQualityTable`: Haupttabelle mit allen Patient:innen und Qualitätsmetriken.
 * - `PatientDetailView`: Detailansicht für einen einzelnen Patienten (CROMs & PROMs).
 * - `ModuleDetailView`: Detailansicht für ein spezifisches Modul (z. B. Diagnose, Radiologie).
 * - `DatabasePage`: Direkter Datenbankzugriff (CROMs/PROMs) mit Editierfunktion.
 * - `AlertsPage`: Verwaltung von Alerts und Benachrichtigungen.
 * - `DuplicateNotifier`: Globale Anzeige von erkannten Duplikaten.
 *
 * State & Refs:
 * - `selectedTab`: Steuert, welcher Tab (Red Flags, Alle, CROMs, PROMs) in der Tabelle aktiv ist.
 * - `tableRef`: Referenz zur Patiententabelle, um gezielt scrollen zu können.
 *
 * Routing:
 * - `/` → Dashboard-Übersicht (Overview + PatientQualityTable).
 * - `/patients/:patientId` → Detailansicht CROM-Patient.
 * - `/proms/:patientId` → Detailansicht PROM-Patient.
 * - `/patients/:externalCode/:module/details` → Detailansicht eines einzelnen Moduls.
 * - `/forms` → Datenbankzugriff (CROM & PROM).
 * - `/alerts` → Alert-Verwaltung.
 *
 * Besonderheiten:
 * - Verwendet `react-router-dom` für Client-Side-Routing.
 * - Nutzt `i18next` für Mehrsprachigkeit.
 * - Der Scroll zu `PatientQualityTable` erfolgt per `scrollToTable()` mit smooth scroll.
 * - Layout ist zweigeteilt: Sidebar links, Hauptinhalt rechts.
 *
 * Typische Erweiterungen:
 * - Neue Routen für zusätzliche Seiten oder Berichte.
 * - Erweiterung des Headers mit Benutzermenü oder Suchfunktion.
 * - Integration weiterer globaler Benachrichtigungssysteme.
 */


import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import PatientQualityTable from './components/PatientQualityTable';
import PatientDetailView from './pages/PatientDetailView'; 
import { useTranslation } from 'react-i18next';
import DuplicateNotifier from './components/DuplicateNotifier';
import DatabasePage from './pages/DatabasePage';
import ModuleDetailView from './pages/ModuleDetailView';
import { useRef, useState } from 'react';
import AlertsPage from './pages/AlertsPage';


import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'redflags' | 'all' | 'croms' | 'proms'>('all');
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  return (
    <Router>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="dashboard-main">
            <DuplicateNotifier />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="dashboard-header">
                      <h1>{t('dashboard.title')}</h1>
                    </div>
                    <Overview 
                      setSelectedTab={setSelectedTab}
                      scrollToTable={scrollToTable}
                    />
                    <div ref={tableRef}>
                      <PatientQualityTable selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                    </div>
                  </>
                }
              />
              <Route
                path="/patients/:patientId"
                element={<PatientDetailView />}
              />
              <Route 
                path="/proms/:patientId" 
                element={<PatientDetailView />} 
              />

              <Route
                path="/patients/:externalCode/:module/details"
                element={<ModuleDetailView />}
              />
              <Route
                path="/forms"
                element={<DatabasePage />}
              />
              <Route
                path="/alerts"
                element={<AlertsPage />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;