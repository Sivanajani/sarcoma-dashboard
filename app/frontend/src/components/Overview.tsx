import KpiCard from './KpiCard';
import GroupIcon from '@mui/icons-material/Group';
import { useTranslation } from 'react-i18next';
import { usePatientCount } from '../hooks/usePatientCount';

const Overview = () => {
  const { t } = useTranslation();
  const { count, loading } = usePatientCount();

  return (
    <section className="overview">
      <h2 className="overview-title">{t('dashboard.overview-title')}</h2>
      <div className="kpi-container">
        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.total')}
          value={loading ? '...' : count ?? 'n/a'}
          tooltip={t('dashboard.kpi.tooltip.total')}
          color="#007bff"
          onClick={() => console.log('Total patients clicked')}
        />

        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.complete')}
          value={'n/a'}
          tooltip={t('dashboard.kpi.tooltip.complete')}
          color="#28a745"
          onClick={() => {}}
        />

        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.flags')}
          value={'n/a'}
          tooltip={t('dashboard.kpi.tooltip.flags')}
          color="#dc3545"
          onClick={() => {}}
        />

        <KpiCard
          icon={<GroupIcon />}
          label={t('dashboard.kpi.avg')}
          value={'n/a'}
          tooltip={t('dashboard.kpi.tooltip.avg')}
          color="#ffc107"
          onClick={() => {}}
        />
      </div>
    </section>
  );
};

export default Overview;