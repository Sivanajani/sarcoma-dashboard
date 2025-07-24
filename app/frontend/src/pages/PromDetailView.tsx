import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Paper } from '@mui/material';
import Eq5dChart from '../components/Eq5dChart';
import { useTranslation } from 'react-i18next';


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

const PromDetailView: React.FC<PromDetailViewProps> = ({ patientId }) => {
  const params = useParams<{ id: string }>();
  const effectiveId = patientId ?? params.id;
  const { t } = useTranslation();


  const [eq5dData, setEq5dData] = useState<Eq5dEntry[]>([]);

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

    if (effectiveId) fetchData();
  }, [effectiveId]);

  return (
  <Box>
    <h2 className="overview-title">{t('promDetail.eq5dTitle')}</h2>    
    <Paper elevation={2} sx={{ padding: 3, mb: 6 }}>
      {eq5dData.length > 0 ? (
        <Eq5dChart data={eq5dData} />
      ) : (
      
      <Typography variant="body2" color="text.secondary">
        {t('promDetail.eq5dEmpty')}
      </Typography>
      )}
    </Paper>
    
    <h2 className="overview-title">{t('promDetail.biopsyTitle')}</h2>
    
    <Paper elevation={1} sx={{ padding: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {t('promDetail.biopsyText')}
      </Typography>
    </Paper>
  </Box>
  );
};

export default PromDetailView;