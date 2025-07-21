import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

interface PromDetailViewProps {
  patientId?: string; // optional
}

const PromDetailView: React.FC<PromDetailViewProps> = ({ patientId }) => {
  const params = useParams<{ id: string }>();
  const effectiveId = patientId ?? params.id;

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        PROM Detailansicht
      </Typography>
      <Typography variant="body1">
        Patient:innen-ID: {effectiveId}
      </Typography>
      <Typography variant="body2" sx={{ marginTop: '1rem', color: 'gray' }}>
        (Hier kommen später Charts, Tabs usw.)
      </Typography>
    </Box>
  );
};

export default PromDetailView;