import React from 'react';

interface FormattedModuleDataProps {
  data: Record<string, any>;
}

const FormattedModuleData: React.FC<FormattedModuleDataProps> = ({ data }) => {
  const renderValue = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index} style={{ marginBottom: '0.25rem' }}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k}><strong>{k}:</strong> {renderValue(v)}</div>
          ))}
        </div>
      );
    } else if (typeof value === 'boolean') {
      return value ? 'Ja' : 'Nein';
    } else {
      return value === null || value === '' ? <i style={{ color: '#999' }}>–</i> : String(value);
    }
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '0.5rem' }}>
          <strong>{key.replace(/_/g, ' ')}:</strong> {renderValue(value)}
        </div>
      ))}
    </div>
  );
};

export default FormattedModuleData;