import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Eq5dEntry {
  date: string;
  mobilitaet: number;
  selbstversorgung: number;
  gewohnte_aktivitaeten: number;
  schmerz: number;
  angst: number;
  vas: number;
  belastung: number;
  funktion: number;
}

interface Props {
  data: Eq5dEntry[];
}

const Eq5dChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(entry => ({
    date: entry.date,
    Mobilität: entry.mobilitaet,
    Selbstversorgung: entry.selbstversorgung,
    Aktivitäten: entry.gewohnte_aktivitaeten,
    Schmerz: entry.schmerz,
    Angst: entry.angst,
    VAS: entry.vas,
    Belastung: entry.belastung,
    Funktion: entry.funktion,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 5]} allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Mobilität" stroke="#8884d8" />
        <Line type="monotone" dataKey="Selbstversorgung" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Aktivitäten" stroke="#ffc658" />
        <Line type="monotone" dataKey="Schmerz" stroke="#ff7f50" />
        <Line type="monotone" dataKey="Angst" stroke="#a83232" />
        <Line type="monotone" dataKey="VAS" stroke="#000" />
        <Line type="monotone" dataKey="Belastung" stroke="#5f9ea0" />
        <Line type="monotone" dataKey="Funktion" stroke="#9acd32" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Eq5dChart;