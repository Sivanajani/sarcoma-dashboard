import React, { useState } from 'react';
import './RawModuleDataTable.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import EditableField from '../components/EditableField';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';




interface RawModuleDataTableProps {
  moduleData: Record<string, any>;
  moduleName: string;
}

const RawModuleDataTable: React.FC<RawModuleDataTableProps> = ({ moduleData, moduleName }) => {
  const [editData, setEditData] = useState({ ...moduleData });
  const [originalData, setOriginalData] = useState({ ...moduleData });
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const hasChanges = JSON.stringify(editData) !== JSON.stringify(originalData);

  const handleChange = (key: string, value: any) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handleCancel = async () => {
    if (hasChanges) {
      const result = await Swal.fire({
        title: t('databasePage.confirmTitle'),
        text: t('databasePage.confirmText'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('databasePage.confirmYes'),
        cancelButtonText: t('databasePage.confirmNo')
      });

      if (result.isConfirmed) {
        handleSave(); 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        setEditData(originalData);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
  if (!editData.id) {
    Swal.fire({
      icon: 'error',
      title: t('databasePage.saveErrorTitle'),
      text: t('databasePage.saveErrorText')
    });
    return;
  }

  const result = await Swal.fire({
    title: t('databasePage.confirmTitle'),
    text: t('databasePage.confirmText', { module: t(`modules.${moduleName}`, { defaultValue: moduleName }) }),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('databasePage.confirmYes'),
    cancelButtonText: t('databasePage.confirmNo')
  });

  if (!result.isConfirmed) return;

  const { id, patient_id, created_at, updated_at, ...rest } = editData;

  const dataToUpdate = Object.fromEntries(
    Object.entries(rest).filter(
      ([_, value]) =>
        !(typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0)
    )
  );

  const endpointMap: Record<string, string> = {
    diagnosis: 'diagnoses',
    surgery: 'surgery',
    pathology: 'pathology',
    radiology_exam: 'radiology-exams',
    radiology_therapy: 'radiology-therapy',
    sarcoma_board: 'sarcoma-board',
    systemic_therapy: 'systemic-therapy',
    hyperthermia_therapies: 'hyperthermia-therapies',
    hyperthermia: 'hyperthermia-therapies',
    patient: 'patient'
  };

  const endpointSegment = endpointMap[moduleName] || moduleName;
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/${endpointSegment}/${editData.id}`;

  try {
    await axios.put(endpoint, dataToUpdate);
    setOriginalData({ ...editData });
    setIsEditing(false);

    await Swal.fire({
      icon: 'success',
      title: t('databasePage.saveSuccessTitle'),
      text: t('databasePage.saveSuccessText', { module: t(`modules.${moduleName}`, { defaultValue: moduleName }) }),
      timer: 1800,
      showConfirmButton: false
    });
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: t('databasePage.saveErrorTitle'),
      text: t('databasePage.saveErrorText')
    });
    console.error('Save failed:', err?.response?.data || err.message);
  }
};


return (
  <div className="raw-module-container">
    {/* Icon-Leiste oben */}
    <div
      style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
      }}
    >
      <h4 className="overview-title">{t("databasePage.moduleDataTitle")}</h4>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {!isEditing ? (
          <IconButton onClick={() => setIsEditing(true)} title={t('databasePage.edit')}>
            <EditIcon sx={{ color: '#333' }} />
          </IconButton>
        ) : (
          <>
            <IconButton
              onClick={hasChanges ? handleSave : undefined}
              disabled={!hasChanges}
              title={t('databasePage.save')}
            >
              <SaveIcon sx={{ color: hasChanges ? '#2e7d32' : '#aaa' }} />
            </IconButton>
            
            <IconButton onClick={handleCancel} title={t('cancel')}>
              <CloseIcon sx={{ color: '#c62828' }} />
            </IconButton>
          </>
        )}
      </div>
    </div>

    {/* Tabelle darunter */}
    <table className="raw-module-table">
      <tbody>
        {Object.entries(editData).map(([key, value]) => {
          if (key === 'id' || key === 'patient_id') return null;
          return (
            <tr key={key}>
              <td className="label-cell">
                {t(`${moduleName}.${key}`, {
                  defaultValue: t(`databasePage.${key}`, {
                    defaultValue: key.replace(/_/g, ' ')
                  })
                })}
              </td>
              <td className="field-value">
                {isEditing ? (
                  <EditableField value={value} onChange={(val) => handleChange(key, val)} />
                ) : Array.isArray(value) ? (
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {value.map((item, idx) => (
                      <li key={idx}>{String(item)}</li>
                    ))}
                  </ul>
                ) : typeof value === 'boolean' ? (
                  t(value ? 'yes' : 'no')
                ) : value === null || value === '' ? (
                  <i style={{ color: '#999' }}>{t('noDataDash')}</i>
                ) : (
                  String(value)
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

};

export default RawModuleDataTable;