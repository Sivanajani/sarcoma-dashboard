import React, { useEffect, useState } from 'react';
import './PatientQualityTable.css';
import { useTranslation } from 'react-i18next';

type PatientQuality = {
  patient_id: string;
  completeness?: number;
  correctness?: number;
  consistency?: number;
  timeliness?: number;
  uniqueness?: number;
  plausibility?: number;
};

const getColorClass = (value?: number): string => {
  if (value === undefined) return '';
  if (value >= 90) return 'green';
  if (value >= 70) return 'yellow';
  return 'red';
};

const PatientQualityTable: React.FC = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<PatientQuality[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients`)
      .then((res) => res.json())
      .then((data) => {
        const initializedPatients: PatientQuality[] = data.map((p: { patient_id: string }) => ({
          patient_id: p.patient_id,
          completeness: undefined,
          correctness: undefined,
          consistency: undefined,
          timeliness: undefined,
          uniqueness: undefined,
          plausibility: undefined,
        }));
        setPatients(initializedPatients);
      })
      .catch((err) => {
        console.error('Fehler beim Laden der Patienten:', err);
      });
  }, []);

  return (
    <div className="patient-quality-table">
      <h2 className="overview-title">{t('patientTable.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('patientTable.headers.id')}</th>
            <th>{t('patientTable.headers.completeness')}</th>
            <th>{t('patientTable.headers.correctness')}</th>
            <th>{t('patientTable.headers.consistency')}</th>
            <th>{t('patientTable.headers.timeliness')}</th>
            <th>{t('patientTable.headers.uniqueness')}</th>
            <th>{t('patientTable.headers.plausibility')}</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.patient_id}>
              <td>{p.patient_id}</td>
              <td className={`value ${getColorClass(p.completeness)}`}>
                {p.completeness !== undefined ? `${p.completeness}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.correctness)}`}>
                {p.correctness !== undefined ? `${p.correctness}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.consistency)}`}>
                {p.consistency !== undefined ? `${p.consistency}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.timeliness)}`}>
                {p.timeliness !== undefined ? `${p.timeliness}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.uniqueness)}`}>
                {p.uniqueness !== undefined ? `${p.uniqueness}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.plausibility)}`}>
                {p.plausibility !== undefined ? `${p.plausibility}%` : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientQualityTable;