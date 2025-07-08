import React, { useEffect, useState } from 'react';
import './PatientQualityTable.css';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Tooltip from '@mui/material/Tooltip';


type PatientQuality = {
  id: number; // internal_ID
  patient_id: string | number;
  completeness?: number;
  correctness?: number;
  consistency?: number;
  timeliness?: number;
  uniqueness?: number;
  plausibility?: number;
  flag?: 'red' | 'yellow';
};

const getColorClass = (value?: number): string => {
  if (value === undefined) return '';
  if (value >= 90) return 'green';
  if (value >= 70) return 'yellow';
  return 'red';
};

const PatientQualityTable: React.FC = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<PatientQuality[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [baseRes, overviewRes, correctnessRes, consistencyRes ] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/completeness-overview`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/correctness-overview`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/consistency-overview`)
        ]);

        const baseData = await baseRes.json();
        const overviewData = await overviewRes.json();
        const correctnessData = await correctnessRes.json();
        const consistencyData = await consistencyRes.json();

        const combined: PatientQuality[] = baseData.map((p: any) => {
          const correctness = correctnessData.find((q: any) => q.patient_id === p.id);
          const quality = overviewData.find((q: any) => q.patient_id === p.id);
          const consistency = consistencyData.find((q: any) => q.patient_id === p.id);
          return {
            id: p.id,
            patient_id: p.patient_id,
            completeness: quality?.average_completeness !== undefined
            ? Math.round(quality.average_completeness * 100)
            : undefined,
            correctness: correctness?.average_correctness !== undefined
            ? Math.round(correctness.average_correctness)
            : undefined,
            consistency: consistency?.average_consistency !== undefined
            ? Math.round(consistency.average_consistency)
            : undefined,
            timeliness: quality?.timeliness !== undefined
            ? Math.round(quality.timeliness * 100)
            : undefined,
            uniqueness: quality?.uniqueness !== undefined
            ? Math.round(quality.uniqueness * 100)
            : undefined,
            plausibility: quality?.plausibility !== undefined
            ? Math.round(quality.plausibility * 100)
            : undefined,
            flag: quality?.flag ?? undefined,
          };
        });


        setPatients(combined);
      } catch (err) {
        console.error('Fehler beim Laden der Patienten:', err);
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
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
            },
          },
          '& input': {
            color: '#000',
          },
        }}
      />

      <table>
        <thead>
          <tr>
            <th></th> {/* Flag-Spalte */}
            <th>{t('patientTable.headers.id')}</th>
            <th>{t('patientTable.headers.completeness')}</th>
            <th>{t('patientTable.headers.correctness')}</th>
            <th>{t('patientTable.headers.consistency')}</th>
            <th>{t('patientTable.headers.timeliness')}</th>
            <th>{t('patientTable.headers.uniqueness')}</th>
            <th>{t('patientTable.headers.plausibility')}</th>
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
                <Link to={`/patients/${p.id}`} className="patient-link">
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
              <td className={`value ${getColorClass(p.timeliness)}`}>
                {p.timeliness !== undefined ? `${p.timeliness}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.uniqueness)}`}>
                {p.uniqueness !== undefined ? `${p.uniqueness}%` : '–'}
              </td>
              <td className={`value ${getColorClass(p.plausibility)}`}>
                {p.plausibility !== undefined ? `${p.plausibility}%` : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientQualityTable;