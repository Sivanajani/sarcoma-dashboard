import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CromsDetailView from './CromsDetailView';
import PromDetailView from './PromDetailView';

const PatientDetailView: React.FC = () => {
  const { t } = useTranslation();
  const { patientId } = useParams();
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
      <h1 className="overview-title">
        {t('patientDetail.title', { id: patientInfo.id })} /{' '}
        {t('patientDetail.patientLabel', { pid: patientInfo.patient_id })}
      </h1>

      {showToggle && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={() => setView('CROM')} className={view === 'CROM' ? 'active-toggle-btn' : 'inactive-toggle-btn'}>CROMs</button>
          <button onClick={() => setView('PROM')} className={view === 'PROM' ? 'active-toggle-btn' : 'inactive-toggle-btn'}>PROMs</button>
        </div>
      )}

      {view === 'CROM' && patientInfo.has_croms && (
        <>
          <CromsDetailView patientId={patientInfo.patient_id} />
        </>
      )}

      {view === 'PROM' && patientInfo.has_proms && (
        <>
          <PromDetailView patientId={patientInfo.patient_id} />
        </>
      )}
    </div>
  );
};

export default PatientDetailView;