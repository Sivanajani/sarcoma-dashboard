/**
 * Overview.tsx
 *
 * Zweck:
 * - Übersichtsteil des Dashboards, der zentrale KPIs (Kennzahlen) zur Patientendatenlage anzeigt.
 * - Nutzt KpiCard-Komponenten, um wichtige Metriken wie Red Flags, Gesamtanzahl, CROMs- und PROMs-Anzahl darzustellen.
 *
 * Features:
 * - Mehrsprachige Labels und Tooltips via i18next (`useTranslation`).
 * - Datenbindung:
 *   - `usePatientCount` Hook liefert aktuelle Patientenzahlen (gesamt, CROMs, PROMs).
 *   - `usePatientStore` liefert die Gesamtzahl der Red Flags und den Ladezustand.
 * - Jede KPI ist klickbar und löst Tab-Wechsel & Scroll zur Tabelle aus.
 *
 * Props:
 * - setSelectedTab: (tab) => void → setzt aktiven Tab in der Patientenübersicht.
 * - scrollToTable: () => void → scrollt zur Patienten-Tabelle im Dashboard.
 *
 * Typische Verwendung:
 * <Overview
 *   setSelectedTab={(tab) => setTab(tab)}
 *   scrollToTable={() => tableRef.current?.scrollIntoView()}
 * />
 */

import KpiCard from './KpiCard';
import GroupIcon from '@mui/icons-material/Group';
import { useTranslation } from 'react-i18next';
import { usePatientCount } from '../hooks/usePatientCount';
import { usePatientStore } from '../store/patientStore';

type OverviewProps = {
  setSelectedTab: (tab: 'redflags' |'all' | 'croms' | 'proms') => void;
  scrollToTable: () => void;
};


const Overview: React.FC<OverviewProps> = ({ setSelectedTab, scrollToTable }) => {
  const { t } = useTranslation();
  const { counts, loading } = usePatientCount();
  const { redFlagTotal, loaded } = usePatientStore();

  return (
    <section className="overview">
      <h2 className="overview-title">{t('dashboard.overview-title')}</h2>
      <div className="kpi-container">

        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.flags')}
          value={loaded ? redFlagTotal : '...'}
          tooltip={t('dashboard.kpi.tooltip.flags')}
          color="#ffc107"
          onClick={() => {
            setSelectedTab('redflags');
            scrollToTable();
          }}
        />

        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.total')}
          value={loading ? '...' : counts.combined ?? 'n/a'}
          tooltip={t('dashboard.kpi.tooltip.total')}
          color="#007bff"
          onClick={() => {
            setSelectedTab('all');
            scrollToTable();
          }}
        />

        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.cromsTotal')}
          value={loading ? '...' : counts.croms ?? 'n/a'}
          tooltip={t('dashboard.kpi.tooltip.cromsTotal')}
          color="#f1b459ff"
          onClick={() => {
            setSelectedTab('croms');
            scrollToTable();
          }}
        />

        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.promsTotal')}
          value={loading ? '...' : counts.proms ?? 'n/a'}
          tooltip={t('dashboard.kpi.tooltip.promsTotal')}
          color="#d34b7fff"
          onClick={() => {
            setSelectedTab('proms');
            scrollToTable();
          }}
        />
      </div>
    </section>
  );
};

export default Overview;