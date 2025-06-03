import React, { useEffect, useRef } from 'react';
import styles from './index.module.css';
import { UploadButton } from '../../features/upload-data';
import { MRGDataTable } from '../../widgets/mrg-data-table';
import { useAppStore } from '@client-app/store';
import { MRGDataTableSkeleton } from '../../widgets/mrg-data-table';

const MainPage = () => {
  const { data: mrgData, fetching, fetchError, fetchData, uploadLoading, uploadError, uploadFile: handleFileUpload } = useAppStore((state) => ({
    data: state.data,
    fetching: state.fetching,
    fetchError: state.fetchError,
    fetchData: state.fetchData,
    uploadLoading: state.uploadLoading,
    uploadError: state.uploadError,
    uploadFile: state.uploadFile,
  }));

  const initialFetchAttempted = useRef(false);

  useEffect(() => {
    if (mrgData.length === 0 && !fetching && !fetchError && !initialFetchAttempted.current) {
      initialFetchAttempted.current = true;
      fetchData();
    }
  }, [mrgData.length, fetching, fetchError, fetchData]);

  const isLoading = uploadLoading || fetching;
  const displayError = uploadError || fetchError;

  return (
    <div className={styles.mainPage}>
      <div className={styles.mainPageUploadButtonContainer}>
        <UploadButton onFileUpload={handleFileUpload} disabled={isLoading} loading={isLoading} className={styles.mainPageUploadButton} />
        {isLoading && <p>Загрузка данных...</p>}
        {displayError && <p className={styles.errorMessage}>Error: {displayError}</p>}
      </div>

      <div className={`${styles.mainPageTableContainer} ${isLoading ? styles.loading : ''}`}>
        {isLoading ? (
          <MRGDataTableSkeleton />
        ) : mrgData.length === 0 ? (
          <div className={styles.noDataMessage}>Данные не были загружены</div>
        ) : (
          <MRGDataTable data={mrgData} />
        )}
      </div>
    </div>
  );
};

export default MainPage; 