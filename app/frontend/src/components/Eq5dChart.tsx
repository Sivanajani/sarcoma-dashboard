import React, { useState } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Box, Checkbox, FormControlLabel, FormGroup, Typography,
  ToggleButton, ToggleButtonGroup, TextField, Button
} from '@mui/material';

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

const colors = [
  '#8884d8', '#82ca9d', '#ffc658',
  '#ff7f50', '#a83232', '#000000',
  '#5f9ea0', '#9acd32'
];

const fieldLabels: Record<string, string> = {
  mobilitaet: 'Mobilität',
  selbstversorgung: 'Selbstversorgung',
  gewohnte_aktivitaeten: 'Aktivitäten',
  schmerz: 'Schmerz',
  angst: 'Angst',
  vas: 'VAS',
  belastung: 'Belastung',
  funktion: 'Funktion'
};

const Eq5dChart: React.FC<Props> = ({ data }) => {
  const allLabels = Object.values(fieldLabels);

  const [selectedFields, setSelectedFields] = useState<string[]>(allLabels);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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

  const filteredData = chartData.filter(entry => {
    const date = new Date(entry.date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const resetChart = () => {
    setSelectedFields(allLabels);
    setStartDate(null);
    setEndDate(null);
    setChartType('line');
  };

  return (
    <Box>
      {/* Steuerung */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <FormGroup row>
          {allLabels.map(label => (
            <FormControlLabel
              key={label}
              control={
                <Checkbox
                  checked={selectedFields.includes(label)}
                  onChange={() => handleFieldToggle(label)}
                />
              }
              label={label}
            />
          ))}
        </FormGroup>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            type="date"
            label="Startdatum"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={startDate ?? ''}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            type="date"
            label="Enddatum"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={endDate ?? ''}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, value) => value && setChartType(value)}
            size="small"
          >
            <ToggleButton value="line">Linie</ToggleButton>
            <ToggleButton value="bar">Balken</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="outlined" size="small" onClick={resetChart}>
            Zurücksetzen
          </Button>
        </Box>
      </Box>

      {/* Diagramm */}
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} allowDecimals={false} />
            <Tooltip />
            <Legend />
            {selectedFields.map((field, idx) => (
              <Line
                key={field}
                type="monotone"
                dataKey={field}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} allowDecimals={false} />
            <Tooltip />
            <Legend />
            {selectedFields.map((field, idx) => (
              <Bar
                key={field}
                dataKey={field}
                fill={colors[idx % colors.length]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>

      {filteredData.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Keine Daten im gewählten Zeitraum verfügbar.
        </Typography>
      )}
    </Box>
  );
};

export default Eq5dChart;