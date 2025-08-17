/**
 * usePatientCount.ts
 *
 * Zweck:
 * - Custom React Hook zur Abfrage und Bereitstellung von Patientenzahlen
 *   aus verschiedenen Datenquellen (CROMs, PROMs, kombiniert).
 *
 * Funktionsweise:
 * - Beim ersten Rendern (`useEffect` mit leerem Dependency-Array) werden
 *   drei API-Endpoints parallel aufgerufen:
 *   1. `/api/patient-count` → Anzahl CROM-Patient:innen
 *   2. `/api/proms/patient-count` → Anzahl PROM-Patient:innen
 *   3. `/api/patients/summary/combined-count` → Gesamtzahl (Kombination)
 * - Die Ergebnisse werden als `counts` im State gespeichert.
 * - Der Ladezustand (`loading`) wird automatisch verwaltet.
 *
 * Rückgabewerte:
 * - `counts`: Objekt mit `croms`, `proms`, `combined` (jeweils `number | null`)
 * - `loading`: Boolean, ob die Daten noch geladen werden
 *
 * Nutzung:
 * ```tsx
 * const { counts, loading } = usePatientCount();
 * if (loading) return <Spinner />;
 * return <div>{counts.croms} CROM-Patient:innen</div>;
 * ```
 *
 * Abhängigkeiten:
 * - Verwendet `fetch` und liest die Basis-URL aus `import.meta.env.VITE_API_BASE_URL`
 * - Läuft automatisch einmal beim Mount der Komponente
 */


import { useEffect, useState } from 'react';

type PatientCounts = {
  croms: number | null;
  proms: number | null;
  combined: number | null;
};

export const usePatientCount = () => {
  const [counts, setCounts] = useState<PatientCounts>({
    croms: null,
    proms: null,
    combined: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [cromsRes, promsRes, combinedRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patient-count`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proms/patient-count`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients/summary/combined-count`),
        ]);

        const cromsData = await cromsRes.json();
        const promsData = await promsRes.json();
        const combinedData = await combinedRes.json();

        setCounts({
          croms: cromsData.patient_count ?? null,
          proms: promsData.patient_count ?? null,
          combined: combinedData.combined_patient_count ?? null,
        });
      } catch (error) {
        console.error('Fehler beim Laden der Patientenzahlen:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, loading };
};