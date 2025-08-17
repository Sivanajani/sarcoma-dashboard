/**
 * BiopsyAccordionCard.tsx
 *
 * Zweck:
 * - Accordion-Komponente zur Anzeige und Bearbeitung von Biopsie-Daten eines einzelnen Eintrags
 * - Wird typischerweise in der PROM-Detailansicht (Biopsy) verwendet
 *
 * Features:
 * - Auf-/Zuklappen per Klick auf Header
 * - Editiermodus (umschaltbar) für bearbeitbare Felder
 * - Bearbeitung nur bestimmter Felder (exkl. IDs, Name, E-Mail)
 * - Übersetzte Feldlabels via i18next
 * - Speicherung der Änderungen per PUT-Request an das Backend (`/api/biopsy/:id`)
 * - SweetAlert2 für Bestätigung, Erfolgs- und Fehlermeldungen
 *
 * Props:
 * - entry: Record<string, any>
 *   → Datensatz (Backend-Response) mit allen Biopsie-Feldern
 * - onSaved?: () => void
 *   → Optionaler Callback nach erfolgreichem Speichern
 * - defaultOpen?: boolean
 *   → Legt fest, ob Accordion initial geöffnet ist
 *
 * Interner State:
 * - open: Steuert Auf-/Zuklappen
 * - editMode: Steuert Bearbeitungsmodus
 * - editedData: Kopie von `entry` für lokale Änderungen
 *
 * Abhängigkeiten:
 * - @mui/material (Box, Collapse, IconButton)
 * - Icons: ExpandMore, ExpandLess, Edit
 * - EditableField (Inline-Eingabefeld)
 * - FormattedModuleData (Read-Only-Ansicht)
 * - sweetalert2
 * - axios
 * - i18next
 *
 * Typische Verwendung:
 * <BiopsyAccordionCard entry={biopsyEntry} onSaved={refreshData} defaultOpen />
 */


import React, { useState } from 'react';
import { IconButton, Collapse, Box } from '@mui/material';
import { ExpandMore, ExpandLess, Edit } from '@mui/icons-material';
import EditableField from './EditableField';
import FormattedModuleData from '../pages/FormattedModuleData';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface BiopsyAccordionCardProps {
  entry: Record<string, any>;
  onSaved?: () => void;
  defaultOpen?: boolean;
}

const BiopsyAccordionCard: React.FC<BiopsyAccordionCardProps> = ({ entry, onSaved, defaultOpen  }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ ...entry });

  const toggleOpen = () => setOpen(prev => !prev);
  const toggleEdit = () => {
    setEditMode(!editMode);
    setEditedData({ ...entry });
  };

  const handleChange = (key: string, value: any) => {
    setEditedData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const id = entry.biopsy_row_id;
    if (!id) {
      Swal.fire(t('databasePage.missingIdTitle'), t('databasePage.missingIdText'), 'error');
      return;
    }

    const confirmed = await Swal.fire({
      title: t('databasePage.confirmTitle'),
      text: t('databasePage.confirmText', { module: 'biopsy' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('databasePage.confirmYes'),
      cancelButtonText: t('databasePage.confirmNo'),
    });

    if (!confirmed.isConfirmed) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      await axios.put(`${baseUrl}/api/biopsy/${id}`, editedData);
      Swal.fire(t('databasePage.saveSuccessTitle'), t('databasePage.saveSuccessText', { module: 'biopsy' }), 'success');
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
        <strong style={{ color: '#000' }}>{t('promDetail.biopsyTitle')}</strong>
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
                .filter(([key]) =>
                    key !== 'biopsy_pid' &&
                    key !== 'biopsy_row_id' &&
                    key !== 'biopsy_vorname' &&
                    key !== 'biopsy_nachname' &&
                    key !== 'biopsy_email'
                )
                .map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold', color: '#000' }}>
                            {t(`databasePage.${key}`, { defaultValue: key.replace(/_/g, ' ') })}:
                        </label>
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
            <FormattedModuleData data={entry} moduleName="biopsyFields" />
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default BiopsyAccordionCard;