import type { ReactNode } from 'react';
import { Tooltip } from '@mui/material';
import './KpiCard.css';

type KpiCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  tooltip?: string;
  color?: string;
  onClick?: () => void;
};

const KpiCard = ({ icon, label, value, subtitle, tooltip, color = '#4da6ff', onClick }: KpiCardProps) => {
  return (
    <Tooltip title={tooltip || ''} arrow>
      <div
      className="kpi-card-modern"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      aria-label={`KPI: ${label}`}
      role="button"
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
        }
        }}>
        <div className="kpi-icon-modern" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <p className="kpi-label-modern">{label}</p>
        <p className="kpi-value-modern">{value}</p>
        {subtitle && <p className="kpi-subtitle-modern">{subtitle}</p>}
      </div>
    </Tooltip>
  );
};

export default KpiCard;