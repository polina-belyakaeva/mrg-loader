import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createMrgDataSlice, MrgDataSlice } from '../../entities/mrg-data/model/mrgDataSlice';
import { fetchData as apiFetchData, uploadFile as apiUploadFile } from '../../features/upload-data/api/uploadApi';

export interface AppState extends MrgDataSlice {
  fetching: boolean;
  fetchError: string | null;
  fetchData: () => Promise<void>;

  uploadLoading: boolean;
  uploadError: string | null;
  uploadFile: (file: File) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  devtools(
    immer(
      (set, get, api) => ({
        ...createMrgDataSlice(set, get, api),
        fetching: false,
        fetchError: null,
        uploadLoading: false,
        uploadError: null,

        fetchData: async () => {
          set(state => {
            state.fetching = true;
            state.fetchError = null;
          });
          try {
            const data = await apiFetchData();
            set(state => {
              const dataWithIds = data.map((item, index) => ({
                ...item,
                id: item.id || index.toString(),
              }));
              state.data = dataWithIds;
              state.fetching = false;
            });
          } catch (error) {
            console.error('Failed to fetch data:', error);
            set(state => {
              state.fetchError = 'Failed to load data from server.';
              state.fetching = false;
            });
          }
        },

        uploadFile: async (file: File) => {
          set(state => {
            state.uploadLoading = true;
            state.uploadError = null;
          });
          try {
            const uploadedData = await apiUploadFile(file);
            const dataWithIds = uploadedData.map((item, index) => ({
              ...item,
              id: item.id || index.toString(),
            }));
            set(state => {
              state.data = dataWithIds;
              state.uploadLoading = false;
            });
          } catch (error) {
            console.error('Upload failed:', error);
            set(state => {
              state.uploadError = 'Failed to upload data.';
              state.uploadLoading = false;
            });
          }
        },
      })
    )
  )
); 