import axios from 'axios';
import { MRGData } from '@client-shared/types';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/api';

export const uploadFile = async (file: File): Promise<MRGData[]> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/data/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const fetchData = async (): Promise<MRGData[]> => {
  const response = await axios.get(`${API_URL}/data`);
  return response.data;
}; 