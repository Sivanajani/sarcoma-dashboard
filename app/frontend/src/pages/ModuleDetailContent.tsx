import './ModuleCard.css';

interface ModuleDetailContentProps {
  dimension: string;
  dimensionData: Record<string, any>;
}

const ModuleDetailContent = ({ dimension, dimensionData }: ModuleDetailContentProps) => {
  const keys = Object.keys(dimensionData);
  const total = keys.length;
  const validCount = keys.filter((key) => dimensionData[key] === true).length;
  const score = total > 0 ? Math.round((validCount / total) * 100) : 0;

  return (
    <>
      <h3>{dimension.charAt(0).toUpperCase() + dimension.slice(1)} – {score}%</h3>
      <ul>
        {keys.map((key) => {
          const value = dimensionData[key];

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
    </>
  );
};

export default ModuleDetailContent;