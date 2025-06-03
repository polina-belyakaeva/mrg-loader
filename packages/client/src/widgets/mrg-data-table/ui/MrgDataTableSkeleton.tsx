import React, { FC } from 'react';
import styles from './mrg-data-table-skeleton.module.css';

export const MRGDataTableSkeleton: FC = () => {
  const numBodyRows = 10;
  const numColsHeaderRow1 = 4;
  const numColsHeaderRow2 = 7;
  const numColsBody = 7;

  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonHeaderRow}>
          {Array.from({ length: numColsHeaderRow1 }).map((_, colIndex) => (
            <div key={colIndex} className={styles.skeletonHeaderCell}></div>
          ))}
        </div>
        <div className={styles.skeletonHeaderRow}>
          {Array.from({ length: numColsHeaderRow2 }).map((_, colIndex) => (
            <div key={colIndex} className={styles.skeletonHeaderCell}></div>
          ))}
        </div>
      </div>
      <div className={styles.skeletonBody}>
        {Array.from({ length: numBodyRows }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.skeletonRow}>
            {Array.from({ length: numColsBody }).map((_, colIndex) => (
              <div key={colIndex} className={styles.skeletonCell}></div>
            ))
            }
          </div>
        ))}
      </div>
    </div>
  );
};