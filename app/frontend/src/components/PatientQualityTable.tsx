import React from 'react';
import './PatientQualityTable.css';

type PatientQuality = {
  patient_id: string;
  completeness: number;
  correctness: number;
  consistency: number;
  timeliness: number;
  uniqueness: number;
  plausibility: number;
};

const dummyData: PatientQuality[] = [
  {
    patient_id: 'P001',
    completeness: 98,
    correctness: 95,
    consistency: 90,
    timeliness: 85,
    uniqueness: 100,
    plausibility: 95,
  },
  {
    patient_id: 'P002',
    completeness: 89,
    correctness: 92,
    consistency: 85,
    timeliness: 70,
    uniqueness: 100,
    plausibility: 90,
  },
  {
    patient_id: 'P003',
    completeness: 76,
    correctness: 89,
    consistency: 80,
    timeliness: 60,
    uniqueness: 90,
    plausibility: 85,
  },
];

// Funktion für Ampelfarben
const getColorClass = (value: number): string => {
  if (value >= 90) return 'green';
  if (value >= 70) return 'yellow';
  return 'red';
};

const PatientQualityTable: React.FC = () => {
  return (
    <div className="patient-quality-table">
      <h2 className="overview-title">Patient Overview – Data Quality</h2>
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Vollst.</th>
            <th>Korr.</th>
            <th>Konsist.</th>
            <th>Aktualität</th>
            <th>Eindeutigkeit</th>
            <th>Plausib.</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((p) => (
            <tr key={p.patient_id}>
              <td>{p.patient_id}</td>
              <td className={`value ${getColorClass(p.completeness)}`}>{p.completeness}%</td>
              <td className={`value ${getColorClass(p.correctness)}`}>{p.correctness}%</td>
              <td className={`value ${getColorClass(p.consistency)}`}>{p.consistency}%</td>
              <td className={`value ${getColorClass(p.timeliness)}`}>{p.timeliness}%</td>
              <td className={`value ${getColorClass(p.uniqueness)}`}>{p.uniqueness}%</td>
              <td className={`value ${getColorClass(p.plausibility)}`}>{p.plausibility}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientQualityTable;
