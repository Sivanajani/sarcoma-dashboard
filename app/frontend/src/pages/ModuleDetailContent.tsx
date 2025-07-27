import './ModuleCard.css';

interface ModuleDetailContentProps {
  dimension: string;
  dimensionData: Record<string, any>;
}

const ModuleDetailContent = ({ dimension, dimensionData }: ModuleDetailContentProps) => {
  const score =
  dimensionData?.[`${dimension}_score`] ??
  dimensionData?.percent ??
  null;

  const getScoreColor = (score: number) => {
    if (score < 50) return 'red';
    if (score < 85) return 'orange';
    return 'green';
  };

  return (
  <>
    <h3 style={{ color: getScoreColor(score ?? 0) }}>
      {dimension.charAt(0).toUpperCase() + dimension.slice(1)} – {score !== null ? `${score}%` : '–'}
    </h3>

    {dimension === "completeness" ? (
      <>
        <p>Felder befüllt: {dimensionData.fields_filled} / {dimensionData.fields_total}</p>
        {dimensionData.missing_fields?.length > 0 && (
          <>
            <p>Fehlende Felder:</p>
            <ul>
              {dimensionData.missing_fields.map((field: string) => (
                <li key={field} style={{ color: '#c00' }}>{field}</li>
              ))}
            </ul>
          </>
        )}
      </>
    ) : (
      <ul>
        {Object.entries(dimensionData).map(([key, value]) => {
          if (key.endsWith('_score') || key === 'reason') return null;

          let display;
          if (value === true) {
            display = <span style={{ color: 'green' }}>{key}: ✅</span>;
          } else if (value === false) {
            display = <span style={{ color: 'red' }}>{key}: ❌</span>;
          } else if (value === null || value === '-') {
            display = <span style={{ color: '#666' }}>{key}: –</span>;
          } else {
            display = <span>{key}: {String(value)}</span>;
          }

          return <li key={key}>{display}</li>;
        })}
      </ul>
    )}
  </>
);
};

export default ModuleDetailContent;