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