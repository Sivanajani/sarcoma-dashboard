import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

type Props = {
  onSuccess?: () => void;
};

const AlertForm = ({ onSuccess }: Props) => {
  const { t } = useTranslation();

  const moduleOptionsMap = {
    croms: [
      { value: 'diagnoses', label: t('modules.diagnosis') },
      { value: 'pathologies', label: t('modules.pathology') },
      { value: 'surgeries', label: t('modules.surgery') },
      { value: 'radiology_exams', label: t('modules.radiology_exam') },
      { value: 'radiology_therapies', label: t('modules.radiology_therapy') },
      { value: 'sarcoma_boards', label: t('modules.sarcoma_board') },
      { value: 'systemic_therapies', label: t('modules.systemic_therapy') },
      { value: 'hyperthermia_therapies', label: t('modules.hyperthermia_therapy') },
    ],
    proms: [
      { value: 'eq5d', label: 'EQ-5D' },
      { value: 'proms_proms_biopsy', label: t('promDetail.biopsyTitle') },
    ],
  };

  const conditionOptions = [
    { value: '==', label: t('addAlerts.conditionEquals') },
    { value: '!=', label: t('addAlerts.conditionNotEquals') },
    { value: '<', label: t('addAlerts.conditionLessThan') },
    { value: '>', label: t('addAlerts.conditionGreaterThan') },
    { value: 'is_null', label: t('addAlerts.conditionIsNull') },
    { value: 'contains', label: t('addAlerts.conditionContains') },
    { value: 'not_contains', label: t('addAlerts.conditionNotContains') },
  ];

  const metricOptions = [
    { value: 'completeness', label: t('patientDetail.completeness') },
    { value: 'correctness', label: t('patientDetail.correctness') },
    { value: 'consistency', label: t('patientDetail.consistency') },
    { value: 'actuality', label: t('patientDetail.actuality') },
    { value: 'flag', label: t('addAlerts.metricFlag') },
    { value: 'summary_flag', label: t('addAlerts.metricSummaryFlag') },
  ];

  const auth = useAuth();
  const [source, setSource] = useState<'croms' | 'proms'>('croms');
  const [patientIds, setPatientIds] = useState<string[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [alertType, setAlertType] = useState<'flag' | 'field_check' | 'field_value_check'>('flag');

  const [metric, setMetric] = useState('');
  const [threshold, setThreshold] = useState<number>(60);
  const [condition, setCondition] = useState('');

  const [fields, setFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const [fieldType, setFieldType] = useState<'text' | 'number' | 'boolean' | ''>('');
  const [selectedField, setSelectedField] = useState('');
  const [value, setValue] = useState<string | boolean | number>('');
  const [message, setMessage] = useState('');
  const [patientsOpen, setPatientsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const resetForm = () => {
    setSelectedPatients([]);
    setPatientsOpen(false);

    setSelectedModule('');
    setAlertType('flag');

    setMetric('');
    setThreshold(60);
    setCondition('');

    setFields([]);
    setSelectedFields([]);

    setFieldType('');
    setSelectedField('');
    setValue('');

    setMessage('');
};


  // Felder laden
  useEffect(() => {
    const fetchFields = async () => {
      if (!selectedModule) return;
      try {
        const res = await axios.get<string[]>(
          `http://localhost:8000/api/fields/${source}/${selectedModule}`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setFields(res.data);
      } catch (err) {
        console.error('Fehler beim Laden der Felder', err);
      }
    };
    fetchFields();
  }, [selectedModule, source, auth.token]);

  // Patient:innen laden
  useEffect(() => {
    const fetchIds = async () => {
      try {
        const res = await axios.get<{ prom_ids: string[]; crom_ids: string[] }>(
          'http://localhost:8000/api/patient-ids/all',
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setPatientIds(source === 'croms' ? res.data.crom_ids : res.data.prom_ids);
      } catch (err) {
        console.error('Fehler beim Laden der Patient:innen-IDs', err);
      }
    };
    fetchIds();
  }, [source, auth.token]);

  // Defaults für field_check
  useEffect(() => {
    if (alertType === 'field_check') {
      setMetric('field_check');
      setThreshold(1);
      setCondition('is_null');
      setValue('');
    }
  }, [alertType]);

  // Condition für Flag-Metriken
  useEffect(() => {
    if (alertType === 'flag' && (metric === 'flag' || metric === 'summary_flag')) {
      setCondition('==');
    }
  }, [alertType, metric]);

  // kleiner Helper -> immer native Promise zurückgeben
  const postAlert = (payload: any, headers: Record<string, string>) =>
    Promise.resolve(axios.post('http://localhost:8000/alerts', payload, { headers }).then(r => r.data));

  const handleSubmit = async () => {
    if (!auth.token) return;

    const patientList = selectedPatients.includes('ALL') ? patientIds : selectedPatients;
    const headers = { Authorization: `Bearer ${auth.token}` };

    Swal.fire({
      title: t('alertsPage.save') ?? 'Speichere…',
      html: t('alertsPage.savingDetails') ?? 'Bitte einen Moment Geduld.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    setSubmitting(true);
    const requests: Promise<unknown>[] = [];

    try {
      if (alertType === 'field_check') {
        for (const pid of patientList) {
          for (const f of selectedFields) {
            const payload = {
              source,
              patient_external_code: pid,
              module: selectedModule,
              metric: 'field_check',
              threshold: 1,
              condition: 'is_null',
              field: f,
              email: auth.tokenParsed?.email || '',
              frequency: 'daily',
              active: true,
              message: message || null,
            };
            requests.push(postAlert(payload, headers));
          }
        }
      } else if (alertType === 'field_value_check') {
        for (const pid of patientList) {
          const payload = {
            source,
            patient_external_code: pid,
            module: selectedModule,
            metric: null,
            threshold: 1,
            condition,
            field: selectedField,
            value,
            email: auth.tokenParsed?.email || '',
            frequency: 'daily',
            active: true,
            message: message || null,
          };
          requests.push(postAlert(payload, headers));
        }
      } else {
        // Standard "flag"
        for (const pid of patientList) {
          const payload: any = {
            source,
            patient_external_code: pid,
            module: selectedModule,
            metric,
            threshold,
            condition: (metric === 'flag' || metric === 'summary_flag') ? '==' : condition,
            email: auth.tokenParsed?.email || '',
            frequency: 'daily',
            active: true,
            message: message || null,
          };
          requests.push(postAlert(payload, headers));
        }
      }

      const results = await Promise.allSettled(requests);
      const failed = results.filter(r => r.status === 'rejected').length;

      Swal.close();

      if (failed === 0) {
        await Swal.fire({
          icon: 'success',
          title: t('alertsPage.saved') ?? 'Gespeichert',
          text: t('alertsPage.savedSuccessMessage') ?? 'Die Alert(s) wurden erfolgreich gespeichert.',
          confirmButtonColor: '#3085d6',
        });
        onSuccess?.();
        resetForm();
      } else if (failed < results.length) {
        await Swal.fire({
          icon: 'warning',
          title: t('alertsPage.partialSavedTitle') ?? 'Teilweise gespeichert',
          text: t('alertsPage.partialSavedText') ?? 'Einige Alerts konnten nicht gespeichert werden.',
        });
        onSuccess?.();
        resetForm();
      } else {
        await Swal.fire({
          icon: 'error',
          title: t('alertsPage.error') ?? 'Fehler',
          text: t('alertsPage.savedErrorMessage') ?? 'Die Alerts konnten nicht gespeichert werden.',
          confirmButtonColor: '#d33',
        });
      }
    } catch (err) {
      Swal.close();
      console.error('Fehler beim Speichern der Alerts', err);
      await Swal.fire({
        icon: 'error',
        title: t('alertsPage.error') ?? 'Fehler',
        text: t('alertsPage.savedErrorMessage') ?? 'Die Alerts konnten nicht gespeichert werden.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxWidth={800} p={3}>
      <Typography variant="h6" gutterBottom>
        {t('addAlerts.title')}
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          select
          fullWidth
          label={t('addAlerts.source')}
          value={source}
          onChange={(e) => setSource(e.target.value as 'croms' | 'proms')}
        >
          <MenuItem value="croms">{t('patientDetail.tabs.croms')}</MenuItem>
          <MenuItem value="proms">{t('patientDetail.tabs.proms')}</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label={t('sidebar.patients')}
          value={selectedPatients}
          onChange={(e) => {
            const raw = e.target.value;
            const arr = Array.isArray(raw) ? raw : [raw];
            if (arr.includes('ALL')) {
              setSelectedPatients(['ALL']);
              setPatientsOpen(false);
            } else {
              setSelectedPatients(arr.filter(v => v !== 'ALL'));
            }
          }}
          SelectProps={{
            multiple: true,
            open: patientsOpen,
            onOpen: () => setPatientsOpen(true),
            onClose: () => setPatientsOpen(false),
          }}
        >
          <MenuItem value="ALL">{t('addAlerts.allPatients')}</MenuItem>
          {patientIds.map((id) => (
            <MenuItem key={id} value={id} disabled={selectedPatients.includes('ALL')}>
              {id}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          select
          fullWidth
          label={t('addAlerts.module')}
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          {moduleOptionsMap[source].map((mod) => (
            <MenuItem key={mod.value} value={mod.value}>
              {mod.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label={t('addAlerts.alertType')}
          value={alertType}
          onChange={(e) =>
            setAlertType(e.target.value as 'flag' | 'field_check' | 'field_value_check')
          }
        >
          <MenuItem value="flag">{t('addAlerts.alertTypeFlag')}</MenuItem>
          <MenuItem value="field_check">{t('addAlerts.fieldCheck')}</MenuItem>
          <MenuItem value="field_value_check">{t('addAlerts.fieldValueCheck')}</MenuItem>
        </TextField>
      </Box>

      {alertType === 'flag' && (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            fullWidth
            label={t('addAlerts.metric')}
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            {metricOptions.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>

          {metric === 'flag' || metric === 'summary_flag' ? (
            <TextField
              select
              fullWidth
              label={t('addAlerts.flag')}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            >
              <MenuItem value={2}>{t('addAlerts.redFlag')}</MenuItem>
              <MenuItem value={1}>{t('addAlerts.yellowFlag')}</MenuItem>
            </TextField>
          ) : (
            <>
              <TextField
                select
                fullWidth
                label={t('addAlerts.condition')}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {conditionOptions.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label={t('addAlerts.threshold')}
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
              />
            </>
          )}
        </Box>
      )}

      {alertType === 'field_check' && (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            fullWidth
            label={t('editableField.field')}
            value={selectedFields}
            onChange={(e) => {
              const v = e.target.value;
              setSelectedFields(Array.isArray(v) ? v : [v]);
            }}
            SelectProps={{ multiple: true }}
          >
            {fields.map((f) => (
              <MenuItem key={f} value={f}>
                {t(`databasePage.${f}`, f)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {alertType === 'field_value_check' && (
        <>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              select
              fullWidth
              label={t('addAlerts.fieldType')}
              value={fieldType}
              onChange={(e) => {
                setFieldType(e.target.value as 'text' | 'number' | 'boolean');
                setCondition('==');
                setSelectedField('');
                setValue('');
              }}
            >
              <MenuItem value="text">{t('addAlerts.fieldTypeText')}</MenuItem>
              <MenuItem value="number">{t('addAlerts.fieldTypeNumber')}</MenuItem>
              <MenuItem value="boolean">{t('addAlerts.fieldTypeBoolean')}</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Feld"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              {fields.map((f) => (
                <MenuItem key={f} value={f}>
                  {t(`databasePage.${f}`, f)}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {fieldType === 'number' && (
            <Box display="flex" gap={2} mb={2}>
              <TextField
                select
                fullWidth
                label={t('addAlerts.condition')}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <MenuItem value="==">{t('addAlerts.conditionEquals')}</MenuItem>
                <MenuItem value="!=">{t('addAlerts.conditionNotEquals')}</MenuItem>
                <MenuItem value="<">{t('addAlerts.conditionLessThan')}</MenuItem>
                <MenuItem value=">">{t('addAlerts.conditionGreaterThan')}</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label={t('addAlerts.numberValue')}
                type="number"
                value={typeof value === 'number' ? value : ''}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </Box>
          )}

          {fieldType === 'text' && (
            <TextField
              fullWidth
              label={t('addAlerts.textValue')}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => setValue(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {fieldType === 'boolean' && (
            <TextField
              select
              fullWidth
              label={t('addAlerts.booleanValue')}
              value={String(value)}
              onChange={(e) => setValue(e.target.value === 'true')}
              sx={{ mb: 2 }}
            >
              <MenuItem value="true">{t('yes')}</MenuItem>
              <MenuItem value="false">{t('no')}</MenuItem>
            </TextField>
          )}
        </>
      )}

      <TextField
        fullWidth
        multiline
        rows={2}
        label={t('addAlerts.optionalMessage')}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? (t('alertsPage.savingButton') ?? 'Speichere…') : t('databasePage.save')}
        </Button>
      </Box>
    </Box>
  );
};

export default AlertForm;