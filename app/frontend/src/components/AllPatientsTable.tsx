import React, { useEffect, useState } from 'react';
import './PatientQualityTable.css';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Tooltip from '@mui/material/Tooltip';

export type PatientQuality = {
  id?: number;
  patient_id: string | number;
  completeness?: number;
  correctness?: number;
  consistency?: number;
  actuality?: number;
  flag?: 'red' | 'yellow';
  source: 'croms' | 'proms' | 'croms+proms';
};

const getColorClass = (value?: number): string => {
  if (value === undefined) return '';
  if (value >= 90) return 'green';
  if (value >= 70) return 'yellow';
  return 'red';
};

const AllPatientsTable: React.FC = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<PatientQuality[]>([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // CROM-Daten
        const [baseRes, overviewRes, correctnessRes, consistencyRes, actualityRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/completeness-overview`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/correctness-overview`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/consistency-overview`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/actuality-overview`)
        ]);


        const baseData = await baseRes.json();
        const overviewData = await overviewRes.json();
        const correctnessData = await correctnessRes.json();
        const consistencyData = await consistencyRes.json();
        const actualityData = await actualityRes.json();

        const cromPatients: PatientQuality[] = baseData.map((p: any) => {
          const correctness = correctnessData.find((q: any) => q.patient_id === p.id);
          const quality = overviewData.find((q: any) => q.patient_id === p.id);
          const consistency = consistencyData.find((q: any) => q.patient_id === p.id);
          const actuality = actualityData.find((q: any) => q.patient_id === p.id);
          return {
            id: p.id,
            patient_id: p.patient_id,
            completeness: quality?.average_completeness !== undefined ? Math.round(quality.average_completeness * 100) : undefined,
            correctness: correctness?.average_correctness !== undefined ? Math.round(correctness.average_correctness) : undefined,
            consistency: consistency?.average_consistency !== undefined ? Math.round(consistency.average_consistency) : undefined,
            actuality: actuality?.average_actuality !== undefined ? Math.round(actuality.average_actuality) : undefined,
            flag: quality?.flag ?? undefined,
            source: 'croms'
          };
        });

        // PROM-Daten
        const [promBaseRes, promCompletenessRes, promActualityRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proms/patients`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proms/completeness/average`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proms/actuality-overview`)
        ]);

        const promBaseData = await promBaseRes.json();
        const promCompleteness = await promCompletenessRes.json();
        const promActuality = await promActualityRes.json();

        const promPatients: PatientQuality[] = promBaseData.map((p: any) => {
          const completeness = promCompleteness.find((q: any) => q.patient_id === p.patient_id);
          const actuality = promActuality.find((q: any) => q.patient_id === p.patient_id);
          return {
            patient_id: p.patient_id,
            completeness: completeness?.average_completeness,
            actuality: actuality?.average_actuality,
            flag: completeness?.flag,
            source: 'proms'
          };
        });

        // Zusammenführen nach patient_id
        const patientMap: { [key: string]: PatientQuality } = {};

        cromPatients.forEach((p) => {
          patientMap[p.patient_id] = { ...p };
        });

        promPatients.forEach((p) => {
          const existing = patientMap[p.patient_id];
          if (existing) {
            patientMap[p.patient_id] = {
              ...existing,
              completeness: existing.completeness ?? p.completeness,
              actuality: existing.actuality ?? p.actuality,
              flag: existing.flag ?? p.flag,
              source: 'croms+proms'
            };
          } else {
            patientMap[p.patient_id] = { ...p };
          }
        });

        // Summary-Flags holen
        const summaryRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patient-quality/all`);
        const summaryData = await summaryRes.json();
        
        // Flags anhand von summaryData setzen
        Object.keys(patientMap).forEach((pid) => {
          const summary = summaryData[pid];
          if (summary) {
            if (summary.summary_flag === 'red flag') {
              patientMap[pid].flag = 'red';
            } else if (summary.summary_flag === 'yellow flag') {
              patientMap[pid].flag = 'yellow';
            } else {
              patientMap[pid].flag = undefined;
            }
          }
        });

        setPatients(Object.values(patientMap));
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
                <Link
                  to={
                    p.source === 'proms'
                      ? `/proms/${p.patient_id}`
                      : `/patients/${p.patient_id}`
                  }
                  className="patient-link"
                >
                  {p.patient_id}
                </Link>
                <div style={{ marginTop: '4px' }}>
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
                      : p.source.toUpperCase()}
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

export default AllPatientsTable;