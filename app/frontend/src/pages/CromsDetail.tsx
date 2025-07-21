import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { QualityMetrics } from '../types/metrics';
import '../pages/ModuleCard.css';

interface CromsDetailProps {
  modules: QualityMetrics[];
  patientId: string;
}

const CromsDetail: React.FC<CromsDetailProps> = ({ modules, patientId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getCompletenessClass = (value: number) => {
    if (value >= 90) return 'completeness-green';
    if (value >= 60) return 'completeness-yellow';
    return 'completeness-red';
  };

  const getQualityClass = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '';
    if (value >= 90) return 'completeness-green';
    if (value >= 60) return 'completeness-yellow';
    return 'completeness-red';
  };

  return (
    <div className="module-container">
      {modules.map((mod) => (
        <div key={mod.name} className="module-card" onClick={() => {
          navigate(`/patients/${patientId}/${mod.name}/details`);
        }}
          title={t('patientDetail.moduleCardTooltip')}
          style={{ cursor: 'pointer' }}
        >
          <h4>{mod.name}</h4>
          <p className={`highlight ${getCompletenessClass(mod.completeness)}`}>
            {t('patientDetail.completeness')}: {mod.completeness}%
          </p>
          {mod.correctness !== undefined && (
            <p className={`highlight ${getQualityClass(mod.correctness)}`}>
              {t('patientDetail.correctness')}: {mod.correctness}%
            </p>
          )}
          {mod.consistency !== undefined && (
            <p className={`highlight ${getQualityClass(mod.consistency)}`}>
              {t('patientDetail.consistency')}: {mod.consistency}%
            </p>
          )}
          {mod.actuality !== undefined && (
            <p className={`highlight ${getQualityClass(mod.actuality)}`}>
              {t('patientDetail.actuality')}: {mod.actuality}%
            </p>
          )}
          <p>
            {mod.fieldsFilled} {t('patientDetail.of')} {mod.fieldsTotal} {t('patientDetail.fields')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CromsDetail;