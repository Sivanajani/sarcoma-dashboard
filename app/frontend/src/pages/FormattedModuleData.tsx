import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material'; 

interface FormattedModuleDataProps {
  data: Record<string, any>;
  moduleName?: string;
}

const FormattedModuleData: React.FC<FormattedModuleDataProps> = ({ data, moduleName }) => {
  const { t } = useTranslation();

  const renderValue = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index} style={{ marginBottom: '0.25rem' }}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <Box sx={{ ml: 2, mt: 1 }}>
          {Object.entries(value).map(([k, v]) => (
            <Box key={k}><strong>{k}:</strong> {renderValue(v)}</Box>
          ))}
        </Box>
      );
    } else if (typeof value === 'boolean') {
      return value ? t('yes') : t('no');
    } else {
      return value === null || value === '' 
        ? <i style={{ color: '#999' }}>{t('noDataDash')}</i>
        : String(value);
    }
  };

  return (
    <Box sx={{ padding: '0.5rem 0', color: 'text.primary' }}>
      {Object.entries(data).map(([key, value]) => {
        const baseKey = moduleName ? `${moduleName}.${key}` : `databasePage.${key}`;
        return (
          <Box key={key} sx={{ marginBottom: '0.5rem', color: 'text.primary' }}>
            <strong>
              {t(baseKey, {
                defaultValue: t(`databasePage.${key}`, {
                  defaultValue: key.replace(/_/g, ' ')
                })
              })}
              :
            </strong>{' '}
            {renderValue(value)}
          </Box>
        );
      })}
    </Box>
  );
};

export default FormattedModuleData;