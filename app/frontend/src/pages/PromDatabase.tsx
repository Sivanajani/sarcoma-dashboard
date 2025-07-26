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

const PromDatabase = () => {
  const [pid, setPid] = useState('');
  const [moduleData, setModuleData] = useState<any>({});
  const [error, setError] = useState('');
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [editModules, setEditModules] = useState<Set<string>>(new Set());
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const { t } = useTranslation();

  const handleSearch = async () => {
    try {
      const [eq5dRes, biopsyRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/eq5d/by-pid/${pid}`),
        axios.get(`http://localhost:8000/api/biopsy/by-pid/${pid}`)
      ]);
      setModuleData({ eq5d: eq5dRes.data, biopsy: biopsyRes.data });
      setError('');
      setOpenModules(new Set());
      setEditModules(new Set());
      setEditedData({});
    } catch (err) {
      setError(t("databasePage.notFound"));
      setModuleData({});
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

 const handleSave = async (entryKey: string) => {
  const dataToSave = editedData[entryKey];
  const moduleName = entryKey.split("-")[0];
  const rowId = dataToSave?.row_id ?? dataToSave?.biopsy_row_id;

  if (!rowId) {
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
    const endpoint = `http://localhost:8000/api/${moduleName}/${rowId}`;
    await axios.put(endpoint, cleanedData);

    const newSet = new Set(editModules);
    newSet.delete(entryKey);
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
      <h2>{t("databasePage.promTitle")}</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t("databasePage.searchPlaceholder")}
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>
          {t("databasePage.searchButton")}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {Object.keys(moduleData).length > 0 && (
        <div className="module-container">
          {Object.entries(moduleData).map(([moduleName, entries]) => (
            <div key={moduleName} className="module-card">
              <div className="module-header" onClick={() => toggleModuleOpen(moduleName)}>
                <h4>{t(`modules.${moduleName}`, { defaultValue: moduleName })}</h4>
                {openModules.has(moduleName) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>

              {openModules.has(moduleName) && (
                <div className="module-card-body">
                  {Array.isArray(entries) && entries.length > 0 ? (
                    entries.map((entry: any, index: number) => (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <button onClick={() => toggleEditMode(`${moduleName}-${index}`, entry)}>
                            <EditIcon fontSize="small" />
                          </button>
                        </div>

                        {editModules.has(`${moduleName}-${index}`) ? (
                          <div className="edit-form">
                            {(() => {
                                const currentKey = `${moduleName}-${index}`;
                                return Object.entries(editedData[currentKey] || {})
                                .filter(([key]) => key !== 'pid' && key !== 'row_id') // ← diese Zeile ist neu
                                .map(([key, value]) => (
                                  <div key={key}>
                                    <label>{key.replace(/_/g, ' ')}:</label>
                                    <EditableField
                                      value={value}
                                      onChange={(newVal) =>
                                        setEditedData((prev) => ({
                                          ...prev,
                                          [currentKey]: {
                                            ...prev[currentKey],
                                            [key]: newVal
                                          }
                                        }))
                                      }
                                    />
                                  </div>
                                ));
                            })()}

                            <button onClick={() => handleSave(`${moduleName}-${index}`)}>
                              {t("databasePage.save")}
                            </button>
                          </div>
                        ) : (
                          <FormattedModuleData data={entry as Record<string, any>} moduleName={`${moduleName}Fields`} />
                        )}
                      </div>
                    ))
                  ) : (
                    <p>{t("databasePage.noData")}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromDatabase;