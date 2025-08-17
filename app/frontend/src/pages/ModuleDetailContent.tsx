/**
 * ModuleDetailContent.tsx
 *
 * Zweck:
 * - Detaillierte Darstellung der Qualitätsdimensionen (Vollständigkeit, Korrektheit,
 *   Konsistenz, Aktualität) für ein einzelnes Modul.
 * - Visuelle Hervorhebung des Scores und Anzeige fehlender oder fehlerhafter Felder.
 *
 * Props:
 * - `dimension`: Name der Qualitätsdimension (z. B. "completeness", "correctness", "consistency", "actuality").
 * - `dimensionData`: Datenobjekt für die gewählte Dimension mit Score, Summary und Detailfeldern.
 * - `moduleData`: Ursprüngliche Rohdaten des Moduls (aktuell nicht direkt verwendet, aber für Erweiterungen vorgesehen).
 *
 * Hauptlogik:
 * - `score` wird dynamisch aus `dimensionData` ermittelt (`<dimension>_score` oder `percent`).
 * - `getScoreColor`: Weist dem Score eine Farbe zu:
 *    - Rot (<50 %)
 *    - Orange (<85 %)
 *    - Grün (≥85 %)
 * - `translateField`: Holt Übersetzungen aus `databasePage.<field>`; bei Konsistenz-Regeln aus `consistencyRules.<field>`.
 *
 * Anzeige je Dimension:
 * - **Vollständigkeit (`completeness`)**:
 *    - Zeigt `fields_filled / fields_total`.
 *    - Listet fehlende Felder (`missing_fields`) rot markiert auf.
 * - **Korrektheit (`correctness`)**:
 *    - Zeigt `summary`.
 *    - Listet alle Felder mit Wert `false` als fehlerhaft auf.
 * - **Konsistenz (`consistency`)**:
 *    - Analog zu Korrektheit, aber mit Übersetzungen aus `consistencyRules`.
 * - **Aktualität (`actuality`)**:
 *    - Zeigt `days_since_update`.
 *
 * Übersetzungen:
 * - Alle Labels und Texte werden mit `react-i18next` geladen.
 *
 * Styling:
 * - Score im Titel farbig gemäss Qualitätswert.
 * - Listen mit fehlenden/fehlerhaften Feldern als `<ul>` mit roter Markierung.
 *
 * Beispiel:
 * ```tsx
 * <ModuleDetailContent
 *   dimension="completeness"
 *   dimensionData={{
 *     completeness_score: 80,
 *     fields_filled: 8,
 *     fields_total: 10,
 *     missing_fields: ["tumor_size", "diagnosis_date"]
 *   }}
 *   moduleData={module}
 * />
 * ```
 */


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