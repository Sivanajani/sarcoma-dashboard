/**
 * PromDatabase.tsx
 *
 * Zweck:
 * - Frontend-Adminansicht für den Direktzugriff auf PROM-Daten (Patient Reported Outcome Measures).
 * - Ermöglicht Suche, Ansicht und Bearbeitung von PROM-Modulen (eq5d & biopsy) pro Patient:in.
 *
 * Hauptfunktionen:
 * 1. **Patientensuche**
 *    - Eingabe einer Patient:innen-ID (`pid`) in ein Suchfeld.
 *    - Abfrage der Daten parallel für beide PROM-Module:
 *        - `/api/eq5d/by-pid/{pid}`
 *        - `/api/biopsy/by-pid/{pid}`
 *    - Speicherung der Ergebnisse in `moduleData`.
 *    - Anzeige einer Fehlermeldung, falls kein Treffer gefunden wird.
 *
 * 2. **Modul-Ansicht**
 *    - Module werden in Karten (`module-card`) dargestellt.
 *    - Auf-/Zuklappen einzelner Module per Klick auf den Header (`toggleModuleOpen`).
 *
 * 3. **Bearbeitungsmodus**
 *    - Aktivierung über Edit-Icon (`toggleEditMode`).
 *    - Im Bearbeitungsmodus (`editModules`) werden die Felder mit `EditableField`-Komponenten angezeigt.
 *    - Änderungen werden lokal in `editedData` gespeichert.
 *
 * 4. **Speichern von Änderungen**
 *    - Klick auf „Speichern“ löst `handleSave()` aus.
 *    - Führt eine Bestätigungsabfrage via SweetAlert2 durch.
 *    - Sendet PUT-Request an den API-Endpunkt `/api/{module}/{rowId}` mit den bereinigten Felddaten.
 *    - Aktualisiert nach erfolgreichem Speichern die Ansicht mit `handleSearch()`.
 *
 * 5. **UI-Elemente**
 *    - **Suchfeld & Button**: Sucht Patient:in per Eingabe oder Enter-Taste.
 *    - **Aufklappbare Modul-Karten**: Zeigen entweder formatierten Read-Only-View (`FormattedModuleData`)
 *      oder Editiermaske (`EditableField`).
 *    - **Icons**:
 *        - EditIcon → Bearbeitung starten/beenden
 *        - ExpandMore/LessIcon → Modul auf-/zuklappen
 *    - **SweetAlert2** für Bestätigung, Erfolg- und Fehlermeldungen.
 *
 * State-Variablen:
 * - `pid` → Aktuelle Patient:innen-ID im Suchfeld.
 * - `moduleData` → PROM-Daten nach Modulen.
 * - `error` → Fehlermeldung bei fehlenden Daten.
 * - `openModules` → Set der aktuell geöffneten Module.
 * - `editModules` → Set der aktuell im Bearbeitungsmodus befindlichen Module/Einträge.
 * - `editedData` → Zwischenspeicher für geänderte Felder.
 *
 * Anwendungsfall:
 * - Geeignet für Admins oder Datenmanager:innen, um PROM-Daten direkt aus der Datenbank
 *   einzusehen und bei Bedarf zu korrigieren.
 */


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
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/eq5d/by-pid/${pid}`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/biopsy/by-pid/${pid}`)
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
    const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/${moduleName}/${rowId}`;
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
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

      {error && <p className="error">{error}</p>}

      {Object.keys(moduleData).length > 0 && (
        <div className="module-container">
          {Object.entries(moduleData).map(([moduleName, entries]) => (
            <div key={moduleName} className="module-card">
              <div className="module-header" onClick={() => toggleModuleOpen(moduleName)}>
                <h4>{t(`modules.${moduleName}`, { defaultValue: moduleName.replace(/_/g, ' ') })}</h4>
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
                                .filter(([key]) => key !== 'pid' && key !== 'row_id')
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