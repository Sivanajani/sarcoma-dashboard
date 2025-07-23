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
          fetch('http://localhost:8000/api/patient-count'),
          fetch('http://localhost:8000/api/proms/patient-count'),
          fetch('http://localhost:8000/api/patients/summary/combined-count'),
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