import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type ModuleData = Record<string, any>;

type ModuleQuality = {
  name: string;
  completeness: number;
  fieldsFilled: number;
  fieldsTotal: number;
};

const getCompleteness = (module: ModuleData, expectedKeys: string[]): ModuleQuality => {
  const fieldsFilled = expectedKeys.filter(
    (key) => module[key] !== null && module[key] !== undefined && module[key] !== ''
  ).length;
  const completeness = Math.round((fieldsFilled / expectedKeys.length) * 100);

  return {
    name: '',
    completeness,
    fieldsFilled,
    fieldsTotal: expectedKeys.length
  };
};

const completenessRules: Record<string, string[]> = {
  diagnosis: ['tumor_diagnosis', 'patient_history', 'diagnosis_ecog', 'last_contact_date', 'last_status'],
  systemic_therapy: ['reason', 'treatment_line', 'cycle_start_date', 'cycle_end_date'],
  pathology: ['data_entry_type', 'who_diagnosis', 'registrate_date'],
  sarcoma_board: ['presentation_date', 'reason_for_presentation', 'question', 'summary']
};

const PatientDetailView: React.FC = () => {
  const { t } = useTranslation();
  const { patientId } = useParams();
  const [modules, setModules] = useState<ModuleQuality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${patientId}/modules`)
      .then((res) => res.json())
      .then((data) => {
        const modData = data.modules;
        const processed: ModuleQuality[] = [];

        for (const [modName, modValue] of Object.entries(modData)) {
          if (typeof modValue === 'object' && modValue !== null) {
            const ruleKeys = completenessRules[modName] ?? Object.keys(modValue);
            const result = getCompleteness(modValue, ruleKeys);
            result.name = modName;
            processed.push(result);
          }
        }

        setModules(processed);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fehler beim Laden:', err);
        setError('Fehler beim Laden der Patientendaten.');
        setLoading(false);
      });
  }, [patientId]);

  if (loading) return <p>Lade Patientendaten...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{t('patientDetail.title', { id: patientId })}</h1>
      {modules.length === 0 ? (
        <p>{t('patientDetail.noModules')}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {modules.map((mod) => (
            <div key={mod.name} style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '0.5rem',
              minWidth: '200px',
              backgroundColor: mod.completeness >= 90 ? '#d4edda' : mod.completeness >= 70 ? '#fff3cd' : '#f8d7da'
            }}>
              <h4>{mod.name}</h4>
              <p><strong>{t('patientDetail.completeness')}:</strong> {mod.completeness}%</p>
              <p>{mod.fieldsFilled} {t('patientDetail.of')} {mod.fieldsTotal} {t('patientDetail.fields')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDetailView;