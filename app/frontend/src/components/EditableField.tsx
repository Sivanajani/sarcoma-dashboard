import React from 'react';

type EditableFieldProps = {
  value: any;
  onChange: (val: any) => void;
};

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange }) => {
  // 🟢 Boolean als Dropdown anzeigen
  if (typeof value === 'boolean') {
    return (
      <select
        value={value ? 'true' : 'false'}
        onChange={(e) => onChange(e.target.value === 'true')}
        style={inputStyle}
      >
        <option value="true">Ja</option>
        <option value="false">Nein</option>
      </select>
    );
  }

  // 🔵 Array mit + / −
  if (Array.isArray(value)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {value.map((val, index) => (
          <div key={index} style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              value={val}
              onChange={(e) => {
                const updated = [...value];
                updated[index] = e.target.value;
                onChange(updated);
              }}
              style={inputStyle}
            />
            <button
              onClick={() => {
                const updated = value.filter((_: any, i: number) => i !== index);
                onChange(updated);
              }}
              style={removeButtonStyle}
              title="Feld entfernen"
            >
              −
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...value, ''])}
          style={addButtonStyle}
          title="Feld hinzufügen"
        >
          + Feld
        </button>
      </div>
    );
  }

  // 🔶 Datumsauswahl (falls ISO-Datum)
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof value === 'string' && isoDateRegex.test(value)) {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    );
  }

  // ⚪ Standard-Textfeld
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    />
  );
};

// 🔧 Style-Objekte
const inputStyle = {
  width: '100%',
  padding: '6px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const addButtonStyle = {
  backgroundColor: '#4da6ff',
  color: 'white',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '4px',
  width: 'fit-content'
};

const removeButtonStyle = {
  backgroundColor: '#ff6666',
  color: 'white',
  border: 'none',
  padding: '0 10px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default EditableField;