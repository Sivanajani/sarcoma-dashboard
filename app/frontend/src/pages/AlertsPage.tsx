import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Switch,
  IconButton,
  Tooltip
} from '@mui/material';
import { useAuth } from '../AuthProvider';
import { format } from 'date-fns';
import '../components/AlertsPage.css';
import AlertForm from '../components/AlertForm';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import { blueGrey } from '@mui/material/colors';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true
});


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

const moduleKeyMap: Record<string, string> = {
  diagnoses: 'modules.diagnosis',
  pathologies: 'modules.pathology',
  surgeries: 'modules.surgery',
  radiology_exams: 'modules.radiology_exam',
  radiology_therapies: 'modules.radiology_therapy',
  sarcoma_boards: 'modules.sarcoma_board',
  systemic_therapies: 'modules.systemic_therapy',
  hyperthermia_therapies: 'modules.hyperthermia_therapy',
  eq5d: 'modules.eq5d',
  proms_proms_biopsy: 'modules.biopsy'
};

const metricKeyMap: Record<string, string> = {
  completeness: 'patientTable.headers.completeness',
  correctness: 'patientTable.headers.correctness',
  consistency: 'patientTable.headers.consistency',
  actuality: 'patientTable.headers.actuality'
};

const conditionKeyMap: Record<string, string> = {
  '==': 'addAlerts.conditionEquals',
  '!=': 'addAlerts.conditionNotEquals',
  '<': 'addAlerts.conditionLessThan',
  '>': 'addAlerts.conditionGreaterThan',
  'is_null': 'addAlerts.conditionIsNull',
  'contains': 'addAlerts.conditionContains',
  'not_contains': 'addAlerts.conditionNotContains'
};

const flagText = (t: any, val: number) =>
  val === 1 ? t('addAlerts.yellowFlag') : val === 2 ? t('addAlerts.redFlag') : String(val);

const AlertsPage = () => {
  const { t } = useTranslation();
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
  
  const updateAlert = async (id: number, patch: Partial<Alert>) => {
    if (!auth.token) return;
    // Optimistic: alten Zustand merken
    const prev = alerts;
    try {
      setAlerts((curr) => curr.map(a => a.id === id ? { ...a, ...patch } : a));
      await axios.patch<Alert>(`http://localhost:8000/alerts/${id}`, patch, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
    } catch (e) {
      console.error('Fehler beim Update des Alerts', e);
      // rollback
      setAlerts(prev);
    }
  };

  const deleteAlert = async (id: number) => {
  if (!auth.token) return;

  const result = await Swal.fire({
    title: t('alertsPage.confirmDeleteTitle') ?? 'Alert löschen?',
    text: t('alertsPage.confirmDelete') ?? 'Diesen Alert wirklich löschen?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('alertsPage.delete') ?? 'Löschen',
    cancelButtonText: t('cancel') ?? 'Abbrechen',
    reverseButtons: true,
    focusCancel: true
  });

  if (!result.isConfirmed) return;

  const prev = alerts;
  try {
    // Optimistic UI
    setAlerts((curr) => curr.filter(a => a.id !== id));
    await axios.delete(`http://localhost:8000/alerts/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    
    Toast.fire({
      icon: 'success',
      title: t('alertsPage.deleteSuccess') ?? 'Alert gelöscht'
    });
  } catch (e) {    
    setAlerts(prev);
    
    Swal.fire({
      icon: 'error',
      title: t('alertsPage.deleteFailedTitle') ?? 'Löschen fehlgeschlagen',
      text: t('alertsPage.deleteFailedText') ?? 'Bitte später erneut versuchen.'
    });
  }
};



  useEffect(() => {
    fetchAlerts();
  }, [auth.token]);

  const formatRule = (a: Alert): string => {
    if (a.message) return a.message;

    const moduleText = t(moduleKeyMap[a.module] ?? '', { defaultValue: a.module });
    const conditionText = t(conditionKeyMap[a.condition] ?? '', { defaultValue: a.condition });

    if (a.field === 'flag' && typeof a.value === 'number') {
      return t('alertsPage.ruleFlag', {
        module: moduleText,
        condition: conditionText,
        flag: flagText(t, a.value)
      }); 
    }

    if (a.metric) {
      const metricText = t(metricKeyMap[a.metric] ?? '', { defaultValue: a.metric });
      return t('alertsPage.ruleMetric', {
        module: moduleText,
        metric: metricText,
        condition: conditionText,
        threshold: a.threshold
      });
    }

    if (a.field) {
      const valueText = a.condition === 'is_null' ? '' : String(a.value ?? '');
      return t('alertsPage.ruleField', {
        module: moduleText,
        field: a.field,
        condition: conditionText,
        value: valueText
      });
    }

    return t('alertsPage.ruleUnknown', { module: moduleText });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="alerts-table-container">
      <h1>{t('alertsPage.title')}</h1>

      <Box mb={4}>
        <AlertForm onSuccess={fetchAlerts} />
      </Box>

      <table className="alerts-table">
        <thead>
          <tr>
            <th>{t('alertsPage.colPatient')}</th>
            <th>{t('alertsPage.colSource')}</th>
            <th>{t('alertsPage.colModule')}</th>
            <th>{t('alertsPage.colRule')}</th>
            <th>{t('alertsPage.colFrequency')}</th>
            <th>{t('alertsPage.colActive')}</th>
            <th>{t('alertsPage.colLastTriggered')}</th>
            <th>{t('alertsPage.colActions')}</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((a) => (
            <tr key={a.id}>
              <td>{a.patient_external_code}</td>
              <td>{a.source ?? t('alertsPage.unknown')}</td>
              <td>{t(moduleKeyMap[a.module] ?? '', { defaultValue: a.module })}</td>
              <td>{formatRule(a)}</td>
              <td>{a.frequency}</td>

              {/* Active: Switch statt Icons */}
              <td className="status-icon">
                <Switch
                  checked={!!a.active}
                  onChange={(e) => updateAlert(a.id, { active: e.target.checked })}
                  inputProps={{ 'aria-label': t('alertsPage.colActive') }}
                />
              </td>

              <td>
                {a.last_triggered
                  ? format(new Date(a.last_triggered), 'd.M.yyyy, HH:mm:ss')
                  : '—'}
              </td>

              {/* Aktionen */}
              <td>
                <Tooltip title={t('alertsPage.delete') ?? 'Löschen'}>
                  <IconButton
                    onClick={() => deleteAlert(a.id)}
                    size="small"
                    sx={{ color: blueGrey[700] }}
                    aria-label={t('alertsPage.delete') ?? 'Delete'}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default AlertsPage;