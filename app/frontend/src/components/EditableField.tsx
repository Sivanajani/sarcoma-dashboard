/**
 * EditableField.tsx
 *
 * Zweck:
 * - Universelle Inline-Edit-Komponente für verschieden typisierte Werte.
 * - Erkennt den Typ des Props `value` und rendert das passende Eingabeelement:
 *   - boolean  → <Select> mit Ja/Nein
 *   - array    → dynamische Liste aus <TextField>s mit Add/Remove
 *   - ISO-Datum (YYYY-MM-DD) → <TextField type="date"> mit Picker-Button
 *   - fallback → <TextField> (string/number/sonstiges)
 *
 * Props:
 * - value: any
 * - onChange: (val: any) => void
 *
 * Features:
 * - i18n-Labels (yes/no, add/remove) über t(...)
 * - Kleines Datepicker-Icon, das nativen Browser-Picker öffnet
 * - Array-Editing mit Hinzufügen/Entfernen einzelner Einträge
 *
 *
 * Beispiel:
 * <EditableField value={patient.active} onChange={(v) => update('active', v)} />
 */


import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, Select, MenuItem, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

type EditableFieldProps = {
  value: any;
  onChange: (val: any) => void;
};

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (typeof value === 'boolean') {
    return (
      <Select
        value={value ? 'true' : 'false'}
        onChange={(e) => onChange(e.target.value === 'true')}
        fullWidth
        size="small"
      >
        <MenuItem value="true">{t('yes')}</MenuItem>
        <MenuItem value="false">{t('no')}</MenuItem>
      </Select>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {value.map((val, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              value={val}
              onChange={(e) => {
                const updated = [...value];
                updated[index] = e.target.value;
                onChange(updated);
              }}
              size="small"
              fullWidth
            />
            <IconButton
              onClick={() => {
                const updated = value.filter((_: any, i: number) => i !== index);
                onChange(updated);
              }}
              color="error"
              title={t('editableField.removeField')}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          onClick={() => onChange([...value, ''])}
          variant="outlined"
          startIcon={<AddIcon />}
          size="small"
          sx={{ width: 'fit-content' }}
        >
          {t('editableField.addField')}
        </Button>
      </Box>
    );
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof value === 'string' && isoDateRegex.test(value)) {
  return (
    <TextField
      type="date"
      inputRef={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => inputRef.current?.showPicker()} size="small">
              <CalendarTodayIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

  return (
    <TextField
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
    />
  );
};

export default EditableField;