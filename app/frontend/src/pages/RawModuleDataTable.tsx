import React, { useState } from 'react';
import './RawModuleDataTable.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import EditableField from '../components/EditableField';


interface RawModuleDataTableProps {
  moduleData: Record<string, any>;
  moduleName: string;
}

const RawModuleDataTable: React.FC<RawModuleDataTableProps> = ({ moduleData, moduleName }) => {  
  const [editData, setEditData] = useState({ ...moduleData });
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const handleChange = (key: string, value: any) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!editData.id) {
      Swal.fire({
        icon: 'error',
        title: t('missingIdTitle'),
        text: t('missingIdText')
      });
      return;
    }

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
      setIsEditing(false);

      Swal.fire({
        icon: 'success',
        title: t('saveSuccessTitle'),
        text: t('saveSuccessText', { module: t(`modules.${moduleName}`, { defaultValue: moduleName }) })
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('saveErrorTitle'),
        text: t('saveErrorText')
      });
      console.error('Save failed:', err?.response?.data || err.message);
    }
  };

  return (
    <>
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
                  ) : (
                    <>
                      {Array.isArray(value) ? (
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
                      </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>{t('databasePage.edit')}</button>
        ) : (
          <button onClick={handleSave}>{t('databasePage.save')}</button>
        )}
      </div>
    </>
  );
};

export default RawModuleDataTable;