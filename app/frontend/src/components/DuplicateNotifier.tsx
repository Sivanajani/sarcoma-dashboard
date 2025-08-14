import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

type Endpoint = { source: 'croms' | 'proms'; name: string; url: string };

const DuplicateNotifier = () => {
  const { t } = useTranslation();
  const didRunRef = useRef(false);

  const endpoints: Endpoint[] = [
    // CROMs
    { source: 'croms', name: 'diagnosis',            url: 'http://localhost:8000/api/uniqueness/diagnosis/patient' },
    { source: 'croms', name: 'surgery',              url: 'http://localhost:8000/api/uniqueness/surgery/patient' },
    { source: 'croms', name: 'pathology',            url: 'http://localhost:8000/api/uniqueness/surgery/pathologies/patient' },
    { source: 'croms', name: 'radiology_exam',       url: 'http://localhost:8000/api/uniqueness/surgery/radiologyExams/patient' },
    { source: 'croms', name: 'radiology_therapy',    url: 'http://localhost:8000/api/uniqueness/radiologyTherapies/patient' },
    { source: 'croms', name: 'sarcoma_board',        url: 'http://localhost:8000/api/uniqueness/sarcomaBoards/patient' },
    { source: 'croms', name: 'systemic_therapy',     url: 'http://localhost:8000/api/uniqueness/systemicTherapies/patient' },
    { source: 'croms', name: 'hyperthermia_therapy', url: 'http://localhost:8000/api/uniqueness/hyperthermiaTherapies/patient' },
    // PROMs
    { source: 'proms', name: 'eq5d',                 url: 'http://localhost:8000/api/proms/eq5d/uniqueness' },
    { source: 'proms', name: 'biopsy',               url: 'http://localhost:8000/api/proms/biopsy/uniqueness' },
  ];

  useEffect(() => {
    if (didRunRef.current) return;
    if (sessionStorage.getItem('duplicates_notified') === '1') return;
    didRunRef.current = true;
    
    const checkAllModules = async () => {
      type BySource = { total: number; modules: Record<string, number> };
      const map: Record<string, { total: number; bySource: { croms?: BySource; proms?: BySource } }> = {};

      // Normalisiert verschiedene Backend-Formate zu einer Zeilenliste
      const normalizeRows = (json: any): any[] => {
        if (!json) return [];
        if (Array.isArray(json)) return json.flat();
        return json.duplicate_summary_per_patient ?? json.duplicates ?? [];
      };

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep.url);
          const json = await res.json();
          const rows = normalizeRows(json);

          for (const row of rows) {
            // Patient-ID robust extrahieren (PROM: pid)
            const pidRaw = row.patient_id ?? row.patient_external_code ?? row.pid ?? row.id;
            if (pidRaw == null) continue;
            const pid = String(pidRaw);

            // Anzahl robust extrahieren (PROM: anzahl)
            const inc = Number(row.duplicate_count ?? row.count ?? row.anzahl ?? 1);
            if (!Number.isFinite(inc) || inc <= 0) continue;

            if (!map[pid]) map[pid] = { total: 0, bySource: {} };
            map[pid].total += inc;

            if (!map[pid].bySource[ep.source]) map[pid].bySource[ep.source] = { total: 0, modules: {} };
            const src = map[pid].bySource[ep.source]!;
            src.total += inc;
            src.modules[ep.name] = (src.modules[ep.name] ?? 0) + inc;
          }
        } catch (err) {
          console.error(`Fehler beim Laden von ${ep.source}/${ep.name}:`, err);
        }
      }

      const patientIds = Object.keys(map);
      if (patientIds.length === 0) return;

      for (const pid of patientIds) {
        const entry = map[pid];
        const sections: string[] = [];

        const renderSection = (source: 'croms' | 'proms') => {
          const src = entry.bySource[source];
          if (!src || src.total <= 0) return;
          const header = `<div style="margin-top:8px;"><b>${t(`patientTable.tabs.${source}`, source)}:</b> <span>${src.total}</span></div>`;
          const list = Object.entries(src.modules)
            .sort((a, b) => b[1] - a[1])
            .map(([m, c]) => `<li>${t(`modules.${m}`, m)}: <b>${c}</b></li>`)
            .join('');
          sections.push(`${header}<ul style="margin:6px 0 0 18px;">${list}</ul>`);
        };

        renderSection('croms');
        renderSection('proms');

        await Swal.fire({
          title: t('duplicateNotifier.title', { id: pid }),
          html: `${t('duplicateNotifier.message', { count: entry.total })}${sections.join('')}`,
          icon: 'warning',
          confirmButtonText: t('duplicateNotifier.ok'),
        });
      }
      sessionStorage.setItem('duplicates_notified', '1');
    };

    checkAllModules();
  }, []);

  return null;
};

export default DuplicateNotifier;