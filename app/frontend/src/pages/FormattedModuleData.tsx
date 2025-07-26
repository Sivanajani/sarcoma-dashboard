import React from 'react';
import { useTranslation } from 'react-i18next';

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
        <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k}><strong>{k}:</strong> {renderValue(v)}</div>
          ))}
        </div>
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
    <div style={{ padding: '0.5rem 0' }}>
      {Object.entries(data).map(([key, value]) => {
        const baseKey = moduleName ? `${moduleName}.${key}` : `databasePage.${key}`;
        return (
          <div key={key} style={{ marginBottom: '0.5rem' }}>
            <strong>
              {t(baseKey, {
                defaultValue: t(`databasePage.${key}`, {
                  defaultValue: key.replace(/_/g, ' ')
                })
              })}:
            </strong> {renderValue(value)}
          </div>
        );
      })}
    </div>
  );
};

export default FormattedModuleData;