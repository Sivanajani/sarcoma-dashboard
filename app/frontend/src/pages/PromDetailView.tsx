import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Paper } from '@mui/material';
import Eq5dChart from '../components/Eq5dChart';
import { useTranslation } from 'react-i18next';
import BiopsyDetail from '../components/BiopsyDetail';
import BiopsyRadarChart from "../components/BiopsyRadarChart";
import Eq5dAccordionCard from '../components/Eq5dAccordionCard';

interface PromDetailViewProps {
  patientId?: string;
}

interface Eq5dEntry {
  date: string;
  mobilitaet: number;
  selbstversorgung: number;
  gewohnte_aktivitaeten: number;
  schmerz: number;
  angst: number;
  vas: number;
  belastung: number;
  funktion: number;
}

interface BiopsyEntry {
  biopsy_row_id: number;
  biopsy_date: string;
  biopsy_institution: string | null;
  biopsy_notwendigkeit: boolean | null;
  biopsy_angst: boolean | null;
  biopsy_erklaerung: boolean | null;
  biopsy_verstehen: boolean | null;
  biopsy_schmerz_wie_erwartet: string | null;
  biopsy_schmerz: number | null;
  biopsy_medikamente: boolean | null;
  biopsy_beobachtungszeitraum: string | null;
  biopsy_blutende_wunde: boolean | null;
  biopsy_probleme_wunde: boolean | null;
  biopsy_schmerzkontrolle: boolean | null;
  biopsy_team_raum: number | null;
  biopsy_organisation: number | null;
  biopsy_eqvas: number | null;
  biopsy_questions: string | null;
}

const PromDetailView: React.FC<PromDetailViewProps> = ({ patientId }) => {
  const params = useParams<{ id: string }>();
  const effectiveId = patientId ?? params.id;
  const { t } = useTranslation();

  const [eq5dData, setEq5dData] = useState<Eq5dEntry[]>([]);
  const [biopsyData, setBiopsyData] = useState<BiopsyEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/proms/eq5d/by-external-code/${effectiveId}`);
        const json = await response.json();
        setEq5dData(json);
      } catch (error) {
        console.error('Fehler beim Laden der EQ5D-Daten:', error);
      }
    };

    const fetchBiopsyData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/proms/biopsy/by-external-code/${effectiveId}`);
        const json = await response.json();
        setBiopsyData(json);
      } catch (error) {
        console.error("Fehler beim Laden der Biopsie-Daten:", error);
      }
    };

    if (effectiveId) {
      fetchData();
      fetchBiopsyData();
    }
  }, [effectiveId]); 

  return (
    <Box>
      <h2 className="overview-title">{t('promDetail.eq5dTitle')}</h2>
      <Paper elevation={2} sx={{ padding: 3, mb: 6 }}>
        {eq5dData.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              mt: 2,
            }}
          >
            {/* Chart oben */}
            <Box sx={{ width: '100%' }}>
              <Eq5dChart data={eq5dData} />
            </Box>
            
            {/* Karten darunter – nebeneinander */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'flex-start',
              }}
            >
              {eq5dData.map((entry, idx) => (
                <Box
                  key={idx}
                  sx={{
                    flex: '1 1 300px',
                    minWidth: '300px',
                    maxWidth: '400px',
                  }}
                >
                  <Eq5dAccordionCard
                    entry={entry}
                    onSaved={async () => {
                      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proms/eq5d/by-external-code/${effectiveId}`);
                      const json = await res.json();
                      setEq5dData(json);
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('promDetail.eq5dEmpty')}
          </Typography>
        )}
      </Paper>

      <h2 className="overview-title">{t('promDetail.biopsyTitle')}</h2>
      {biopsyData.length > 0 ? (
        <BiopsyDetail data={biopsyData} />
      ) : (
        <Paper elevation={1} sx={{ padding: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('promDetail.biopsyEmpty')}
          </Typography>
        </Paper>
      )}
      
      {biopsyData.length > 0 && (
        <>
          <h2 className="overview-title">{t('promDetail.biopsyChartTitle')}</h2>
          <BiopsyRadarChart entries={biopsyData} />
        </>
      )}
    </Box>
  );
};

export default PromDetailView;