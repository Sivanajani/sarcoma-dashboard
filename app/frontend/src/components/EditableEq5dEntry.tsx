import React, { useState } from 'react';
import EditableField from './EditableField';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface EditableEq5dEntryProps {
  entry: Record<string, any>;
  onSaved?: () => void;
}

const EditableEq5dEntry: React.FC<EditableEq5dEntryProps> = ({ entry, onSaved }) => {
  const [editedData, setEditedData] = useState({ ...entry });
  const { t } = useTranslation();

  const handleChange = (key: string, value: any) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const id = entry.eq5d_row_id ?? entry.row_id ?? null;
    if (!id) {
      Swal.fire(t('databasePage.missingIdTitle'), t('databasePage.missingIdText'), 'error');
      return;
    }

    const confirmed = await Swal.fire({
      title: t('databasePage.confirmTitle'),
      text: t('databasePage.confirmText', { module: 'eq5d' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('databasePage.confirmYes'),
      cancelButtonText: t('databasePage.confirmNo')
    });

    if (!confirmed.isConfirmed) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      await axios.put(`${baseUrl}/api/eq5d/${id}`, editedData);
      Swal.fire(t('databasePage.saveSuccessTitle'), t('databasePage.saveSuccessText', { module: 'eq5d' }), 'success');
      onSaved?.();
    } catch (err) {
      Swal.fire(t('databasePage.saveErrorTitle'), t('databasePage.saveErrorText'), 'error');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      {Object.entries(editedData)
        .filter(([key]) => key !== 'pid' && key !== 'eq5d_row_id')
        .map(([key, value]) => (
          <div key={key} style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>{key.replace(/_/g, ' ')}:</label>
            <EditableField value={value} onChange={(val) => handleChange(key, val)} />
          </div>
        ))}

      <button onClick={handleSave} style={{ marginTop: '1rem', padding: '8px 16px', borderRadius: '6px', backgroundColor: '#4da6ff', color: 'white', border: 'none' }}>
        {t('databasePage.save')}
      </button>
    </div>
  );
};

export default EditableEq5dEntry;
