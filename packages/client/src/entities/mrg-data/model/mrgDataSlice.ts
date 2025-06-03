import { StateCreator } from 'zustand';
import { MRGData } from '@client-shared/types';

export interface MrgDataState {
  data: MRGData[];
}

export interface MrgDataActions {
  setMrgData: (data: MRGData[]) => void;
}

export type MrgDataSlice = MrgDataState & MrgDataActions;

export const createMrgDataSlice: StateCreator<MrgDataSlice> = (set) => ({
  data: [],
  setMrgData: (data) => set({ data }),
}); 