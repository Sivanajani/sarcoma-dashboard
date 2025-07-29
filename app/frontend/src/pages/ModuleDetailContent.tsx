import './ModuleCard.css';
import { useTranslation } from 'react-i18next';

interface ModuleDetailContentProps {
  dimension: string;
  dimensionData: Record<string, any>;
  moduleData: Record<string, any>;
}

const ModuleDetailContent = ({ dimension, dimensionData }: ModuleDetailContentProps) => {
  const { t } = useTranslation();
  const score =
    dimensionData?.[`${dimension}_score`] ??
    dimensionData?.percent ??
    null;

  const getScoreColor = (score: number) => {
    if (score < 50) return 'red';
    if (score < 85) return 'orange';
    return 'green';
  };
  
  const translateField = (key: string) => t(`databasePage.${key}`, key);

  return (
  <>
    {/* Titel mit Score */}
    <h3 style={{ color: getScoreColor(score ?? 0) }}>
      {t(`patientDetail.${dimension}`, dimension)} – {score !== null ? `${score}%` : '–'}
    </h3>


    {/* Inhalte je nach Dimension */}
    {dimension === "completeness" && score !== 100 && (
      <>
    <p>{t('moduleDetail.fieldsFilled')}: {dimensionData.fields_filled} / {dimensionData.fields_total}</p>
    {dimensionData.missing_fields?.length > 0 && (
      <>
        <p>{t('moduleDetail.missingFields')}:</p>
        <ul>
          {dimensionData.missing_fields.map((field: string) => (
            <li key={field} style={{ color: '#c00' }}>{translateField(field)}</li>
          ))}
        </ul>
      </>
    )}
  </>
)}


{dimension === "correctness" && (
  <>
    <p style={{ marginTop: '1rem' }}>
      <strong>{t('moduleDetail.summary')}</strong> {dimensionData.summary || '–'}
    </p>

    {score !== 100 && (
      <ul style={{ marginTop: '0.5rem' }}>
        {Object.entries(dimensionData).map(([key, value]) => {
          if (key === 'summary' || key.endsWith('_score')) return null;
          if (value !== false) return null;

          const translatedKey = translateField(key);
          const symbol = value === false;

          return (
            <li key={key}>
              {translatedKey} {symbol}
            </li>
          );
        })}
      </ul>
    )}
  </>
)}



{dimension === "consistency" && (
  <>
    <p style={{ marginTop: '1rem' }}>
      <strong>{t('moduleDetail.summary')}</strong> {dimensionData.summary || '–'}
    </p>

    {score !== 100 && (
      <ul style={{ marginTop: '0.5rem' }}>
        {Object.entries(dimensionData).map(([key, value]) => {
          if (key === 'summary' || key.endsWith('_score')) return null;
          if (value !== false) return null;

          const translatedKey = t(`consistencyRules.${key}`, key);
          const symbol = value === false;

          return (
            <li key={key}>
              {translatedKey} {symbol}
            </li>
          );
        })}
      </ul>
    )}
  </>
)}



    {dimension === "actuality" && (
      <p style={{ marginTop: '1rem' }}>
        <strong>{t('moduleDetail.daysSinceUpdate')}:</strong> {dimensionData.days_since_update ?? '–'}
      </p>
    )}
  </>
);

};

export default ModuleDetailContent;