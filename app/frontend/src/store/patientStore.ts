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
  setPatients: (data: PatientFlagQuality[]) => void;
  setLoaded: (loaded: boolean) => void;
  reset: () => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [],
  loaded: false,
  setPatients: (data) => set({ patients: data }),
  setLoaded: (loaded) => set({ loaded }),
  reset: () => set({ patients: [], loaded: false }),
}));
