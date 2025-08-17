/**
 * FormattedModuleData.tsx
 *
 * Zweck:
 * - Universelle Darstellung von Modul-Daten (CROMs oder PROMs) in einem
 *   strukturierten, lesbaren Format.
 * - Unterstützt verschachtelte Objekte, Arrays, Booleans und leere Werte.
 *
 * Hauptfunktionen:
 * - `renderValue`: Rekursive Darstellung von Werten:
 *    - Arrays → als Liste (`<ul>`).
 *    - Objekte → als eingerückte Schlüssel-Wert-Paare.
 *    - Boolean → Übersetzung von `true`/`false` in Ja/Nein (`t('yes')`/`t('no')`).
 *    - Null/leere Strings → Platzhaltertext `t('noDataDash')`.
 * - Übersetzungen:
 *    - Schlüsselnamen werden, wenn möglich, mit i18next-Übersetzungen aus
 *      `modules.<moduleName>.<key>` oder `databasePage.<key>` angezeigt.
 * - Bestimmte Felder (`vorname`, `nachname`, `biopsy_vorname`, `biopsy_nachname`, `biopsy_email`)
 *   werden explizit ausgefiltert.
 *
 * Props:
 * - `data`: Beliebiges Key-Value-Objekt mit den Modul-Daten.
 * - `moduleName` (optional): Name des Moduls, um spezifische Übersetzungsschlüssel zu bilden.
 *
 * Styling:
 * - Nutzt MUI `Box`-Komponenten für Abstände und Einrückungen.
 *
 * Beispiel:
 * ```tsx
 * <FormattedModuleData
 *   data={patientData.modules.diagnosis}
 *   moduleName="diagnosis"
 * />
 * ```
 *
 * Abhängigkeiten:
 * - `react-i18next` für Übersetzungen.
 * - `@mui/material` für Layout/Styling.
 */


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

  const filteredEntries = Object.entries(data).filter(
  ([key]) => !['vorname', 'nachname', 'biopsy_vorname', 'biopsy_nachname', 'biopsy_email'].includes(key) );

return (
  <Box sx={{ padding: '0.5rem 0', color: 'text.primary' }}>
    {filteredEntries.map(([key, value]) => {
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