import { useAppStore } from '@client-app/store';

interface UseUploadDataResult {
  upload: (file: File) => Promise<void>;
}

export const useUploadData = (): UseUploadDataResult => {
  const upload = useAppStore((state) => state.uploadFile);

  return { upload };
}; 