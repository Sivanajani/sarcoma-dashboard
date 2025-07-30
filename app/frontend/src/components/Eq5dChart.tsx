import React, { useState, useRef, useMemo } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Box, Checkbox, FormControlLabel, FormGroup, Typography,
  ToggleButton, ToggleButtonGroup, TextField, Button,
  InputAdornment, IconButton
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { toPng } from 'html-to-image';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

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

const defaultColors = [
  '#1976d2', '#26a69a', '#ffa726',
  '#ef5350', '#ab47bc', '#455a64',
  '#66bb6a', '#ffca28'
];

const Eq5dChart: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();

  const fieldLabels: Record<keyof Eq5dEntry, string> = useMemo(() => ({
    mobilitaet: t('eq5dChart.fields.mobilitaet'),
    selbstversorgung: t('eq5dChart.fields.selbstversorgung'),
    gewohnte_aktivitaeten: t('eq5dChart.fields.gewohnte_aktivitaeten'),
    schmerz: t('eq5dChart.fields.schmerz'),
    angst: t('eq5dChart.fields.angst'),
    vas: t('eq5dChart.fields.vas'),
    belastung: t('eq5dChart.fields.belastung'),
    funktion: t('eq5dChart.fields.funktion'),
    date: '',
  }), [t]);

  const fieldKeys = Object.keys(fieldLabels).filter(k => k !== 'date') as (keyof Eq5dEntry)[];
  const [selectedFields, setSelectedFields] = useState<(keyof Eq5dEntry)[]>(fieldKeys);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'radar'>('line');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [fieldColors, setFieldColors] = useState<Record<string, string>>(
    Object.fromEntries(fieldKeys.map((key, i) => [key, defaultColors[i % defaultColors.length]]))
  );
  const [exportTitle, setExportTitle] = useState<string>('');

  const startInputRef = useRef<HTMLInputElement | null>(null);
  const endInputRef = useRef<HTMLInputElement | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleFieldToggle = (field: keyof Eq5dEntry) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const resetChart = () => {
    setSelectedFields(fieldKeys);
    setStartDate(null);
    setEndDate(null);
    setChartType('line');
  };

  const chartData = data.map(entry => ({ ...entry }));
  const filteredData = chartData.filter(entry => {
    const date = new Date(entry.date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  const latestEntry = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
  const radarData = latestEntry
    ? selectedFields.map((key) => ({
        dimension: fieldLabels[key],
        value: latestEntry[key] ?? 0,
      }))
    : [];
  
    const radarDataMulti = selectedFields.map((key) => {
  const entry: any = { dimension: fieldLabels[key] };
  filteredData.forEach(d => {
    const label = format(new Date(d.date), "dd.MM");
    entry[label] = d[key];
  });
  return entry;
});

  const exportChartAsImage = async () => {
    const exportDialogTitle = t('eq5dChart.exportTitle');
    const exportPlaceholder = t('eq5dChart.exportPlaceholder');
    const exportConfirm = t('eq5dChart.exportConfirm');
    const exportCancel = t('eq5dChart.exportCancel');

    const { value: formValues } = await Swal.fire({
      title: exportDialogTitle,
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <input id="swal-title" class="swal2-input" placeholder="${exportPlaceholder}" style="margin-bottom:20px;" />
          <div style="display: grid; grid-template-columns: auto auto; gap: 12px; max-width: 400px;">
            ${selectedFields.map(key => `
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="min-width:120px;">${fieldLabels[key]}</span>
                <input type="color" id="color-${key}" value="${fieldColors[key]}" style="width: 40px; height: 30px; border:none;" />
              </div>
            `).join('')}
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value;
        const colors: Record<string, string> = {};
        selectedFields.forEach(key => {
          const input = document.getElementById(`color-${key}`) as HTMLInputElement;
          colors[key] = input.value;
        });
        return { title, colors };
      },
      confirmButtonText: exportConfirm,
      showCancelButton: true,
      cancelButtonText: exportCancel
    });

    if (formValues && chartRef.current) {
      setFieldColors(formValues.colors);
      setExportTitle(formValues.title);
      setTimeout(() => {
        toPng(chartRef.current!).then((dataUrl) => {
          const link = document.createElement('a');
          const filename = formValues.title ? `${formValues.title}.png` : 'eq5d-chart.png';
          link.download = filename;
          link.href = dataUrl;
          link.click();
          setExportTitle('');
          setFieldColors(
            Object.fromEntries(fieldKeys.map((key, i) => [key, defaultColors[i % defaultColors.length]]))
          );
        });
      }, 200);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#fafafa', borderRadius: 2, p: 3, boxShadow: 1 }}>
      {/* Steuerung */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
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
            />
          ))}
        </FormGroup>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
      </Box>

      {/* Diagramm */}
      <div ref={chartRef}>
        {exportTitle && (
          <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
            {exportTitle}
          </Typography>
        )}
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'radar' ? (
            radarData.length > 0 ? (
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarDataMulti}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" />
              <PolarRadiusAxis domain={[0, 10]} />
              <Tooltip />
              {filteredData.map((entry, index) => {
                const label = format(new Date(entry.date), "dd.MM");
                const color = defaultColors[index % defaultColors.length];
                return (
                <Radar
                  key={label}
                  name={`${label}`}
                  dataKey={label}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                />
              );
              })}
              <Legend />
            </RadarChart>

              ) : (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('eq5dChart.noData')}
                  </Typography>
              </Box>
            )

          ) : chartType === 'line' ? (
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} allowDecimals={false} />
              <Tooltip />
              <Legend formatter={(value) => fieldLabels[value as keyof Eq5dEntry]} />
              {selectedFields.map(key => (
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
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} allowDecimals={false} />
              <Tooltip />
              <Legend formatter={(value) => fieldLabels[value as keyof Eq5dEntry]} />
              {selectedFields.map(key => (
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

      {filteredData.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t('eq5dChart.noData')}
        </Typography>
      )}
    </Box>
  );
};

export default Eq5dChart;
