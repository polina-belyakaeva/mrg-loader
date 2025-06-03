import * as React from 'react';
import { FC, useRef, useEffect, useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
  Cell,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MRGData } from '@client-shared/types';
import styles from './mrg-data-table.module.css';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChartSpline } from 'lucide-react';
import { GraphModal } from '@client-widgets/graph-modal/ui/GraphModal';

interface MRGDataTableProps {
  data: MRGData[];
}

const ROW_HEIGHT = 52;
const MIN_TABLE_HEIGHT = 200;
const MAX_TABLE_HEIGHT = 668;

const monthAbbreviationsRu = [
  'янв', 'фев', 'мар', 'апр', 'май', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
];

export const MRGDataTable: FC<MRGDataTableProps> = ({ data }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState<number>(MAX_TABLE_HEIGHT);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<
    { graphData: MRGData[]; clickedRow: MRGData } | null
  >(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnHelper = createColumnHelper<MRGData>();
  const columns: ColumnDef<MRGData, any>[] = useMemo(
    () => [
      columnHelper.accessor('pipeline', {
        header: () => 'Магистральный распределительный газопровод',
        cell: info => info.getValue(),
      }),
      columnHelper.group({
        id: 'connectionPoint',
        header: () => <span>Точка подключения</span>,
        columns: [
          columnHelper.accessor('mg', {
            header: () => 'МГ (РГ, КС, УРГ)',
            cell: info => info.getValue(),
          }),
          columnHelper.accessor('km', {
            header: () => 'км',
            cell: ({ row }) => {
              const value = row.getValue('km');
              return value == null || isNaN(value as number) ? '-' : value;
            },
          }),
        ],
      }),
      columnHelper.accessor('date', {
        header: () => 'Период',
        cell: info => {
          const raw = info.getValue<string>();
          const d = new Date(raw);
          if (isNaN(d.getTime())) return raw;
          const monthIndex = d.getMonth();
          const shortMonth = monthAbbreviationsRu[monthIndex];
          const year = d.getFullYear();
          return `${shortMonth} ${year}`;
        },
      }),
      columnHelper.accessor('loadLevel', {
        header: () => 'Уровень загрузки',
        cell: info => {
          const val = info.getValue<number | null | undefined>();
          let pct: string;
          let bgColor = '';
          let width = '0%';
          if (val == null || isNaN(val)) {
            pct = '-';
          } else {
            pct = `${val.toFixed(2)}%`;
            width = `${Math.min(100, Math.max(0, val))}%`;
            bgColor = val < 40 ? '#59C6A5' : '#FF9538';
          }
          return (
            <div className={styles.loadLevelContainer}>
              <div
                className={styles.loadLevelBar}
                style={{ width, backgroundColor: bgColor }}
              >
                <span className={styles.loadLevelText}>{pct}</span>
              </div>
              {pct === '-' && <span className={styles.loadLevelText}>{pct}</span>}
            </div>
          );
        },
      }),
      columnHelper.accessor('avgFlow', {
        header: () => 'Факт. среднесут. расход (qср.ф) млн.м³/сут',
        cell: info => {
          const value = info.getValue<number | null | undefined>();
          return value == null || isNaN(value) ? '-' : String(value).replace('.', ',');
        },
      }),
      columnHelper.accessor('tvps', {
        header: () => 'Технич. возм. проп. способн. (qср.р) млн.м³/сут',
        cell: info => {
          const value = info.getValue<number | null | undefined>();
          return value == null || isNaN(value) ? '-' : String(value).replace('.', ',');
        },
      }),
      columnHelper.display({
        id: 'graph',
        header: () => 'График',
        cell: ({ row }) => (
          <button
            className={styles.graphButton}
            onClick={() => {
              const filteredData = data.filter(
                item =>
                  item.pipeline === row.original.pipeline &&
                  item.mg === row.original.mg
              );
              setSelectedRowData({
                graphData: filteredData,
                clickedRow: row.original,
              });
              setIsModalOpen(true);
            }}
          >
            <ChartSpline color="#1c1b1e" />
          </button>
        ),
      }),
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {},
  });

  const currentPageRows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: currentPageRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const containerHeight = entry.contentRect.height;
        const availableHeight = containerHeight - ROW_HEIGHT * 2;
        const newH = Math.min(
          Math.max(availableHeight, MIN_TABLE_HEIGHT),
          MAX_TABLE_HEIGHT
        );
        setTableHeight(newH);
      }
    });
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [currentPageRows.length]);

  useEffect(() => {
    const container = parentRef.current;
    if (container) {
      container.scrollTop = 0;
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.headerTable}>
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '7.5%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2} className={styles.headerCell}>
                Магистральный распределительный газопровод
              </th>
              <th colSpan={2} className={styles.headerCell}>
                Точка подключения
              </th>
              <th rowSpan={2} className={styles.headerCell}>
                Период
              </th>
              <th rowSpan={2} className={styles.headerCell}>
                Уровень загрузки
              </th>
              <th rowSpan={2} className={styles.headerCell}>
                Факт. среднесут. расход (qср.ф) млн.м³/сут
              </th>
              <th rowSpan={2} className={styles.headerCell}>
                Технич. возм. проп. способн. (qср.р) млн.м³/сут
              </th>
              <th rowSpan={2} className={styles.headerCell}>
                График
              </th>
            </tr>
            <tr>
              <th className={styles.headerCell}>МГ (РГ, КС, УРГ)</th>
              <th className={styles.headerCell}>км</th>
            </tr>
          </thead>
        </table>

        <div
          className={styles.virtualizedContainer}
          style={{ height: `${tableHeight}px` }}
          ref={parentRef}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const row = currentPageRows[virtualRow.index];
              return (
                <div
                  key={row.id}
                  className={styles.tableRow}
                  style={{
                    position: 'absolute',
                    top: virtualRow.start,
                    left: 0,
                    width: '100%',
                    height: virtualRow.size,
                  }}
                >
                  {row.getVisibleCells().map((cell: Cell<MRGData, any>) => (
                    <div key={cell.id} className={styles.tableCell}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.paginationContainer}>
          <div className={styles.pageSizeWrapper}>
            <span className={styles.pageSizeLabel}>Записей на странице:</span>
            <select
              className={styles.pageSizeSelect}
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.pageNavWrapper}>
            <span className={styles.pageInfo}>
              Страница {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
            </span>
            <button
              className={styles.pageButton}
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft size={16} color="#6B7280" />
            </button>
            <button
              className={styles.pageButton}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={16} color="#6B7280" />
            </button>
            <button
              className={styles.pageButton}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={16} color="#6B7280" />
            </button>
            <button
              className={styles.pageButton}
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight size={16} color="#6B7280" />
            </button>
          </div>
        </div>
      </div>

      <GraphModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedRowData}
      />
    </>
  );
};