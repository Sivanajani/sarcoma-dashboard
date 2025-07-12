import { useState } from 'react';
import axios from 'axios';
import './DatabasePage.css';
import FormattedModuleData from './FormattedModuleData';
import EditableField from '../components/EditableField';
import EditIcon from '@mui/icons-material/Edit';

const DatabasePage = () => {
  const [externalCode, setExternalCode] = useState('');
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState('');
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [editModules, setEditModules] = useState<Set<string>>(new Set());
  const [editedData, setEditedData] = useState<Record<string, any>>({});

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/patients/by-external-code/${externalCode}`);
      setPatientData(res.data);
      setError('');
      setOpenModules(new Set());
      setEditModules(new Set());
      setEditedData({});
    } catch (err) {
      setError('Patient nicht gefunden oder Serverfehler.');
      setPatientData(null);
    }
  };

  const toggleModuleOpen = (moduleName: string) => {
    const newOpenModules = new Set(openModules);
    if (newOpenModules.has(moduleName)) {
      newOpenModules.delete(moduleName);
    } else {
      newOpenModules.add(moduleName);
    }
    setOpenModules(newOpenModules);
  };

  const toggleEditMode = (moduleName: string, moduleData: any) => {
    const newEditModules = new Set(editModules);
    if (newEditModules.has(moduleName)) {
      newEditModules.delete(moduleName);
    } else {
      newEditModules.add(moduleName);
      setEditedData((prev) => ({
        ...prev,
        [moduleName]: { ...moduleData }
      }));
    }
    setEditModules(newEditModules);
  };

  const handleSave = (moduleName: string) => {
    console.log('Gespeicherte Daten:', editedData[moduleName]);
    const newEditModules = new Set(editModules);
    newEditModules.delete(moduleName);
    setEditModules(newEditModules);
  };

  return (
    <div className="dashboard-main">
      <h1>Datenbank: CROM-Module</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="External Code (z. B. P1)"
          style={{
            backgroundColor: '#f9f9f9',
            color: '#213547',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '1rem',
            width: '280px'
          }}
          value={externalCode}
          onChange={(e) => setExternalCode(e.target.value)}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#4da6ff',
            color: '#fff',
            padding: '10px 18px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          Suchen
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {patientData && patientData.modules && (
        <div>
          <h2>Patienten-ID: {patientData.patient_id}</h2>
          <p style={{ color: '#213547', fontSize: '1rem' }}>
            Geburtsdatum: {patientData.birth_date}
          </p>

          <div className="module-container">
            {Object.entries(patientData.modules).map(([moduleName, moduleData]) => (
              <div key={moduleName} className="module-card">
                <div className="module-header" onClick={() => toggleModuleOpen(moduleName)}>
                  <h4>{moduleName}</h4>
                  <span>{openModules.has(moduleName) ? '▲' : '▼'}</span>
                </div>

                {openModules.has(moduleName) && (
                  <div className="module-card-body">
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => toggleEditMode(moduleName, moduleData)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          marginBottom: '0.5rem',
                          color: '#4da6ff'
                        }}
                        title="Bearbeiten"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                    </div>

                    {editModules.has(moduleName) ? (
                      <div className="edit-form">
                        {Object.entries(editedData[moduleName] || {}).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: 'bold', display: 'block' }}>{key.replace(/_/g, ' ')}:</label>
                                <EditableField
                                value={value}
                                onChange={(newVal) =>
                                    setEditedData((prev) => ({
                                        ...prev,
                                        [moduleName]: {
                                            ...prev[moduleName],            
                                            [key]: newVal          
                                        }
                                    }))
                                }
                            />
                        </div>
                    ))}

                        <button
                          onClick={() => handleSave(moduleName)}
                          style={{
                            backgroundColor: '#4caf50',
                            color: '#fff',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '0.5rem'
                          }}
                        >
                          Speichern
                        </button>
                      </div>
                    ) : (
                      moduleData ? (
                        <FormattedModuleData data={moduleData} />
                      ) : (
                        <p style={{ color: '#999' }}>Keine Daten vorhanden</p>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabasePage;