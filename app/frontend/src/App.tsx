import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import PatientQualityTable from './components/PatientQualityTable';
import PatientDetailView from './pages/PatientDetailView'; // ✅ importieren
import { useTranslation } from 'react-i18next';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="dashboard-main">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="dashboard-header">
                      <h1>{t('dashboard.title')}</h1>
                    </div>
                    <Overview />
                    <PatientQualityTable />
                  </>
                }
              />
              <Route
                path="/patients/:patientId"
                element={<PatientDetailView />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;