import { useEffect, useState } from 'react';

export const usePatientCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/patient-count')
      .then(response => response.json())
      .then(data => {
        setCount(data.patient_count); 
        setLoading(false);
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Patientenzahl:', error);
        setLoading(false);
      });
  }, []);

  return { count, loading };
};