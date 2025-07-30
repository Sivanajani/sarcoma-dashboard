import React from 'react';
import { t } from 'i18next';
import { TextField, Select, MenuItem, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

type EditableFieldProps = {
  value: any;
  onChange: (val: any) => void;
};

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange }) => {
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        size="small"
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