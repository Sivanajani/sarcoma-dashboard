import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const DuplicateNotifier = () => {
  const navigate = useNavigate();

  const modules = [
    { name: 'diagnosis', url: 'http://localhost:8000/api/uniqueness/diagnosis/patient' },
    { name: 'surgery', url: 'http://localhost:8000/api/uniqueness/surgery/patient' },
    { name: 'pathology', url: 'http://localhost:8000/api/uniqueness/surgery/pathologies/patient' },
    { name: 'radiology_exam', url: 'http://localhost:8000/api/uniqueness/surgery/radiologyExams/patient' },
    { name: 'radiology_therapy', url: 'http://localhost:8000/api/uniqueness/radiologyTherapies/patient' },
    { name: 'sarcoma_board', url: 'http://localhost:8000/api/uniqueness/sarcomaBoards/patient' },
    { name: 'systemic_therapy', url: 'http://localhost:8000/api/uniqueness/systemicTherapies/patient' },
    { name: 'hyperthermia_therapy', url: 'http://localhost:8000/api/uniqueness/hyperthermiaTherapies/patient' },
  ];

  useEffect(() => {
    const checkAllModules = async () => {
      const duplicateMap: Record<number, { count: number; modules: string[] }> = {};

      for (const module of modules) {
        try {
          const res = await fetch(module.url);
          const data = await res.json();

          for (const entry of data.duplicate_summary_per_patient || []) {
            const id = entry.patient_id;
            if (!duplicateMap[id]) {
              duplicateMap[id] = { count: 0, modules: [] };
            }
            duplicateMap[id].count += entry.duplicate_count || 1;
            duplicateMap[id].modules.push(module.name);
          }
        } catch (err) {
          console.error(`Fehler beim Laden von ${module.name}:`, err);
        }
      }

      const patientIdsWithDuplicates = Object.keys(duplicateMap);

      if (patientIdsWithDuplicates.length > 0) {
        for (const id of patientIdsWithDuplicates) {
          const { count, modules } = duplicateMap[+id];
          Swal.fire({
            title: `Achtung: Duplikate bei Patient ${id}`,
            html: `Es wurden <b>${count}</b> doppelte Einträge in folgenden Modulen gefunden:<br><ul>${modules
              .map((m) => `<li>${m}</li>`)
              .join('')}</ul>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Details ansehen',
            cancelButtonText: 'Später',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/patients/${id}`);
            }
          });
        }
      }
    };

    checkAllModules();
  }, []);

  return null;
};

export default DuplicateNotifier;
