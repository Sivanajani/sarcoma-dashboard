import React, { useState } from 'react';
import './PatientQualityTable.css';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Tooltip from '@mui/material/Tooltip';
import { usePatientStore } from '../store/patientStore';

export type PatientQuality = {
  id: number;
  patient_id: string | number;
  completeness?: number;
  correctness?: number;
  consistency?: number;
  actuality?: number;
  flag?: 'red' | 'yellow';
};

const getColorClass = (value?: number): string => {
  if (value === undefined) return '';
  if (value >= 90) return 'green';
  if (value >= 70) return 'yellow';
  return 'red';
};

const CromsTable: React.FC = () => {
  const { t } = useTranslation();
  const { patients } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState('');

  const cromPatients = patients.filter((p) => p.source === 'croms');

  const filteredPatients = cromPatients.filter((p) =>
    p.patient_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-quality-table">
      <h2 className="overview-title">{t('patientTable.titleCroms')}</h2>

      <TextField
        placeholder={t('patientTable.search')}
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          marginBottom: '1rem',
          minWidth: '300px',
          backgroundColor: '#f4f1ed',
          borderRadius: '9999px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '9999px',
            paddingRight: '4px',
            color: '#000',
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused fieldset': { border: 'none' },
          },
          '& input': { color: '#000' },
        }}
      />

      <table>
        <thead>
          <tr>
            <th></th>
            <th>{t('patientTable.headers.id')}</th>
            <th>{t('patientTable.headers.completeness')}</th>
            <th>{t('patientTable.headers.correctness')}</th>
            <th>{t('patientTable.headers.consistency')}</th>
            <th>{t('patientTable.headers.actuality')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p.patient_id}>
              <td className="flag-cell">
                {p.flag === 'red' && (
                  <Tooltip title={t('patientTable.tooltips.redFlag')}>
                    <ReportProblemIcon color="error" />
                  </Tooltip>
                )}
                {p.flag === 'yellow' && (
                  <Tooltip title={t('patientTable.tooltips.yellowFlag')}>
                    <WarningAmberIcon color="warning" />
                  </Tooltip>
                )}
              </td>
              <td>
                <Link to={`/patients/${p.patient_id}`} className="patient-link">
                  {p.patient_id}
                </Link>
              </td>
              <td className={`value ${getColorClass(p.completeness)}`}>
                {p.completeness !== undefined ? `${p.completeness}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.correctness)}`}>
                {p.correctness !== undefined ? `${p.correctness}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.consistency)}`}>
                {p.consistency !== undefined ? `${p.consistency}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.actuality)}`}>
                {p.actuality !== undefined ? `${p.actuality}%` : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CromsTable;