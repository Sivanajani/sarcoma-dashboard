import React, { useState } from 'react';
import './PatientQualityTable.css';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Tooltip from '@mui/material/Tooltip';
import { usePatientStore } from '../store/patientStore';

const getColorClass = (value?: number): string => {
  if (value === undefined) return '';
  if (value >= 90) return 'green';
  if (value >= 70) return 'yellow';
  return 'red';
};

const RedFlagsTable: React.FC = () => {
  const { t } = useTranslation();
  const { patients } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState('');

  const redFlaggedPatients = patients.filter((p) => p.flag === 'red');

  const filteredPatients = redFlaggedPatients.filter((p) =>
    p.patient_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-quality-table">
      <h2 className="overview-title">{t('patientTable.titleRedFlags')}</h2>

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
                <Tooltip title={t('patientTable.tooltips.redFlag')}>
                  <ReportProblemIcon color="error" />
                </Tooltip>
              </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '4px' }}>
                    <Link to={`/patients/${p.patient_id}`} className="patient-link">
                      {p.patient_id}
                    </Link>
                    <span
                      style={{
                        backgroundColor:
                          p.source === 'croms+proms'
                            ? '#cadff0ff'
                            : p.source === 'croms'
                            ? '#f0e8d9ff'
                            : '#fce4ec',
                        color:
                          p.source === 'croms+proms'
                            ? '#1565c0'
                            : p.source === 'croms'
                            ? '#ef6c00'
                            : '#df4768ff',
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}
                    >
                      {p.source === 'croms+proms'
                        ? 'CROM + PROM'
                        : p.source?.toUpperCase()}
                    </span>
                  </div>
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

export default RedFlagsTable;
