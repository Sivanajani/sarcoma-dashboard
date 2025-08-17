/**
 * ModuleDetailView.tsx
 *
 * Zweck:
 * - Zeigt die Detailansicht eines einzelnen Moduls (CROM oder PROM) für eine:n spezifische:n Patient:in.
 * - Stellt sowohl die berechneten Qualitätsdimensionen (Vollständigkeit, Korrektheit, Konsistenz, Aktualität)
 *   als auch die Rohdaten des Moduls dar.
 *
 * Routing:
 * - Erwartet URL-Parameter `externalCode` (z. B. "P8") und `module` (z. B. "diagnosis").
 *   → Diese kommen aus der Route `/patients/:externalCode/:module/details`.
 *
 * Datenfluss:
 * 1. Beim Laden werden über `useEffect` die Moduldaten aus dem Backend geholt:
 *    - Endpoint: `/api/patients/by-external-code/{externalCode}/{module}/details`
 *    - Rückgabe enthält:
 *       - `completeness`, `correctness`, `consistency`, `actuality` (falls verfügbar)
 *       - `module_data` (Rohdaten des Moduls)
 * 2. Fehler beim Laden werden in `error` gespeichert und rot angezeigt.
 * 3. Solange keine Daten vorliegen, wird ein Lade-Text angezeigt (`t("moduleDetail.loading")`).
 *
 * Rendering:
 * - Titelzeile: Modulname (übersetzt) und Patient:innen-Code.
 * - **Qualitätskarten**:
 *   - Iteration über die vordefinierte Liste `qualityDimensions`.
 *   - Falls zu einer Dimension Daten existieren (`data[dimension]`), wird eine Karte angezeigt.
 *   - Inhalt der Karte wird mit `ModuleDetailContent` gerendert.
 * - **Rohdaten-Tabelle**:
 *   - Darstellung aller Originalfelder des Moduls mit `RawModuleDataTable`.
 *
 * Übersetzungen:
 * - Modulnamen, Labels und Lade-/Fehlertexte über `react-i18next`.
 * - Falls kein Übersetzungsschlüssel vorhanden, wird der Modulname direkt angezeigt.
 *
 * Beispiel:
 * ```
 * /patients/P8/diagnosis/details
 * ```
 * → Zeigt Diagnose-Moduldaten und Qualitätsbewertungen für Patient:in P8.
 */


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './DatabasePage.css';
import ModuleDetailContent from './ModuleDetailContent';
import RawModuleDataTable from './RawModuleDataTable';


const ModuleDetailView: React.FC = () => {
  const { externalCode, module } = useParams();
  const { t } = useTranslation();
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/patients/by-external-code/${externalCode}/${module}/details`
        );
        const json = await res.json();              
        setData(json);
      } catch (err) {
        console.error(err);
        setError(t("moduleDetail.loadError"));
      }
    };

    fetchData();
  }, [externalCode, module, t]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!data) return <p>{t("moduleDetail.loading", { module })}</p>;

  // Liste der unterstützten Qualitätsdimensionen
  const qualityDimensions = ['completeness', 'correctness', 'consistency', 'actuality'];

  return (
  <div className="dashboard-main">
    <h2> {t(`modules.${module}`, { defaultValue: module })} – {t('moduleDetail.patient')} {externalCode} </h2>
    

    {/* Einmalige Datenansicht des Moduls */}    
    <div className="module-cards-container">
      {qualityDimensions.map((dimension) => (
        data[dimension] && (
        <div key={dimension} className="module-card">
          <div className="module-card-body">
            <ModuleDetailContent 
            dimension={dimension} 
            dimensionData={data[dimension]}
            moduleData={data.module_data} />
          </div>
        </div>
      )
      ))}
    </div>
    {/* Rohdaten-Tabelle */}
    <RawModuleDataTable moduleData={data.module_data} moduleName={module || ''} />
  </div>
  );
};

export default ModuleDetailView;