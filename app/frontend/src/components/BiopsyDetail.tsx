/**
 * BiopsyDetail.tsx
 *
 * Zweck:
 * - Anzeige einer Liste von Biopsie-Einträgen im Kartenlayout
 * - Stellt alle erfassten Biopsie-Informationen in logisch gruppierten Abschnitten dar:
 *   - Basisinformationen
 *   - Vorbereitung
 *   - Erfahrung
 *   - Nachsorge
 *   - Bewertung
 *
 * Features:
 * - Formatierte Anzeige des Biopsiedatums (dd.MM.yyyy)
 * - Gruppierte Darstellung mit klaren Überschriften
 * - Klare Ja/Nein-Ausgabe für boolesche Felder
 * - Platzhalter („–“), wenn Werte nicht vorhanden sind
 * - Responsive Kartenanordnung mit flex-wrap
 *
 * Props:
 * - data: BiopsyEntry[]
 *   → Array mit Biopsie-Datensätzen (Backend-Response)
 *
 * Rückgabe:
 * - Rendert MUI-Karten mit allen Feldwerten
 * - Zeigt Text "Keine Biopsie-Daten vorhanden.", wenn kein Datensatz vorhanden ist
 *
 * Abhängigkeiten:
 * - @mui/material (Card, CardContent, Typography, Divider, Box)
 * - date-fns (format) für Datumsausgabe
 *
 * Typische Verwendung:
 * <BiopsyDetail data={biopsyEntries} />
 */


import React from "react";
import { Card, Divider, CardContent } from "@mui/material";
import { format } from "date-fns";
import { Box, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation();
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
              {t('databasePage.biopsy_date')} {format(new Date(entry.biopsy_date), "dd.MM.yyyy")}
            </Typography>
            <Divider sx={{ mb: 1 }} />

            <Typography fontWeight="bold"> Basis</Typography>
            <Typography>{t('databasePage.institution')}: {entry.biopsy_institution}</Typography>

            <Typography fontWeight="bold" mt={1}>Vorbereitung</Typography>
            <Typography>{t('databasePage.biopsy_notwendigkeit')}: {entry.biopsy_notwendigkeit ? "Ja" : "Nein"}</Typography>
            <Typography>{t('databasePage.angst')}: {entry.biopsy_angst ? "Ja" : "Nein"}</Typography>
            <Typography>{t('databasePage.biopsy_erklaerung')}: {entry.biopsy_erklaerung ? "Ja" : "Nein"}</Typography>
            <Typography>{t('databasePage.biopsy_verstehen')}: {entry.biopsy_verstehen ? "Ja" : "Nein"}</Typography>

            <Typography fontWeight="bold" mt={1}> Erfahrung</Typography>
            <Typography>{t('databasePage.biopsy_schmerz_wie_erwartet')}: {entry.biopsy_schmerz_wie_erwartet}</Typography>
            <Typography>{t('databasePage.biopsy_schmerz')}: {entry.biopsy_schmerz ?? "-"}/10</Typography>
            <Typography>{t('databasePage.biopsy_medikamente')}: {entry.biopsy_medikamente ? "Ja" : "Nein"}</Typography>

            <Typography fontWeight="bold" mt={1}> Nachsorge</Typography>
            <Typography>{t('databasePage.biopsy_beobachtungszeitraum')}: {entry.biopsy_beobachtungszeitraum}</Typography>
            <Typography>{t('databasePage.biopsy_blutende_wunde')}: {entry.biopsy_blutende_wunde ? "Ja" : "Nein"}</Typography>
            <Typography>{t('databasePage.biopsy_probleme_wunde')}: {entry.biopsy_probleme_wunde ? "Ja" : "Nein"}</Typography>
            <Typography>{t('databasePage.biopsy_schmerzkontrolle')}: {entry.biopsy_schmerzkontrolle ? "Ja" : "Nein"}</Typography>

            <Typography fontWeight="bold" mt={1}> Bewertung</Typography>
            <Typography>{t('databasePage.biopsy_team_raum')}: {entry.biopsy_team_raum ?? "-"}/10</Typography>
            <Typography>{t('databasePage.biopsy_organisation')}: {entry.biopsy_organisation ?? "-"}/10</Typography>
            <Typography>{t('databasePage.biopsy_eqvas')}: {entry.biopsy_eqvas ?? "-"}/100</Typography>
            <Typography>{t('databasePage.biopsy_questions')}: {entry.biopsy_questions || "–"}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </div>
);};

export default BiopsyDetail;