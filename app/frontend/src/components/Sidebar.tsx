import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';

const Sidebar = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const menuItems = [
    { icon: <DashboardIcon fontSize="small" />, label: t('sidebar.dashboard') },
    { icon: <AssignmentIcon fontSize="small" />, label: t('sidebar.forms') },
    { icon: <PeopleIcon fontSize="small" />, label: t('sidebar.patients') },
    { icon: <ReportProblemIcon fontSize="small" />, label: t('sidebar.redflags') },
    { icon: <SettingsIcon fontSize="small" />, label: t('sidebar.settings') },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      {!isCollapsed && <h2>{t('sidebar.title')}</h2>}

      <nav>
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            title={isCollapsed ? item.label : ''}
            placement="right"
            arrow
          >
            <a href="#">
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;