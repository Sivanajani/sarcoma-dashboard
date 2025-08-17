/**
 * Sidebar.tsx
 *
 * Zweck:
 * - Rendert die linke Navigationsleiste des Dashboards mit Umschaltmöglichkeit zwischen
 *   eingeklappter (collapsed) und voller Ansicht.
 * - Bietet Hauptnavigation zu Dashboard, Formularverwaltung und Alert-Seite.
 *
 * Hauptfunktionen:
 * - **Kollapsfunktion**:
 *   - Button zum Ein- und Ausklappen (Chevron-Icons).
 *   - Im eingeklappten Zustand werden nur Icons mit Tooltip angezeigt.
 * - **Navigation**:
 *   - Menüeinträge mit Icon + Label (Labels nur sichtbar, wenn nicht eingeklappt).
 *   - Aktiver Link wird anhand der aktuellen Route (`useLocation`) hervorgehoben.
 *   - Tooltip für Icons im eingeklappten Zustand zur Nutzerführung.
 * - **Mehrsprachigkeit**:
 *   - Labels und Titel werden über `react-i18next` geladen.
 *
 * Nutzung:
 * ```tsx
 * <Sidebar />
 * ```
 *
 * Abhängigkeiten:
 * - `react-router-dom`: Navigation (`Link`, `useLocation`)
 * - `@mui/icons-material`: Icons für Navigation und Umschalt-Button
 * - `@mui/material/Tooltip`: Tooltips im eingeklappten Modus
 * - `react-i18next`: Übersetzungen für Titel und Labels
 */


import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
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
    { icon: <NotificationsActiveIcon fontSize="small" />, label: t('sidebar.alerts'), path: '/alerts' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      {!isCollapsed && <h2>{t('sidebar.title')}</h2>}

      <nav>
        {menuItems.map((item, index) => {          
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

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