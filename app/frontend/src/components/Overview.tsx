import { mockPatients } from '../data/mockPatients';
import KpiCard from './KpiCard';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InsightsIcon from '@mui/icons-material/Insights';
import './Overview.css';
import { useTranslation } from 'react-i18next';

const Overview = () => {
  const { t } = useTranslation();
  const totalPatients = mockPatients.length;

  const calculateCompleteness = (patient: any): number => {
    const totalModules = 7;
    let filled = 0;
    if (patient.diagnosis) filled++;
    if (patient.tumor) filled++;
    if (patient.sarcomaBoards?.length) filled++;
    if (patient.radiologyExams?.length) filled++;
    if (patient.pathologyReports?.length) filled++;
    if (patient.surgeries?.length) filled++;
    if (patient.systemicTherapies?.length) filled++;
    return Math.round((filled / totalModules) * 100);
  };

  const completenessList = mockPatients.map(p => calculateCompleteness(p));
  const avgCompleteness = Math.round(completenessList.reduce((a, b) => a + b, 0) / totalPatients);
  const highCompleteness = completenessList.filter(p => p >= 90).length;

  const redFlags = mockPatients.filter(p =>
    p.radiologyExams?.some((exam: any) => exam.number_lesions_total > 1) ||
    p.pathologyReports?.some((path: any) => path.r_status === 'R2')
  ).length;

  return (
    <section className="overview">
      <KpiCard
        icon={<GroupIcon />}
        label={t('dashboard.kpi.total')}
        value={totalPatients}
        tooltip={t('dashboard.kpi.tooltip.total')}
        color="#007bff"
         onClick={() => console.log('Total patients clicked')}
      />
      <KpiCard
        icon={<CheckCircleIcon />}
        label={t('dashboard.kpi.complete')}
        value={highCompleteness}
        tooltip={t('dashboard.kpi.tooltip.complete')}
        color="#28a745"
        onClick={() => console.log('≥90 % clicked')}
      />
      <KpiCard
        icon={<ReportProblemIcon />}
        label={t('dashboard.kpi.flags')}
        value={redFlags}
        tooltip={t('dashboard.kpi.tooltip.flags')}
        color="#dc3545"
        onClick={() => console.log('Red Flags clicked')}
      />
      <KpiCard
        icon={<InsightsIcon />}
        label={t('dashboard.kpi.avg')}
        value={`${avgCompleteness}%`}
        tooltip={t('dashboard.kpi.tooltip.avg')}
        color="#ffc107"
        onClick={() => console.log('Ø Vollständigkeit clicked')}
      />
    </section>
  );
};

export default Overview;