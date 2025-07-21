import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const PromDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        PROM Detailansicht
      </Typography>
      <Typography variant="body1">
        Patient:innen-ID: {id}
      </Typography>
      <Typography variant="body2" sx={{ marginTop: '1rem', color: 'gray' }}>
        (Hier kommen später Charts, Tabs usw.)
      </Typography>
    </Box>
  );
};

export default PromDetailView;
