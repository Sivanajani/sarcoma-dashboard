/**
 * CromsDetail.tsx
 *
 * Zweck:
 * - Zeigt die Qualitätsmetriken (z. B. Vollständigkeit, Korrektheit, Konsistenz, Aktualität)
 *   für alle CROM-Module (Clinician Reported Outcome Measures) einer bestimmten Patient:in.
 * - Jede Modulkarte ist klickbar und führt zur Detailansicht des Moduls.
 *
 * Props:
 * - `modules: QualityMetrics[]` → Liste der Module mit allen Qualitätskennzahlen.
 * - `patientId: string` → Eindeutige Patienten-ID für Navigation zu den Detailseiten.
 *
 * Funktionsweise:
 * 1. Iteriert über alle übergebenen `modules`.
 * 2. Für jede Karte:
 *    - Titel aus den Übersetzungen (`modulesDetail.{modulname}`).
 *    - Vollständigkeit und ggf. Korrektheit, Konsistenz, Aktualität farblich
 *      nach Grenzwerten markiert:
 *         >= 90% → grün
 *         >= 60% → gelb
 *         < 60%  → rot
 *    - Anzeige der Anzahl ausgefüllter Felder (`fieldsFilled`) im Verhältnis zur Gesamtanzahl (`fieldsTotal`).
 * 3. Klick auf eine Karte navigiert zur Detailansicht:
 *    `/patients/{patientId}/{moduleName}/details`.
 *
 * Styling:
 * - CSS-Klassen `completeness-green`, `completeness-yellow`, `completeness-red`
 *   steuern die Farbdarstellung der Metriken.
 * - Gesamtes Kartenlayout über `ModuleCard.css`.
 *
 * Abhängigkeiten:
 * - react-router-dom: Navigation (`useNavigate`).
 * - i18next: Mehrsprachige Labels und Tooltips.
 * - QualityMetrics-Typ aus `types/metrics`.
 *
 * Nutzung:
 * ```tsx
 * <CromsDetail
 *   patientId="P123"
 *   modules={[
 *     { name: 'diagnosis', completeness: 95, correctness: 90, consistency: 88, actuality: 92, fieldsFilled: 20, fieldsTotal: 22 }
 *   ]}
 * />
 * ```
 */


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { QualityMetrics } from '../types/metrics';
import '../pages/ModuleCard.css';

interface CromsDetailProps {
  modules: QualityMetrics[];
  patientId: string;
}

const CromsDetail: React.FC<CromsDetailProps> = ({ modules, patientId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getCompletenessClass = (value: number) => {
    if (value >= 90) return 'completeness-green';
    if (value >= 60) return 'completeness-yellow';
    return 'completeness-red';
  };

  const getQualityClass = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '';
    if (value >= 90) return 'completeness-green';
    if (value >= 60) return 'completeness-yellow';
    return 'completeness-red';
  };

  return (
    <div className="module-container">
      {modules.map((mod) => (
        <div key={mod.name} className="module-card" onClick={() => {
          navigate(`/patients/${patientId}/${mod.name}/details`);
        }}
          title={t('patientDetail.moduleCardTooltip')}
          style={{ cursor: 'pointer' }}
        >
          <h4>{t(`modulesDetail.${mod.name}`, mod.name)}</h4>
          <p className={`highlight ${getCompletenessClass(mod.completeness)}`}>
            {t('patientDetail.completeness')}: {mod.completeness}%
          </p>
          {mod.correctness !== undefined && (
            <p className={`highlight ${getQualityClass(mod.correctness)}`}>
              {t('patientDetail.correctness')}: {mod.correctness}%
            </p>
          )}
          {mod.consistency !== undefined && (
            <p className={`highlight ${getQualityClass(mod.consistency)}`}>
              {t('patientDetail.consistency')}: {mod.consistency}%
            </p>
          )}
          {mod.actuality !== undefined && (
            <p className={`highlight ${getQualityClass(mod.actuality)}`}>
              {t('patientDetail.actuality')}: {mod.actuality}%
            </p>
          )}
          <p>
            {mod.fieldsFilled} {t('patientDetail.of')} {mod.fieldsTotal} {t('patientDetail.fields')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CromsDetail;