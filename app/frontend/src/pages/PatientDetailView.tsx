import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../pages/ModuleCard.css';
import type { QualityMetrics } from '../types/metrics';


const PatientDetailView: React.FC = () => {
  const { t } = useTranslation();
  const { patientId } = useParams();
  const [modules, setModules] = useState<QualityMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientInfo, setPatientInfo] = useState<{ id: number; patient_id: string } | null>(null);

  const getCompletenessClass = (value: number) => {
    if (value >= 90) return 'completeness-green';
    if (value >= 60) return 'completeness-yellow';
    return 'completeness-red';
  };


  useEffect(() => {
    if (!patientId) return;

    // Lade vorberechnete Modul-Metriken aus dem Backend
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${patientId}/module-metrics`)
    .then((res) => res.json())
    .then((data) => {
      setModules(data); // direkt nutzbar, da das Backend schon name, completeness etc. liefert
      setLoading(false);
    })

      .catch((err) => {
        console.error('Fehler beim Laden der Module:', err);
        setError(t('patientDetail.error'));
        setLoading(false);
      });

    // Lade patient_id
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${patientId}`)
      .then((res) => res.json())
      .then((data) => setPatientInfo(data))
      .catch((err) => {
        console.error('Fehler beim Laden der Patient-Info:', err);
        setPatientInfo(null);
      });
  }, [patientId, t]);

  if (loading) return <p>{t('patientDetail.loading')}</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="overview-title">
        {t('patientDetail.title', { id: `${patientInfo?.id}` })} /{' '}
        {t('patientDetail.patientLabel', { pid: patientInfo?.patient_id })}
      </h1>

      {modules.length === 0 ? (
        <p>{t('patientDetail.noModules')}</p>
      ) : (
        <div className="module-container">
          {modules.map((mod) => (
            <div key={mod.name} className="module-card">
              <h4>{mod.name}</h4>
              <p className={`highlight ${getCompletenessClass(mod.completeness)}`}>
                {t('patientDetail.completeness')}: {mod.completeness}%
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
