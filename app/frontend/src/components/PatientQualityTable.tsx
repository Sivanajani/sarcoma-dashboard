import { Tabs, Tab, Box, Paper } from '@mui/material';
import AllPatientsTable from './AllPatientsTable';
import CromsTable from './CromsTable';
import PromsTable from './PromsTable';
import RedFlagsTable from './RedFlagsTable';
import { useTranslation } from 'react-i18next';

type Props = {
  selectedTab: 'redflags' |'all' | 'croms' | 'proms';
  setSelectedTab: (tab: 'redflags' |'all' | 'croms' | 'proms') => void;
};

const PatientQualityTable = ({ selectedTab, setSelectedTab }: Props) => {
  const { t } = useTranslation();

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
      <Box sx={{ borderBottom: 0.5, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={t('patientTable.tabs.redflags')} value="redflags" />
          <Tab label={t('patientTable.tabs.all')} value="all" />
          <Tab label={t('patientTable.tabs.croms')} value="croms" />
          <Tab label={t('patientTable.tabs.proms')} value="proms" />
        </Tabs>
      </Box>

      {/* Inhalte je nach Tab */}
      {selectedTab === 'redflags'&& <RedFlagsTable/>}
      {selectedTab === 'all' && <AllPatientsTable />}
      {selectedTab === 'croms' && <CromsTable />}
      {selectedTab === 'proms' && <PromsTable />}
    </Paper>
  );
};

export default PatientQualityTable;