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

const moduleOptionsMap = {
  croms: [
    { value: 'diagnoses', label: 'Diagnosen' },
    { value: 'pathologies', label: 'Pathologie' },
    { value: 'surgeries', label: 'Chirurgie' },
    { value: 'radiology_exams', label: 'Radiologie-Untersuchungen' },
    { value: 'radiology_therapies', label: 'Radiotherapie' },
    { value: 'sarcoma_boards', label: 'Tumorboards' },
    { value: 'systemic_therapies', label: 'Systemtherapien' },
    { value: 'hyperthermia_therapies', label: 'Hyperthermie' },
  ],
  proms: [
    { value: 'eq5d', label: 'EQ-5D' },
    { value: 'proms_proms_biopsy', label: 'PROM Biopsie' },
  ],
};

const conditionOptions = [
  { value: '==', label: 'ist gleich' },
  { value: '!=', label: 'ist ungleich' },
  { value: '<', label: 'kleiner als' },
  { value: '>', label: 'grösser als' },
  { value: 'is_null', label: 'ist leer / nicht ausgefüllt' },
  { value: 'contains', label: 'enthält' },
  { value: 'not_contains', label: 'enthält nicht' },
];

const metricOptions = [
  { value: 'completeness', label: 'Vollständigkeit' },
  { value: 'correctness', label: 'Inhaltliche Korrektheit' },
  { value: 'consistency', label: 'Konsistenz' },
  { value: 'actuality', label: 'Aktualität' },
  { value: 'flag', label: 'Modul-Flag (Rot/Gelb)' },
  { value: 'summary_flag', label: 'Patienten-Flag (Rot/Gelb)' },
];

type Props = {
  onSuccess?: () => void;
};

const AlertForm = ({ onSuccess }: Props) => {
  const auth = useAuth();
  const [source, setSource] = useState<'croms' | 'proms'>('croms');
  const [patientIds, setPatientIds] = useState<string[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [alertType, setAlertType] = useState<'flag' | 'field_check'>('flag');

  const [metric, setMetric] = useState('');
  const [threshold, setThreshold] = useState<number>(60);
  const [condition, setCondition] = useState('');
  const [,setValue] = useState<string | boolean>('');

  const [fields, setFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Feldliste laden
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

  // Automatisches Setzen bei field_check
  useEffect(() => {
    if (alertType === 'field_check') {
      setMetric('field_check');
      setThreshold(1);
      setCondition('is_null');
      setValue('');
    }
  }, [alertType]);

  const handleSubmit = async () => {
    if (alertType === 'field_check') {
      for (const f of selectedFields) {
        const payload = {
          source,
          patient_external_code: selectedPatient,
          module: selectedModule,
          metric: 'field_check',
          threshold: 1,
          condition: 'is_null',
          field: f,
          email: auth.tokenParsed?.email || '',
          frequency: 'daily',
          active: true,
        };

        try {
          await axios.post('http://localhost:8000/alerts', payload, {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
        } catch (error) {
          console.error(`Fehler beim Erstellen des Alerts für Feld ${f}`, error);
        }
      }
      if (onSuccess) onSuccess();
      return;
    }

    // Standard "flag"-Alert
    const payload: any = {
      source,
      patient_external_code: selectedPatient,
      module: selectedModule,
      metric,
      threshold,
      condition,
      email: auth.tokenParsed?.email || '',
      frequency: 'daily',
      active: true,
    };

    try {
      await axios.post('http://localhost:8000/alerts', payload, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Fehler beim Erstellen des Alerts', error);
    }
  };

  return (
    <Box maxWidth={800} p={3}>
      <Typography variant="h6" gutterBottom>
        Alert erstellen
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          select
          fullWidth
          label="Quelle"
          value={source}
          onChange={(e) => setSource(e.target.value as 'croms' | 'proms')}
        >
          <MenuItem value="croms">CROMs</MenuItem>
          <MenuItem value="proms">PROMs</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Patient:in"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          {patientIds.map((id) => (
            <MenuItem key={id} value={id}>
              {id}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          select
          fullWidth
          label="Modul"
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
          label="Alert-Typ"
          value={alertType}
          onChange={(e) => setAlertType(e.target.value as 'flag' | 'field_check')}
        >
          <MenuItem value="flag">Flag oder Daten-Dimension</MenuItem>
          <MenuItem value="field_check">Feld prüfen (leere Werte)</MenuItem>
        </TextField>
      </Box>

      {/* UI für flag */}
      {alertType === 'flag' && (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            fullWidth
            label="Metrik"
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
              label="Flagge"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            >
              <MenuItem value={2}>Red Flag</MenuItem>
              <MenuItem value={1}>Yellow Flag</MenuItem>
            </TextField>
          ) : (
            <>
              <TextField
                select
                fullWidth
                label="Bedingung"
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
                label="Schwellenwert"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
              />
            </>
          )}
        </Box>
      )}

      {/* UI für field_check */}
      {alertType === 'field_check' && (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            fullWidth
            label="Feld(er)"
            value={selectedFields}
            onChange={(e) => {
                const value = e.target.value;
                setSelectedFields(Array.isArray(value) ? value : [value]);
            }}

            SelectProps={{ multiple: true }}
          >
            {fields.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          Speichern
        </Button>
      </Box>
    </Box>
  );
};

export default AlertForm;