/**
 * PatientQualityTable.tsx
 *
 * Zweck:
 * - Zentrale Tabellenansicht zur Darstellung der Datenqualität von Patient:innen im Dashboard.
 * - Bietet Tabs für verschiedene Ansichten:
 *   - Red Flags
 *   - Alle Patient:innen
 *   - CROMs (Clinician Reported Outcome Measures)
 *   - PROMs (Patient Reported Outcome Measures)
 *
 * Hauptfunktionen:
 * - Tab-Navigation mit `@mui/material` Tabs & dynamischem Rendering der passenden Tabelle.
 * - "Aktualisieren"-Button (mit Ladeindikator), um Patientendaten neu vom Backend zu laden.
 * - Verarbeitet API-Antwort `/api/patient-quality/all`, berechnet daraus:
 *   - Durchschnittswerte für die Qualitätsmetriken (Vollständigkeit, Korrektheit, Konsistenz, Aktualität)
 *   - Flags (rot/gelb) pro Patient.
 * - Aktualisiert den globalen Zustand (`patientStore`) mit neuen Patientendaten und Red-Flag-Zahl.
 *
 * Props:
 * - selectedTab: aktuell ausgewählter Tab ('redflags' | 'all' | 'croms' | 'proms').
 * - setSelectedTab: Funktion zum Wechseln des Tabs.
 *
 * Nutzung:
 * <PatientQualityTable
 *   selectedTab={selectedTab}
 *   setSelectedTab={setSelectedTab}
 * />
 */



import { useState } from 'react';
import { Tabs, Tab, Box, Paper, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AllPatientsTable from './AllPatientsTable';
import CromsTable from './CromsTable';
import PromsTable from './PromsTable';
import RedFlagsTable from './RedFlagsTable';
import { useTranslation } from 'react-i18next';
import { usePatientStore } from '../store/patientStore';

type Props = {
  selectedTab: 'redflags' | 'all' | 'croms' | 'proms';
  setSelectedTab: (tab: 'redflags' | 'all' | 'croms' | 'proms') => void;
};

const PatientQualityTable = ({ selectedTab, setSelectedTab }: Props) => {
  const { t } = useTranslation();
  const { patients, setPatients, setRedFlagTotal } = usePatientStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
  try {
    setRefreshing(true);
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patient-quality/all`);
    const data = await res.json();
    const summary = data?.patients ?? {};

    
    const normalizePct = (v: unknown) => {
      const n = Number(v);
      if (!Number.isFinite(n)) return undefined;
    
      return n <= 1 ? Math.round(n * 100) : Math.round(n);
    };

    const avg = (arr: number[]) => {
      if (!arr.length) return undefined;
      return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    };

    const collectMetric = (container: any, key: 'completeness' | 'correctness' | 'consistency' | 'actuality') => {      
      if (!container || typeof container !== 'object') return [] as number[];
      const vals: number[] = [];
      for (const mod of Object.values(container)) {
        const val = (mod as any)?.[key];
        const n = normalizePct(val);
        if (n !== undefined) vals.push(n);
      }
      return vals;
    };

    const deriveTopLevel = (s: any) => {
      // sammle Werte aus CROMs & PROMs
      const cCompleteness = collectMetric(s?.croms, 'completeness').concat(collectMetric(s?.proms, 'completeness'));
      const cCorrectness  = collectMetric(s?.croms, 'correctness').concat(collectMetric(s?.proms, 'correctness'));
      const cConsistency  = collectMetric(s?.croms, 'consistency').concat(collectMetric(s?.proms, 'consistency'));
      const cActuality    = collectMetric(s?.croms, 'actuality').concat(collectMetric(s?.proms, 'actuality'));

      return {
        completeness: avg(cCompleteness),
        correctness:  avg(cCorrectness),
        consistency:  avg(cConsistency),
        actuality:    avg(cActuality),
      };
    };

    const updated = patients.map((p) => {
      const s = summary[p.patient_id] ?? summary[String(p.patient_id)];
      if (!s) return p;

      // Flag aus summary_flag ableiten
      const flag: 'red' | 'yellow' | undefined =
        s?.summary_flag === 'red flag' ? 'red'
        : s?.summary_flag === 'yellow flag' ? 'yellow'
        : undefined;

      // Top-Level Kennzahlen aus Modulen neu berechnen
      const top = deriveTopLevel(s);

      return {
        ...p,
        ...top,                  
        croms: s.croms,
        proms: s.proms,
        flag,
      };
    });

    setPatients(updated);

    if (typeof data?.red_flag_total === 'number') {
      setRedFlagTotal(data.red_flag_total);
    }
  } catch (err) {
    console.error('Fehler beim Refresh von patient-quality/all:', err);
  } finally {
    setRefreshing(false);
  }
};



  return (
    <Paper
      elevation={3}
      sx={{
        mt: 4,
        borderRadius: '1rem',
        p: '1.5rem',
        backgroundColor: '#fff',
      }}
    >
      {/* Tabs + Refresh */}
      <Box
        sx={{
          borderBottom: 0.5,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 1,
        }}
      >
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

        <Button
          variant="outlined"
          size="small"
          onClick={handleRefresh}
          disabled={refreshing}
          startIcon={!refreshing ? <RefreshIcon /> : undefined}
        >
          {refreshing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              {t('patientTable.refreshing', 'Aktualisiere…')}
            </Box>
          ) : (
            t('patientTable.refresh', 'Aktualisieren')
          )}
        </Button>
      </Box>

      {/* Inhalte je nach Tab */}
      {selectedTab === 'redflags' && <RedFlagsTable />}
      {selectedTab === 'all' && <AllPatientsTable />}
      {selectedTab === 'croms' && <CromsTable />}
      {selectedTab === 'proms' && <PromsTable />}
    </Paper>
  );
};

export default PatientQualityTable;