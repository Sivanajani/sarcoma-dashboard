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
import PromDetailView from './pages/PromDetailView';


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
            <DuplicateNotifier />
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
              <Route
                path="/patients/:externalCode/:module/details"
                element={<ModuleDetailView />}
              />
              <Route
                path="/proms/:id"
                element={<PromDetailView />}
              />
              <Route
                path="/forms"
                element={<DatabasePage />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;