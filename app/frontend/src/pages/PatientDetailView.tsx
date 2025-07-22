import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CromsDetailView from './CromsDetailView';
import PromDetailView from './PromDetailView';
import { Tabs, Tab, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PatientDetailView: React.FC = () => {
  const { t } = useTranslation();
  const { patientId } = useParams();
  const navigate = useNavigate(); // <-- hinzugefügt
  const [patientInfo, setPatientInfo] = useState<{ id: number; patient_id: string; has_proms?: boolean; has_croms?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'PROM' | 'CROM'>('CROM');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${patientId}`);
        const data = await res.json();
        setPatientInfo(data);
        setView(data.has_proms && !data.has_croms ? 'PROM' : 'CROM');
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchPatient();
  }, [patientId]);

  if (loading || !patientInfo) return <p>{t('patientDetail.loading')}</p>;

  const showToggle = patientInfo.has_proms && patientInfo.has_croms;

  return (
    <div style={{ padding: '2rem' }}>
      <div className="flex items-center mb-4">
        <IconButton onClick={() => navigate(-1)} aria-label="back" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <h1 className="overview-title">
          {t('patientDetail.title', { pid: patientInfo.patient_id })}
        </h1>
      </div>

      {showToggle && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={view}
            onChange={(_, newValue) => setView(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={t('patientDetail.tabs.croms')} value="CROM" />
            <Tab label={t('patientDetail.tabs.proms')} value="PROM" />
          </Tabs>
        </Box>
      )}

      {view === 'CROM' && patientInfo.has_croms && (
        <CromsDetailView patientId={patientInfo.patient_id} />
      )}

      {view === 'PROM' && patientInfo.has_proms && (
        <PromDetailView patientId={patientInfo.patient_id} />
      )}
    </div>
  );
};

export default PatientDetailView;