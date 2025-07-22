import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import Eq5dChart from '../components/Eq5dChart';

interface PromDetailViewProps {
  patientId?: string; // optional
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

  const [eq5dData, setEq5dData] = useState<Eq5dEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        const [eq5dRes] = await Promise.all([
          fetch(`${baseUrl}/api/proms/eq5d/by-external-code/${effectiveId}`),
        ]);

        const [eq5dJson] = await Promise.all([
          eq5dRes.json(),
        ]);

        setEq5dData(eq5dJson);
      } catch (error) {
        console.error("Fehler beim Laden der PROM-Daten:", error);
      }
    };

    if (effectiveId) fetchData();
  }, [effectiveId]);

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        EQ-5D Verlauf
      </Typography>

      {eq5dData.length > 0 ? (
        <Eq5dChart data={eq5dData} />
      ) : (
        <Typography variant="body2" color="textSecondary">
          Keine EQ5D-Daten verfügbar.
        </Typography>
      )}

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          PROMs Biopsy (folgt)
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Biopsiedaten werden hier bald als Tabelle angezeigt.
        </Typography>
      </Box>
    </Box>
  );
};

export default PromDetailView;