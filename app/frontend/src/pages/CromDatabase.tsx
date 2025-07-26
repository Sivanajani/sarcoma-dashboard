import { useState } from 'react';
import axios from 'axios';
import './DatabasePage.css';
import FormattedModuleData from './FormattedModuleData';
import EditableField from '../components/EditableField';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const CromDatabase = () => {
  const [externalCode, setExternalCode] = useState('');
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState('');
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [editModules, setEditModules] = useState<Set<string>>(new Set());
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const { t } = useTranslation();

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/patients/by-external-code/${externalCode}`);
      setPatientData(res.data);
      setError('');
      setOpenModules(new Set());
      setEditModules(new Set());
      setEditedData({});
    } catch (err) {
      setError(t("databasePage.notFound"));
      setPatientData(null);
    }
  };

  const toggleModuleOpen = (moduleName: string) => {
    const newSet = new Set(openModules);
    newSet.has(moduleName) ? newSet.delete(moduleName) : newSet.add(moduleName);
    setOpenModules(newSet);
  };

  const toggleEditMode = (moduleName: string, moduleData: any) => {
    const newSet = new Set(editModules);
    if (newSet.has(moduleName)) {
      newSet.delete(moduleName);
    } else {
      newSet.add(moduleName);
      setEditedData(prev => ({
        ...prev,
        [moduleName]: { ...moduleData }
      }));
    }
    setEditModules(newSet);
  };

  const handleSave = async (moduleName: string) => {
    const dataToSave = editedData[moduleName];

    if (!dataToSave?.id) {
      Swal.fire({
        icon: 'error',
        title: t('databasePage.missingIdTitle'),
        text: t('databasePage.missingIdText')
      });
      return;
    }

    const cleanedData = Object.fromEntries(
      Object.entries(dataToSave).filter(
        ([_, value]) =>
          !(typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0)
      )
    );

    const confirmed = await Swal.fire({
      title: t('databasePage.confirmTitle'),
      text: t('databasePage.confirmText', { module: moduleName }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('databasePage.confirmYes'),
      cancelButtonText: t('databasePage.confirmNo')
    });

    if (!confirmed.isConfirmed) return;

    try {
      const endpoint = `http://localhost:8000/api/${moduleName.replace(/_/g, '-')}/${dataToSave.id}`;
      await axios.put(endpoint, cleanedData);

      const newSet = new Set(editModules);
      newSet.delete(moduleName);
      setEditModules(newSet);
      await handleSearch();

      Swal.fire({
        icon: 'success',
        title: t('databasePage.saveSuccessTitle'),
        text: t('databasePage.saveSuccessText', { module: moduleName })
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: t('databasePage.saveErrorTitle'),
        text: t('databasePage.saveErrorText')
      });
    }
  };

  return (
    <div>
      <h2>{t("databasePage.cromTitle")}</h2>

      {/* Suchleiste */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={t("databasePage.searchPlaceholder")}
          style={{
            backgroundColor: '#f9f9f9',
            color: '#213547',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '1rem',
            width: '280px' }}
          value={externalCode}
          onChange={(e) => setExternalCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { handleSearch();} }}
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
          {t("databasePage.searchButton")}
        </button>
      </div>

      {error && <p className="error">{t("databasePage.notFound")}</p>}

      {patientData?.modules && (
        <>
          <p>{t("databasePage.patientId")}: {patientData.patient_id}</p>
          <p>{t("databasePage.birthDate")}: {patientData.birth_date}</p>

          <div className="module-container">
            {Object.entries(patientData.modules).map(([moduleName, moduleData]) => (
              <div key={moduleName} className="module-card">
                <div className="module-header" onClick={() => toggleModuleOpen(moduleName)}>
                  <h4>{t(`modules.${moduleName}`, { defaultValue: moduleName })}</h4>
                  {openModules.has(moduleName) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>

                {openModules.has(moduleName) && (
                  <div className="module-card-body">
                    <div style={{ textAlign: 'right' }}>
                      <button onClick={() => toggleEditMode(moduleName, moduleData)}>
                        <EditIcon fontSize="small" />
                      </button>
                    </div>

                    {editModules.has(moduleName) ? (
                      <div className="edit-form">
                        {Object.entries(editedData[moduleName] || {}).map(([key, value]) => (
                          <div key={key}>
                            <label>{key.replace(/_/g, ' ')}:</label>
                            <EditableField
                              value={value}
                              onChange={(newVal) =>
                                setEditedData(prev => ({
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

                        <button onClick={() => handleSave(moduleName)}>
                          {t("databasePage.save")}
                        </button>
                      </div>
                    ) : (
                      <FormattedModuleData data={moduleData as Record<string, any>} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CromDatabase;