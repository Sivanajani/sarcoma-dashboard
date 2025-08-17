/**
 * usePatientStore (Zustand Store)
 *
 * Zweck:
 * - Zentraler State für die Verwaltung von Patient:innen und deren Qualitätsflags
 *   (Vollständigkeit, Korrektheit, Konsistenz, Aktualität, Red/Yellow Flags).
 * - Erleichtert den Zugriff auf Patientendaten aus verschiedenen Komponenten ohne Prop-Drilling.
 *
 * Typen:
 * - `PatientFlagQuality`:
 *    - Repräsentiert einen Patient:innen-Datensatz mit optionalen Qualitätsmetriken.
 *    - Felder:
 *      - `id` (optional): Interne ID des Datensatzes.
 *      - `patient_id`: Externe oder interne Patienten-ID (string oder number).
 *      - `completeness`, `correctness`, `consistency`, `actuality`: numerische Werte (0–100 %).
 *      - `flag`: Qualitäts-Flag ('red' | 'yellow'), falls vorhanden.
 *      - `source`: Datenquelle ('croms', 'proms', 'croms+proms').
 *
 * - `PatientStore`:
 *    - Struktur des Zustand-Objekts im Store.
 *    - Enthält Daten-Array, Lade-Status, Gesamtzahl der Red-Flags und Setter-Funktionen.
 *
 * State-Felder:
 * - `patients`: Array aller geladenen Patient:innen-Datensätze.
 * - `loaded`: Boolean, ob die Daten erfolgreich geladen wurden.
 * - `redFlagTotal`: Gesamtanzahl der Patient:innen mit Red-Flag.
 *
 * Actions:
 * - `setPatients(data)`: Setzt die gesamte Patientenliste.
 * - `setLoaded(loaded)`: Aktualisiert den Lade-Status.
 * - `setRedFlagTotal(count)`: Setzt die Anzahl der Red-Flags.
 * - `reset()`: Setzt den Store auf Anfangszustand zurück (leeres Array, loaded=false, redFlagTotal=0).
 *
 * Besonderheiten:
 * - Verwendung von [Zustand](https://github.com/pmndrs/zustand) für einfachen, zustandslosen State-Container.
 * - Alle Funktionen sind synchron, da die API-Daten extern (z. B. per `fetch`/`axios`) geladen werden.
 * - Typensicherheit durch TypeScript für State und Actions.
 *
 * Typische Nutzung:
 * - In einer Patientenübersicht (`PatientQualityTable`) zur Anzeige und Filterung der Qualitätsmetriken.
 * - In Dashboard-Widgets zur Anzeige der Anzahl Red-Flags (`redFlagTotal`).
 * - Gemeinsamer State zwischen Detail- und Übersichtsseiten.
 */


import { create } from 'zustand';

export type PatientFlagQuality = {
  id?: number;
  patient_id: string | number;
  completeness?: number;
  correctness?: number;
  consistency?: number;
  actuality?: number;
  flag?: 'red' | 'yellow';
  source: 'croms' | 'proms' | 'croms+proms';
};

type PatientStore = {
  patients: PatientFlagQuality[];
  loaded: boolean;
  redFlagTotal: number;
  setPatients: (data: PatientFlagQuality[]) => void;
  setLoaded: (loaded: boolean) => void;
  setRedFlagTotal: (count: number) => void;
  reset: () => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [],
  loaded: false,
  redFlagTotal: 0,
  setPatients: (data) => set({ patients: data }),
  setLoaded: (loaded) => set({ loaded }),
  setRedFlagTotal: (count) => set({ redFlagTotal: count }),
  reset: () => set({ patients: [], loaded: false, redFlagTotal: 0 }),
}));
