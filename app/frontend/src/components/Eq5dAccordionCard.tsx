import React, { useState } from 'react';
import FormattedModuleData from '../pages/FormattedModuleData';
import EditableField from './EditableField';
import { IconButton, Collapse, Box } from '@mui/material';
import { ExpandMore, ExpandLess, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface Eq5dAccordionCardProps {
  entry: Record<string, any>;
  onSaved?: () => void;
}

const Eq5dAccordionCard: React.FC<Eq5dAccordionCardProps> = ({ entry, onSaved }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ ...entry });

  const toggleOpen = () => setOpen((prev) => !prev);
  const toggleEdit = () => {
    setEditMode(!editMode);
    setEditedData({ ...entry });
  };

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
      cancelButtonText: t('databasePage.confirmNo'),
    });

    if (!confirmed.isConfirmed) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      await axios.put(`${baseUrl}/api/eq5d/${id}`, editedData);
      Swal.fire(t('databasePage.saveSuccessTitle'), t('databasePage.saveSuccessText', { module: 'eq5d' }), 'success');
      setEditMode(false);
      onSaved?.();
    } catch (err) {
      Swal.fire(t('databasePage.saveErrorTitle'), t('databasePage.saveErrorText'), 'error');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f9f9f9',
        padding: 2,
        borderRadius: '12px',
        border: '1px solid #ccc',
        mb: 3,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={toggleOpen}>
        <strong>{t('promDetail.eq5dTitle')}</strong>
        <div>
          <IconButton onClick={(e) => { e.stopPropagation(); toggleEdit(); }}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
      </div>

      <Collapse in={open}>
        <Box mt={2}>
          {editMode ? (
            <>
              {Object.entries(editedData)
                .filter(([key]) => key !== 'pid' && key !== 'eq5d_row_id')
                .map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>{key.replace(/_/g, ' ')}:</label>
                    <EditableField value={value} onChange={(val) => handleChange(key, val)} />
                  </div>
                ))}
              <button
                onClick={handleSave}
                style={{
                  marginTop: '1rem',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#4da6ff',
                  color: 'white',
                  border: 'none',
                }}
              >
                {t('databasePage.save')}
              </button>
            </>
          ) : (
            <FormattedModuleData data={entry} moduleName="eq5dFields" />
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default Eq5dAccordionCard;
