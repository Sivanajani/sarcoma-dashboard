import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import AllPatientsTable from './AllPatientsTable';
import CromsTable from './CromsTable';
import PromsTable from './PromsTable';
import { useTranslation } from 'react-i18next';

const PatientQualityTable: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'all' | 'croms' | 'proms'>('all');

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 4, // Abstand zu KPI-Karten oben
        borderRadius: '1rem',
        padding: '1.5rem',
        backgroundColor: '#fff',
      }}
    >
      {/* Tabs oben im Container */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '0.1rem' }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={t('patientTable.tabs.all')} value="all" />
          <Tab label={t('patientTable.tabs.croms')} value="croms" />
          <Tab label={t('patientTable.tabs.proms')} value="proms" />
        </Tabs>
      </Box>

      {/* Inhalte je nach Tab */}
      {selectedTab === 'all' && <AllPatientsTable />}
      {selectedTab === 'croms' && <CromsTable />}
      {selectedTab === 'proms' && <PromsTable />}
    </Paper>
  );
};

export default PatientQualityTable;