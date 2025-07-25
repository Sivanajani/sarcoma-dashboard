import React from "react";
import { Card, Divider, CardContent } from "@mui/material";
import { format } from "date-fns";
import { Box, Typography } from "@mui/material";


type BiopsyEntry = {
  biopsy_row_id: number;
  biopsy_date: string;
  biopsy_institution: string | null;
  biopsy_notwendigkeit: boolean | null;
  biopsy_angst: boolean | null;
  biopsy_erklaerung: boolean | null;
  biopsy_verstehen: boolean | null;
  biopsy_schmerz_wie_erwartet: string | null;
  biopsy_schmerz: number | null;
  biopsy_medikamente: boolean | null;
  biopsy_beobachtungszeitraum: string | null;
  biopsy_blutende_wunde: boolean | null;
  biopsy_probleme_wunde: boolean | null;
  biopsy_schmerzkontrolle: boolean | null;
  biopsy_team_raum: number | null;
  biopsy_organisation: number | null;
  biopsy_eqvas: number | null;
  biopsy_questions: string | null;
};

type Props = {
  data: BiopsyEntry[];
};

const BiopsyDetail: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <p>Keine Biopsie-Daten vorhanden.</p>;
  
  return (
  <div>
    <Box display="flex" flexWrap="wrap" gap={3} justifyContent="flex-start">
      {data.map((entry) => (
        <Card
          key={entry.biopsy_row_id}
          sx={{
          width: 360,
          flexGrow: 1,
          flexBasis: '360px',
          minHeight: '100%',
          boxShadow: 3,
          borderRadius: 2,
          }} >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Biopsie vom {format(new Date(entry.biopsy_date), "dd.MM.yyyy")}
            </Typography>
            <Divider sx={{ mb: 1 }} />

            <Typography fontWeight="bold"> Basis</Typography>
            <Typography>Institution: {entry.biopsy_institution}</Typography>

            <Typography fontWeight="bold" mt={1}>Vorbereitung</Typography>
            <Typography>Notwendigkeit: {entry.biopsy_notwendigkeit ? "Ja" : "Nein"}</Typography>
            <Typography>Angst: {entry.biopsy_angst ? "Ja" : "Nein"}</Typography>
            <Typography>Erklärung: {entry.biopsy_erklaerung ? "Ja" : "Nein"}</Typography>
            <Typography>Verstanden: {entry.biopsy_verstehen ? "Ja" : "Nein"}</Typography>

            <Typography fontWeight="bold" mt={1}> Erfahrung</Typography>
            <Typography>Schmerz erwartet: {entry.biopsy_schmerz_wie_erwartet}</Typography>
            <Typography>Schmerzskala: {entry.biopsy_schmerz ?? "-"}/10</Typography>
            <Typography>Medikamente: {entry.biopsy_medikamente ? "Ja" : "Nein"}</Typography>

            <Typography fontWeight="bold" mt={1}> Nachsorge</Typography>
            <Typography>Beobachtungszeitraum: {entry.biopsy_beobachtungszeitraum}</Typography>
            <Typography>Blutende Wunde: {entry.biopsy_blutende_wunde ? "Ja" : "Nein"}</Typography>
            <Typography>Wundprobleme: {entry.biopsy_probleme_wunde ? "Ja" : "Nein"}</Typography>
            <Typography>Schmerzkontrolle: {entry.biopsy_schmerzkontrolle ? "Ja" : "Nein"}</Typography>

            <Typography fontWeight="bold" mt={1}> Bewertung</Typography>
            <Typography>Team & Raum: {entry.biopsy_team_raum ?? "-"}/10</Typography>
            <Typography>Organisation: {entry.biopsy_organisation ?? "-"}/10</Typography>
            <Typography>EQ-VAS: {entry.biopsy_eqvas ?? "-"}/100</Typography>
            <Typography>Kommentar: {entry.biopsy_questions || "–"}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </div>
);};

export default BiopsyDetail;