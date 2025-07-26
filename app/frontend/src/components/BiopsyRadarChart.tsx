import React, { useState, useRef } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Box, Checkbox, FormControlLabel, FormGroup, Typography,
  ToggleButton, ToggleButtonGroup, TextField, Button,
  InputAdornment, IconButton
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { toPng } from "html-to-image";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

type BiopsyEntry = {
  biopsy_row_id: number;
  biopsy_date: string;
  biopsy_team_raum: number | null;
  biopsy_organisation: number | null;
  biopsy_eqvas: number | null;
  biopsy_schmerz: number | null;
};

type Props = {
  entries: BiopsyEntry[];
};

const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff6b6b'];

const BiopsyChartRadar: React.FC<Props> = ({ entries }) => {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement | null>(null);
  const endInputRef = useRef<HTMLInputElement | null>(null);

  const fieldKeys: (keyof BiopsyEntry)[] = [
    'biopsy_team_raum',
    'biopsy_organisation',
    'biopsy_eqvas',
    'biopsy_schmerz'
  ];

  const fieldLabels: Record<keyof BiopsyEntry, string> = {
    biopsy_row_id: '',
    biopsy_date: '',
    biopsy_team_raum: t('promDetail.biopsyChart.teamraum'),
    biopsy_organisation: t('promDetail.biopsyChart.organisation'),
    biopsy_eqvas: t('promDetail.biopsyChart.vas'),
    biopsy_schmerz: t('promDetail.biopsyChart.schmerz'),
  };

  const [selectedFields, setSelectedFields] = useState<(keyof BiopsyEntry)[]>(fieldKeys);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'radar'>('radar');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [fieldColors, setFieldColors] = useState<Record<string, string>>(
    Object.fromEntries(fieldKeys.map((key, i) => [key, defaultColors[i % defaultColors.length]]))
  );
  const [exportTitle, setExportTitle] = useState<string>("");

  const handleFieldToggle = (field: keyof BiopsyEntry) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const resetChart = () => {
    setSelectedFields(fieldKeys);
    setStartDate(null);
    setEndDate(null);
    setChartType('radar');
  };

  const filteredEntries = entries.filter(entry => {
    const date = new Date(entry.biopsy_date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  const chartData = filteredEntries.map(entry => ({
    date: new Date(entry.biopsy_date).toLocaleDateString("de-CH", { day: '2-digit', month: '2-digit' }),
    ...Object.fromEntries(
      selectedFields.map(key => [key, entry[key] ?? 0])
    )
  }));

  const exportChartAsImage = async () => {
    const { value: formValues } = await Swal.fire({
      title: t('eq5dChart.exportTitle'),
      html: `
        <input id="swal-title" class="swal2-input" placeholder="${t('eq5dChart.exportPlaceholder')}" />
        <div style="display: grid; grid-template-columns: auto auto; gap: 12px;">
          ${selectedFields.map(key => `
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span style="min-width:120px;">${fieldLabels[key]}</span>
              <input type="color" id="color-${key}" value="${fieldColors[key]}" />
            </div>
          `).join('')}
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById("swal-title") as HTMLInputElement).value;
        const colors: Record<string, string> = {};
        selectedFields.forEach(key => {
          const input = document.getElementById(`color-${key}`) as HTMLInputElement;
          colors[key] = input.value;
        });
        return { title, colors };
      },
      confirmButtonText: t('eq5dChart.exportConfirm'),
      showCancelButton: true,
      cancelButtonText: t('eq5dChart.exportCancel'),
    });

    if (formValues && chartRef.current) {
      setExportTitle(formValues.title);
      setFieldColors(formValues.colors);
      setTimeout(() => {
        toPng(chartRef.current!).then((dataUrl) => {
          const link = document.createElement('a');
          const filename = formValues.title ? `${formValues.title}.png` : 'biopsy-chart.png';
          link.download = filename;
          link.href = dataUrl;
          link.click();
          setExportTitle('');
        });
      }, 200);
    }
  };
  
  const CustomTooltip = ({ active, payload, label, fieldLabels }: any) => {
    if (active && payload && payload.length) {
        return (
        <div style={{
            background: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px'
        }}>
            <p><strong>{label}</strong></p>
            {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, margin: 0 }}>
                {fieldLabels[entry.dataKey] ?? entry.dataKey}: {entry.value}
            </p>
        ))}
        </div>
        );
    }
    return null;
  };
  
  const maxY = Math.max(
    ...filteredEntries.flatMap(entry =>
      selectedFields.map(key => Number(entry[key] ?? 0))
    )
  );
  const roundedMaxY = Math.ceil(maxY / 10) * 10 || 5;

  return (
    <Box sx={{ backgroundColor: '#fafafa', borderRadius: 2, p: 3, boxShadow: 1 }}>
      <FormGroup row>
        {fieldKeys.map(key => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={selectedFields.includes(key)}
                onChange={() => handleFieldToggle(key)}
              />
            }
            label={fieldLabels[key]}
            sx={{ color: 'text.primary' }}
          />
        ))}
      </FormGroup>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
        <TextField
          inputRef={startInputRef}
          type="date"
          label={t('eq5dChart.startDate')}
          size="small"
          InputLabelProps={{ shrink: true }}
          value={startDate ?? ''}
          onChange={(e) => setStartDate(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => startInputRef.current?.showPicker()} size="small">
                  <CalendarTodayIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          inputRef={endInputRef}
          type="date"
          label={t('eq5dChart.endDate')}
          size="small"
          InputLabelProps={{ shrink: true }}
          value={endDate ?? ''}
          onChange={(e) => setEndDate(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => endInputRef.current?.showPicker()} size="small">
                  <CalendarTodayIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(_, value) => value && setChartType(value)}
          size="small"
        >
          <ToggleButton value="line">{t('eq5dChart.line')}</ToggleButton>
          <ToggleButton value="bar">{t('eq5dChart.bar')}</ToggleButton>
          <ToggleButton value="radar">Radar</ToggleButton>
        </ToggleButtonGroup>
        <Button variant="outlined" size="small" onClick={resetChart}>
          {t('eq5dChart.reset')}
        </Button>
        <Button variant="outlined" size="small" onClick={exportChartAsImage}>
          {t('eq5dChart.export')}
        </Button>
      </Box>

      <div ref={chartRef}>
        {exportTitle && (
          <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
            {exportTitle}
          </Typography>
        )}
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'radar' ? (
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="date" />
              <PolarRadiusAxis domain={[0, roundedMaxY]} />
              <Tooltip content={<CustomTooltip fieldLabels={fieldLabels} />} />
              <Legend formatter={(value) => fieldLabels[value as keyof BiopsyEntry]} />
              {selectedFields.map((key) => (
                <Radar
                  key={key}
                  name={fieldLabels[key]}
                  dataKey={key}
                  stroke={fieldColors[key]}
                  fill={fieldColors[key]}
                  fillOpacity={0.6}
                />
              ))}
            </RadarChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} allowDecimals={false} />
              <Tooltip />
              <Legend formatter={(value) => fieldLabels[value as keyof BiopsyEntry]} />
              {selectedFields.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={fieldColors[key]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} allowDecimals={false} />
              <Tooltip />
              <Legend formatter={(value) => fieldLabels[value as keyof BiopsyEntry]} />
              {selectedFields.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={fieldColors[key]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Box>
  );
};

export default BiopsyChartRadar;