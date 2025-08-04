import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../AuthProvider';
import { format } from 'date-fns';
import { red, green } from '@mui/material/colors';
import '../components/AlertsPage.css';
import AlertForm from '../components/AlertForm';


type Alert = {
  id: number;
  user_id: string;
  patient_external_code: string | null;
  module: string;
  metric: string | null;
  threshold: number;
  condition: string;
  email: string;
  frequency: string;
  active: boolean;
  last_triggered: string | null;
  source?: string | null;
  field?: string | null;
  value?: string | number | null;
  message?: string | null;
};

const metricLabels: Record<string, string> = {
  completeness: 'Vollständigkeit',
  correctness: 'Inhaltliche Korrektheit',
  consistency: 'Konsistenz',
  actuality: 'Aktualität',
};

const conditionLabels: Record<string, string> = {
  '==': 'ist gleich',
  '!=': 'ist ungleich',
  '<': 'ist kleiner als',
  '>': 'ist grösser als',
  'is_null': 'ist leer',
  'contains': 'enthält',
  'not_contains': 'enthält nicht',
};

const moduleLabels: Record<string, string> = {
  diagnoses: 'Diagnosen',
  pathologies: 'Pathologie',
  surgeries: 'Chirurgie',
  radiology_exams: 'Radiologie-Untersuchungen',
  radiology_therapies: 'Radiotherapie',
  sarcoma_boards: 'Tumorboards',
  systemic_therapies: 'Systemtherapien',
  hyperthermia_therapies: 'Hyperthermie',
  eq5d: 'EQ-5D',
  proms_proms_biopsy: 'PROM Biopsie',
};

const flagLabels: Record<number, string> = {
  1: 'gelbe Flagge',
  2: 'rote Flagge',
};


const formatRule = (a: Alert): string => {
  if (a.message) return a.message;

  const moduleText = moduleLabels[a.module] || a.module;
  const conditionText = conditionLabels[a.condition] || a.condition;

  if (a.field === 'flag' && typeof a.value === 'number') {
    const flagText = flagLabels[a.value] || a.value;
    return `${moduleText}: Flagge ${conditionText} ${flagText}`;
  }

  if (a.metric) {
    const metricText = metricLabels[a.metric] || a.metric;
    return `${moduleText}: ${metricText} ${conditionText} ${a.threshold}`;
  }

  if (a.field) {
    const valueText = a.condition === 'is_null' ? '' : ` ${a.value}`;
    return `${moduleText}: Feld "${a.field}" ${conditionText}${valueText}`;
  }

  return `${moduleText}: Unklare Regel`;
};


const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  
  const fetchAlerts = async () => {
    try {
      if (!auth.token) return;
      const res = await axios.get<Alert[]>("http://localhost:8000/alerts/me", {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setAlerts(res.data);
    } catch (error) {
      console.error("Fehler beim Laden der Alerts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [auth.token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="alerts-table-container">
      <h1>Meine Alerts</h1>
      
      <Box mb={4}>
        <AlertForm onSuccess={fetchAlerts} />
      </Box>

      <table className="alerts-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Quelle</th>
            <th>Modul</th>
            <th>Regelbeschreibung</th>
            <th>Frequenz</th>
            <th>Aktiv</th>
            <th>Zuletzt ausgelöst</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id}>
              <td>{a.patient_external_code}</td>
              <td>{a.source}</td>
              <td>{a.module}</td>
              <td>{formatRule(a)}</td>
              <td>{a.frequency}</td>
              <td className="status-icon">
                {a.active ? (
                  <CheckCircleIcon sx={{ color: green[500] }} />
                ) : (
                  <CancelIcon sx={{ color: red[500] }} />
                )}
              </td>
              <td>
                {a.last_triggered
                  ? format(new Date(a.last_triggered), 'd.M.yyyy, HH:mm:ss')
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsPage;