/**
 * KpiCard.tsx
 *
 * Zweck:
 * - Anzeige einer einzelnen KPI (Key Performance Indicator) im Dashboard.
 * - Enthält Icon, Label, Wert, optional Untertitel und Tooltip.
 *
 * Features:
 * - Optionaler Tooltip (MUI Tooltip) für zusätzliche Info.
 * - Anpassbare Hintergrundfarbe des Icon-Bereichs.
 * - Optional klickbar (mit Maus oder Tastatur via Enter/Leertaste).
 * - Barrierefreiheit: `aria-label` mit KPI-Beschreibung, `role="button"`, `tabIndex` nur wenn klickbar.
 *
 * Props:
 * - icon: ReactNode → Symbol oder Bild zur KPI.
 * - label: string → Bezeichnung der KPI.
 * - value: string | number → Hauptwert.
 * - subtitle?: string → Zusätzliche Info/Einheit.
 * - tooltip?: string → Text für Tooltip.
 * - color?: string → Hintergrundfarbe des Icons (Default: #4da6ff).
 * - onClick?: () => void → Klick-Handler.
 *
 * Typische Verwendung:
 * <KpiCard
 *   icon={<MyIcon />}
 *   label="Vollständigkeit"
 *   value="95%"
 *   subtitle="im letzten Monat"
 *   tooltip="Prozentsatz vollständig ausgefüllter Felder"
 *   color="#28a745"
 *   onClick={() => console.log('KPI angeklickt')}
 * />
 */


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