/**
 * PatientDetailView.tsx
 *
 * Zweck:
 * - Haupt-Detailansicht für eine:n Patient:in.
 * - Stellt entweder CROM- oder PROM-Details dar, je nachdem, welche Datenquellen verfügbar sind.
 * - Ermöglicht den Wechsel zwischen beiden Ansichten (Tabs), falls beide Datenquellen vorhanden sind.
 *
 * Routing:
 * - Erwartet URL-Parameter `patientId` (in der Regel externe ID, z. B. "P8").
 * - Route-Beispiel: `/patients/:patientId/details`
 *
 * Ablauf & Datenfluss:
 * 1. Beim Laden (`useEffect`) wird die Patienteninformation abgerufen:
 *    - Zuerst über `/api/patient-lookup/{patientId}` (liefert Info, ob PROMs und/oder CROMs existieren).
 *    - Falls kein Eintrag → Versuch `/api/proms/patient-info/{patientId}` (nur PROM-Daten).
 * 2. Das Ergebnis (`patientInfo`) enthält:
 *    - interne numerische ID
 *    - externe ID (`patient_id`)
 *    - Flags `has_proms` und `has_croms`
 * 3. Initiale Ansicht:
 *    - Falls nur PROM-Daten vorliegen → `view = 'PROM'`
 *    - Andernfalls Standard auf `'CROM'`
 *
 * UI-Aufbau:
 * - **Zurück-Button**: Navigiert zur vorherigen Seite.
 * - **Titelzeile**: Zeigt den übersetzten Titel inkl. Patienten-ID.
 * - **Tab-Umschaltung**:
 *    - Nur sichtbar, wenn Patient:in sowohl PROM- als auch CROM-Daten hat.
 *    - Tabs nutzen Material-UI `Tabs` & `Tab`.
 * - **Detailansicht**:
 *    - `CromsDetailView` bei CROM-Ansicht.
 *    - `PromDetailView` bei PROM-Ansicht.
 *
 * Lade-/Fehler-Handling:
 * - Solange Daten noch geladen werden oder `patientInfo` null ist → Lade-Text.
 * - Fehler werden aktuell nur in der Konsole ausgegeben.
 *
 * Beispiel:
 * ```
 * /patients/P8/details
 * ```
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CromsDetailView from './CromsDetailView';
import PromDetailView from './PromDetailView';
import { Tabs, Tab, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PatientDetailView: React.FC = () => {
  const { t } = useTranslation();
  const { patientId } = useParams();
  const navigate = useNavigate(); 
  const [patientInfo, setPatientInfo] = useState<{ id: number; patient_id: string; has_proms?: boolean; has_croms?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'PROM' | 'CROM'>('CROM');

  useEffect(() => {
  const fetchPatient = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      // 1. Erst versuchen: CROM-Endpunkt
      //let res = await fetch(`${baseUrl}/api/patients/${patientId}`);
      //let res = await fetch(`${baseUrl}/api/patients/by-external-code/${patientId}`);
      let res = await fetch(`${baseUrl}/api/patient-lookup/${patientId}`);
      let data;

      if (res.ok) {
        data = await res.json();
      } else {
        // 2. Wenn CROM fehl schlägt → versuch PROM-Endpunkt
        res = await fetch(`${baseUrl}/api/proms/patient-info/${patientId}`);
        if (!res.ok) throw new Error("Patient not found in PROMs or CROMs");
        data = await res.json();
      }

      setPatientInfo(data);
      setView(data.has_proms && !data.has_croms ? 'PROM' : 'CROM');
    } catch (err) {
      console.error('Fehler beim Laden des Patienten:', err);
    } finally {
      setLoading(false);
    }
  };

  if (patientId) fetchPatient();
}, [patientId]);



  if (loading || !patientInfo) return <p>{t('patientDetail.loading')}</p>;

  const showToggle = patientInfo.has_proms && patientInfo.has_croms;

  return (
    <div style={{ padding: '2rem' }}>
      <div className="flex items-center mb-4">
        <IconButton onClick={() => navigate(-1)} aria-label="back" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <h1 className="overview-title">
          {t('patientDetail.title', { pid: patientInfo.patient_id })}
        </h1>
      </div>

      {showToggle && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={view}
            onChange={(_, newValue) => setView(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={t('patientDetail.tabs.croms')} value="CROM" />
            <Tab label={t('patientDetail.tabs.proms')} value="PROM" />
          </Tabs>
        </Box>
      )}

      {view === 'CROM' && patientInfo.has_croms && (
        <CromsDetailView patientId={patientInfo.patient_id} />
      )}

      {view === 'PROM' && patientInfo.has_proms && (
        <PromDetailView patientId={patientInfo.patient_id} />
      )}
    </div>
  );
};

export default PatientDetailView;