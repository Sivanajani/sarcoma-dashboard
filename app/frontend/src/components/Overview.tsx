import KpiCard from './KpiCard';
import GroupIcon from '@mui/icons-material/Group';
import { useTranslation } from 'react-i18next';
import { usePatientCount } from '../hooks/usePatientCount';

type OverviewProps = {
  setSelectedTab: (tab: 'all' | 'croms' | 'proms') => void;
  scrollToTable: () => void;
};


const Overview: React.FC<OverviewProps> = ({ setSelectedTab, scrollToTable }) => {
  const { t } = useTranslation();
  const { counts, loading } = usePatientCount();

  return (
    <section className="overview">
      <h2 className="overview-title">{t('dashboard.overview-title')}</h2>
      <div className="kpi-container">
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

        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.flags')}
          value={'n/a'}
          tooltip={t('dashboard.kpi.tooltip.flags')}
          color="#ffc107"
          onClick={() => {}}
        />
      </div>
    </section>
  );
};

export default Overview;