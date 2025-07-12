import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import Tooltip from '@mui/material/Tooltip';
import { Link, useLocation } from 'react-router-dom';


const Sidebar = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const menuItems = [
    { icon: <DashboardIcon fontSize="small" />, label: t('sidebar.dashboard'), path: '/' },
    { icon: <StorageIcon fontSize="small" />, label: t('sidebar.forms'), path: '/forms' },
    { icon: <PeopleIcon fontSize="small" />, label: t('sidebar.patients'), path: '/patients' },
    { icon: <ReportProblemIcon fontSize="small" />, label: t('sidebar.redflags'), path: '/redflags' },
    { icon: <SettingsIcon fontSize="small" />, label: t('sidebar.settings'), path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      {!isCollapsed && <h2>{t('sidebar.title')}</h2>}

      <nav>
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
          <Tooltip
           key={index}
           title={isCollapsed ? item.label : ''}
           placement="right"
           arrow
          >
            <Link to={item.path} className={isActive ? 'active' : ''}>
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          </Tooltip>
    );
  })}
</nav>

    </aside>
  );
};

export default Sidebar;