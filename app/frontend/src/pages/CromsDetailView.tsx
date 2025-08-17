/**
 * CromsDetailView.tsx
 *
 * Zweck:
 * - Container-Komponente, die alle Qualitätsmetriken (Vollständigkeit, Korrektheit,
 *   Konsistenz, Aktualität) für die CROM-Module einer bestimmten Patient:in lädt
 *   und an `CromsDetail` zur Darstellung übergibt.
 *
 * Props:
 * - `patientId: string` → Externe Patienten-ID (z. B. "P8"), die im Backend auf
 *   die interne ID gemappt wird.
 *
 * Funktionsweise:
 * 1. Beim Mounten:
 *    - API-Request `/api/patients/by-external-code/{patientId}` zum Ermitteln der internen ID.
 *    - Parallel werden alle relevanten Qualitätsmetriken geladen:
 *         `/api/patients/{internalId}/module-metrics`
 *         `/api/patients/{internalId}/correctness-patient`
 *         `/api/patients/{internalId}/consistency-patient`
 *         `/api/patients/{internalId}/actuality-patient`
 *    - Die Metriken werden anhand des Modulnamens (`name`) zusammengeführt.
 * 2. Statusverwaltung:
 *    - `loading`: Zeigt einen Lade-Text während der API-Abfragen.
 *    - `error`: Zeigt eine Fehlermeldung bei nicht erfolgreichen Requests.
 * 3. Gibt die angereicherten Module an `CromsDetail` weiter, um die Darstellung
 *    zu übernehmen.
 *
 * Abhängigkeiten:
 * - `CromsDetail`: Präsentationskomponente für die Anzeige der einzelnen Modul-Karten.
 * - `useTranslation` (i18next): Mehrsprachige Labels für Lade- und Fehlermeldungen.
 * - Backend-Endpunkte: Muss sowohl Mapping von externen zu internen IDs als auch
 *   Modul-Metriken bereitstellen.
 *
 * Nutzung:
 * ```tsx
 * <CromsDetailView patientId="P8" />
 * ```
 */

import React, { useEffect, useState } from 'react';
import CromsDetail from './CromsDetail';
import { useTranslation } from 'react-i18next';
import type { QualityMetrics } from '../types/metrics';

interface Props {
  patientId: string; 
}

const CromsDetailView: React.FC<Props> = ({ patientId }) => {
  const { t } = useTranslation();
  const [modules, setModules] = useState<QualityMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Hole die interne ID anhand der external ID (z. B. P8 → 8)
        const idRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/by-external-code/${patientId}`);
        if (!idRes.ok) throw new Error("Patient not found");
        const idData = await idRes.json();
        const internalId = idData.patient_id;

        // 2. Hole alle Qualitätsmetriken basierend auf interner ID
        const [moduleRes, correctnessRes, consistencyRes, actualityRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${internalId}/module-metrics`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${internalId}/correctness-patient`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${internalId}/consistency-patient`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/${internalId}/actuality-patient`),
        ]);

        const [moduleData, correctnessData, consistencyData, actualityData] = await Promise.all([
          moduleRes.json(),
          correctnessRes.json(),
          consistencyRes.json(),
          actualityRes.json(),
        ]);

        const enrichedModules = moduleData.map((mod: any) => {
          const correctnessEntry = correctnessData.find((c: any) => c.name === mod.name);
          const consistencyEntry = consistencyData.find((c: any) => c.name === mod.name);
          const actualityEntry = actualityData.find((c: any) => c.name === mod.name);
          return {
            ...mod,
            correctness: correctnessEntry?.correctness ?? null,
            consistency: consistencyEntry?.consistency ?? null,
            actuality: actualityEntry?.actuality ?? null,
          };
        });

        setModules(enrichedModules);
      } catch (err) {
        console.error('Fehler beim Laden der CROM-Daten:', err);
        setError(t('patientDetail.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, t]);

  if (loading) return <p>{t('patientDetail.loading')}</p>;
  if (error) return <p>{error}</p>;

  return <CromsDetail modules={modules} patientId={patientId} />;
};

export default CromsDetailView;