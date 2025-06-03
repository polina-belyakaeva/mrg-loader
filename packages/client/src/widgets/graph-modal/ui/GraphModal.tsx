import React, { FC, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import styles from './graph-modal.module.css'
import { MRGData } from '@client-shared/types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface GraphModalProps {
  isOpen: boolean
  onClose: () => void
  data: { graphData: MRGData[]; clickedRow: MRGData } | null
}

const monthAbbreviationsRu = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]

const getMonthKey = (dateString: string) => {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) {
    return dateString
  }
  const yyyy = d.getFullYear().toString().padStart(4, '0')
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')
  return `${yyyy}-${mm}-01`
}

const formatDate = (dateString: string) => {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) {
    return dateString
  }
  return monthAbbreviationsRu[d.getMonth()]
}

export const GraphModal: FC<GraphModalProps> = ({ isOpen, onClose, data }) => {
  if (!data || !data.graphData || data.graphData.length === 0) {
    return null
  }
  const { graphData, clickedRow } = data

  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    setAnimate(true);

    const timer = setTimeout(() => {
      setAnimate(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [isOpen]);


  const sortedGraphData = [...graphData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const mapByMonth = new Map<string, MRGData[]>()
  sortedGraphData.forEach((item) => {
    const monthKey = getMonthKey(item.date)
    if (!mapByMonth.has(monthKey)) {
      mapByMonth.set(monthKey, [])
    }
    mapByMonth.get(monthKey)!.push(item)
  })

  const monthlyData: Array<{
    date: string
    avgFlow: number | null | undefined
    tvps: number | null | undefined
  }> = []
  mapByMonth.forEach((itemsOfThatMonth, monthKey) => {
    const lastOfMonth = itemsOfThatMonth[itemsOfThatMonth.length - 1]
    monthlyData.push({
      date: monthKey,
      avgFlow: lastOfMonth.avgFlow,
      tvps: lastOfMonth.tvps,
    })
  })
  monthlyData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const clickedMonthKey = getMonthKey(clickedRow.date)

  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null)

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay}>
          <Dialog.Content className={styles.dialogContent}>
            <Dialog.Title className={styles.dialogTitle}>
              Загрузка МРГ
            </Dialog.Title>
            <Dialog.Description className={styles.dialogDescription}>
              <p>
                {clickedRow.pipeline}.{" "}
                {clickedRow.km !== null &&
                  !isNaN(clickedRow.km as number) &&
                  `Подача газа от ${clickedRow.km} км`}{" "}
                {clickedRow.mg}
              </p>
              <p>
                {clickedRow.km !== null &&
                  !isNaN(clickedRow.km as number) &&
                  "млн м³/сут."}
              </p>
            </Dialog.Description>

            <div className={styles.graphContainer}>
              <div className={styles.graphXAxisLine} />
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyData}
                  onMouseMove={(state) => {
                    if (
                      state.activeLabel != null &&
                      typeof state.activeLabel === 'string'
                    ) {
                      setHoveredMonth(state.activeLabel as string)
                    } else {
                      setHoveredMonth(null)
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredMonth(null)
                  }}
                >
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: '#212121',
                      fontSize: 14,
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                    }}
                    interval={0}
                    padding={{ left: 20, right: 20 }}
                  />

                  <YAxis hide={true} domain={['auto', 'auto']} />

                  <Tooltip
                    cursor={false}
                    content={() => null}
                  />

                  <ReferenceLine
                    x={clickedMonthKey}
                    stroke="#D0D0D0"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />

                  {hoveredMonth && (
                    <ReferenceLine
                      x={hoveredMonth}
                      stroke="#A0A0A0"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />
                  )}

                  <Line
                    type="monotone"
                    dataKey="avgFlow"
                    stroke="#007DF0"
                    strokeWidth={3}
                    dot={(props: any) => {
                      const { cx, cy, stroke, payload, value } = props;
                      const isHovered = hoveredMonth === payload.date;

                      return (
                        <g key={`dot-avgFlow-${payload.date}-${value}`}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4.5}
                            stroke={stroke}
                            strokeWidth={2}
                            fill="#FFFFFF"
                          />
                          {isHovered && value != null && (
                            <foreignObject
                              x={cx - 21}
                              y={cy + 10}
                              width={42}
                              height={20}
                            >
                              <div
                                style={{
                                  backgroundColor: stroke,
                                  color: '#fff',
                                  borderRadius: 23,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  fontFamily: 'Poppins',
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {String(value).replace('.', ',')}
                              </div>
                            </foreignObject>
                          )}
                        </g>
                      );
                    }}
                    isAnimationActive={animate}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />


                  <Line
                    type="monotone"
                    dataKey="tvps"
                    stroke="#F04F47"
                    strokeWidth={3}
                    dot={(props: any) => {
                      const { cx, cy, stroke, payload, value } = props;
                      const isHovered = hoveredMonth === payload.date;

                      return (
                        <g key={`dot-tvps-${payload.date}-${value}`}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4.5}
                            stroke={stroke}
                            strokeWidth={2}
                            fill="#FFFFFF"
                          />
                          {isHovered && value != null && (
                            <foreignObject
                              x={cx - 21}
                              y={cy - 35}
                              width={42}
                              height={20}
                            >
                              <div
                                style={{
                                  backgroundColor: stroke,
                                  color: '#fff',
                                  borderRadius: 23,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  fontFamily: 'Poppins',
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {String(value).replace('.', ',')}
                              </div>
                            </foreignObject>
                          )}
                        </g>
                      );
                    }}
                    isAnimationActive={animate}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />

                </LineChart>
              </ResponsiveContainer>
              <div className={styles.legendContainer}>
                <div className={styles.legendItem}>
                  <svg
                    width="81"
                    height="12"
                    viewBox="0 0 81 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.legendIcon}
                  >
                    <line
                      x1="0"
                      y1="6"
                      x2="81"
                      y2="6"
                      stroke="#007DF0"
                      strokeWidth="3"
                    />
                    <circle
                      cx="35"
                      cy="6"
                      r="4.5"
                      fill="#FFFFFF"
                      stroke="#007DF0"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className={styles.legendText}>
                    <span>Факт. среднесут.</span>
                    <span>расход (qср.ф) млн.м³/сут</span>
                  </div>
                </div>

                <div className={styles.legendItem}>
                  <svg
                    width="81"
                    height="12"
                    viewBox="0 0 81 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.legendIcon}
                  >
                    <line
                      x1="0"
                      y1="6"
                      x2="81"
                      y2="6"
                      stroke="#F04F47"
                      strokeWidth="3"
                    />
                    <circle
                      cx="35"
                      cy="6"
                      r="4.5"
                      fill="#FFFFFF"
                      stroke="#F04F47"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className={styles.legendText}>
                    <span>Технич. возм. проп. способн.</span>
                    <span>(qср.р) млн. м³/сут</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.closeButtonContainer} />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

