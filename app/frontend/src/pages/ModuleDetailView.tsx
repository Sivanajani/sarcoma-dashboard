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
        console.log("MODULDETAIL-DATA:", json);
        console.log("module_data:", json.module_data);
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
    <h3>{t("moduleDetail.dataTableTitle", { defaultValue: "Daten aus dem Modul" })}</h3>
    <RawModuleDataTable moduleData={data.module_data} />


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
  </div>
  );
};

export default ModuleDetailView;