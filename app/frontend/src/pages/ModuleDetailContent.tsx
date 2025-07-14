import './ModuleCard.css';

interface ModuleDetailContentProps {
  dimension: string;
  dimensionData: Record<string, any>;
}

const ModuleDetailContent = ({ dimension, dimensionData }: ModuleDetailContentProps) => {
  const getScore = () => {
  const scoreKey = `${dimension}_score`;

  // 1. Direkter Backend-Wert (z. B. actuality_score)
  if (dimensionData) {
    if (dimensionData[scoreKey] !== undefined) {
      return Math.round(dimensionData[scoreKey]);
    }
    // 1b. Alternative: 'percent' verwenden (z. B. bei correctness)
    if (dimensionData['percent'] !== undefined) {
      return Math.round(dimensionData['percent']);
    }
  }

  // 2. Vollständigkeit: Felder befüllt / total
  if (dimension === "completeness" && dimensionData?.fields_filled !== undefined && dimensionData?.fields_total !== undefined) {
    return Math.round((dimensionData.fields_filled / dimensionData.fields_total) * 100);
  }

  // 3. Fallback: Anzahl true-Werte bei boolean-Feldern
  const entries = Object.entries(dimensionData).filter(([_, value]) => typeof value === 'boolean');
  const total = entries.length;
  const valid = entries.filter(([_, value]) => value === true).length;
  return total > 0 ? Math.round((valid / total) * 100) : 0;
};


  const getScoreColor = (score: number) => {
    if (score < 50) return 'red';
    if (score < 85) return 'orange';
    return 'green';
  };

  const score = getScore();

  return (
    <>
      <h3 style={{ color: getScoreColor(score) }}>
        {dimension.charAt(0).toUpperCase() + dimension.slice(1)} – {score}%
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
            // Scores und technische Metadaten ausblenden
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