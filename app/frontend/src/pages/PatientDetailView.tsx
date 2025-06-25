import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { QualityMetrics } from '../utils/completenessUtils';
import { calculateQualityMetrics } from '../utils/completenessUtils';

const PatientDetailView: React.FC = () => {
  const { t } = useTranslation();
  const { patientId } = useParams();
  const [modules, setModules] = useState<QualityMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientInfo, setPatientInfo] = useState<{ id: number; patient_id: string } | null>(null);

  useEffect(() => {
    if (!patientId) return;

    // Lade die Module
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${patientId}/modules`)
      .then((res) => res.json())
      .then((data) => {
        const modData = data.modules;
        const processed: QualityMetrics[] = [];

        for (const [modName, modValue] of Object.entries(modData)) {
          if (typeof modValue === 'object' && modValue !== null) {
            const result = calculateQualityMetrics(modName, modValue);
            processed.push(result);
          }
        }

        setModules(processed);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fehler beim Laden der Module:', err);
        setError('Fehler beim Laden der Patientendaten.');
        setLoading(false);
      });

    // Lade patient_id (external_code)
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${patientId}`)
      .then((res) => res.json())
      .then((data) => setPatientInfo(data))
      .catch((err) => {
        console.error('Fehler beim Laden der Patient-Info:', err);
        setPatientInfo(null);
      });
  }, [patientId]);

  if (loading) return <p>Lade Patientendaten...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="overview-title">
        {t('patientDetail.title', { id: `${patientInfo?.id}` })} / Patient: {patientInfo?.patient_id}
      </h1>

      {modules.length === 0 ? (
        <p>{t('patientDetail.noModules')}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {modules.map((mod) => (
            <div
              key={mod.name}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '0.5rem',
                minWidth: '200px',
                backgroundColor:
                  mod.completeness >= 90
                    ? '#d4edda'
                    : mod.completeness >= 70
                    ? '#fff3cd'
                    : '#f8d7da',
              }}
            >
              <h4>{mod.name}</h4>
              <p>
                <strong>{t('patientDetail.completeness')}:</strong> {mod.completeness}%
              </p>
              <p>
                {mod.fieldsFilled} {t('patientDetail.of')} {mod.fieldsTotal}{' '}
                {t('patientDetail.fields')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDetailView;
