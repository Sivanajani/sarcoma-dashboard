import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      <h2 className={isCollapsed ? 'collapsed-title' : ''}>
        {t('sidebar.title')}
      </h2>

      <nav>
        <a href="#" title={t('sidebar.dashboard')}>
          <DashboardIcon fontSize="small" />
          {!isCollapsed && <span>{t('sidebar.dashboard')}</span>}
        </a>
        <a href="#" title={t('sidebar.forms')}>
          <AssignmentIcon fontSize="small" />
          {!isCollapsed && <span>{t('sidebar.forms')}</span>}
        </a>
        <a href="#" title={t('sidebar.patients')}>
          <PeopleIcon fontSize="small" />
          {!isCollapsed && <span>{t('sidebar.patients')}</span>}
        </a>
        <a href="#" title={t('sidebar.redflags')}>
          <ReportProblemIcon fontSize="small" />
          {!isCollapsed && <span>{t('sidebar.redflags')}</span>}
        </a>
        <a href="#" title={t('sidebar.settings')}>
          <SettingsIcon fontSize="small" />
          {!isCollapsed && <span>{t('sidebar.settings')}</span>}
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;