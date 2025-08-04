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

type Props = {
  onSuccess?: () => void;
};

const AlertForm = ({ onSuccess }: Props) => {
    const { t } = useTranslation();

    const moduleOptionsMap = {
        croms: [
            { value: 'diagnoses', label: t(`modules.diagnosis`) },
            { value: 'pathologies', label: t(`modules.pathology`) },
            { value: 'surgeries', label: t(`modules.surgery`) },
            { value: 'radiology_exams', label: t(`modules.radiology_exam`) },
            { value: 'radiology_therapies', label: t(`modules.radiology_therapy`) },
            { value: 'sarcoma_boards', label: t(`modules.sarcoma_board`) },
            { value: 'systemic_therapies', label: t(`modules.systemic_therapy`) },
            { value: 'hyperthermia_therapies', label: t(`modules.hyperthermia_therapy`) },
        ],
        proms: [
            { value: 'eq5d', label: 'EQ-5D' },
            { value: 'proms_proms_biopsy', label: t(`promDetail.biopsyTitle`) },
        ],
    };

    const conditionOptions = [
        { value: '==', label: t(`addAlerts.conditionEquals`) },
        { value: '!=', label: t(`addAlerts.conditionNotEquals`)},
        { value: '<', label: t(`addAlerts.conditionLessThan`) },
        { value: '>', label: t(`addAlerts.conditionGreaterThan`) },
        { value: 'is_null', label: t(`addAlerts.conditionIsNull`) },
        { value: 'contains', label: t(`addAlerts.conditionContains`) },
        { value: 'not_contains', label: t(`addAlerts.conditionNotContains`) },
    ];

    const metricOptions = [
        { value: 'completeness', label: t(`patientDetail.completeness`) },
        { value: 'correctness', label: t(`patientDetail.correctness`) },
        { value: 'consistency', label: t(`patientDetail.consistency`) },
        { value: 'actuality', label: t(`patientDetail.actuality`) },
        { value: 'flag', label: t(`addAlerts.metricFlag`) },
        { value: 'summary_flag', label: t(`addAlerts.metricSummaryFlag`) },
    ];

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
            onChange={(e) => setAlertType(e.target.value as 'flag' | 'field_check')}
            >
            <MenuItem value="flag">{t('addAlerts.alertTypeFlag')}</MenuItem>
            <MenuItem value="field_check">{t('addAlerts.fieldCheck')}</MenuItem>
            </TextField>
        </Box>

        {/* UI für flag */}
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

        {/* UI für field_check */}
        {alertType === 'field_check' && (
            <Box display="flex" gap={2} mb={2}>
            <TextField
                select
                fullWidth
                label={t('editableField.field')}
                value={selectedFields}
                onChange={(e) => {
                    const value = e.target.value;
                    setSelectedFields(Array.isArray(value) ? value : [value]);
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

        <Box mt={2}>
            <Button variant="contained" onClick={handleSubmit}>
            {t('databasePage.save')}
            </Button>
        </Box>
        </Box>
    );
    };

    export default AlertForm;