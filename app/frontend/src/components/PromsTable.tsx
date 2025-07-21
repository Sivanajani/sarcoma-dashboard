import React, { useEffect, useState } from 'react';
import './PatientQualityTable.css';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

type PromPatientQuality = {
  patient_id: number;
  completeness?: number;
  actuality?: number;
  flag?: 'red' | 'yellow' | 'green';
};

const getColorClass = (value?: number): string => {
  if (value === undefined) return '';
  if (value >= 90) return 'green';
  if (value >= 70) return 'yellow';
  return 'red';
};

const PromsTable: React.FC = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<PromPatientQuality[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [baseRes, completenessRes, actualityRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proms/patients`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proms/completeness/average`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proms/actuality-overview`)
        ]);

        const baseData = await baseRes.json();
        const completenessData = await completenessRes.json();
        const actualityData = await actualityRes.json();

        const combined: PromPatientQuality[] = baseData.map((p: any) => {
          const completeness = completenessData.find((q: any) => q.patient_id === p.patient_id);
          const actuality = actualityData.find((q: any) => q.patient_id === p.patient_id);
          return {
            patient_id: p.patient_id,
            completeness: completeness?.average_completeness,
            actuality: actuality?.average_actuality,
            flag: completeness?.flag,
          };
        });

        setPatients(combined);
      } catch (err) {
        console.error('Fehler beim Laden der PROM-Patienten:', err);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.patient_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-quality-table">
      <h2 className="overview-title">{t('patientTable.title')}</h2>

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

export default PromsTable;