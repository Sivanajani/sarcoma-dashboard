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

const formatRule = (a: Alert): string => {
  if (a.message) return a.message;

  const mod = a.module?.toUpperCase?.() || 'Unbekanntes Modul';
  const fieldText = a.field ? `: ${a.field}` : '';
  const condMap: Record<string, string> = {
    'is_null': 'Feld leer',
    'less_than': 'Wert kleiner als',
    'greater_than': 'Wert größer als',
    'equal': 'Wert gleich',
    'not_equal': 'Wert ungleich',
    'contains': 'enthält',
    'not_contains': 'enthält nicht',
  };

  const condText = condMap[a.condition] || a.condition;
  const val = a.value ?? a.threshold;

  return `${mod}${fieldText} → ${condText} ${val ?? ''}`.trim();
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
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