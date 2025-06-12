import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview'; 
import PatientQualityTable from './components/PatientQualityTable';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1>{t('dashboard.title')}</h1>
          </div>

          {/* Übersichtskarten */}
          <Overview />

          {/* Patient Quality Tabelle */}
          <PatientQualityTable />

        </main>
      </div>
    </div>
  );
}

export default App;