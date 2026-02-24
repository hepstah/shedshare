import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useActivityHeatmap } from '@/hooks/useActivityHeatmap'

const WEEKS = 53
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getCellColor(count: number) {
  if (count === 0) return 'bg-muted'
  if (count <= 2) return 'bg-nuts/25'
  if (count <= 4) return 'bg-nuts/50'
  if (count <= 6) return 'bg-nuts/75'
  return 'bg-nuts'
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

interface CellData {
  date: string
  count: number
}

export function ActivityHeatmap() {
  const { data, isLoading } = useActivityHeatmap()

  const { grid, monthLabels } = useMemo(() => {
    const counts = new Map<string, number>()
    if (data?.days) {
      for (const d of data.days) {
        counts.set(d.date, d.count)
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayDay = today.getDay() // 0=Sun

    // Start from the Sunday of the week (WEEKS-1) weeks ago
    const start = new Date(today)
    start.setDate(start.getDate() - (WEEKS - 1) * 7 - todayDay)

    // Build grid: array of 53 columns, each with up to 7 cells
    const columns: (CellData | null)[][] = []
    const months: { label: string; colIndex: number }[] = []
    let lastMonth = -1

    const cursor = new Date(start)
    for (let week = 0; week < WEEKS; week++) {
      const col: (CellData | null)[] = []
      for (let day = 0; day < 7; day++) {
        if (cursor > today) {
          col.push(null)
        } else {
          const dateStr = formatDate(cursor)
          const month = cursor.getMonth()

          if (month !== lastMonth && day === 0) {
            months.push({ label: MONTH_LABELS[month], colIndex: week })
            lastMonth = month
          }

          col.push({
            date: dateStr,
            count: counts.get(dateStr) ?? 0,
          })
        }
        cursor.setDate(cursor.getDate() + 1)
      }
      columns.push(col)
    }

    return { grid: columns, monthLabels: months }
  }, [data])

  if (isLoading) {
    return (
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your Activity</h2>
        </div>
        <Card>
          <CardContent className="py-6">
            <div className="h-[130px] animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Activity</h2>
        <p className="text-sm text-muted-foreground">
          {data?.total ?? 0} activities in the last year
        </p>
      </div>
      <Card>
        <CardContent className="overflow-x-auto p-4">
          <div className="min-w-[680px]">
            {/* Month labels row */}
            <div className="mb-1 flex">
              <div className="w-7 shrink-0" />
              <div className="flex flex-1">
                {Array.from({ length: WEEKS }, (_, i) => {
                  const marker = monthLabels.find((m) => m.colIndex === i)
                  return (
                    <div
                      key={i}
                      className="flex-1 text-[10px] leading-none text-muted-foreground"
                    >
                      {marker?.label ?? ''}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Heatmap: day labels + grid */}
            <div className="flex gap-[3px]">
              {/* Day labels */}
              <div className="flex w-7 shrink-0 flex-col gap-[3px]">
                {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                  <div
                    key={i}
                    className="flex h-[13px] items-center text-[10px] leading-none text-muted-foreground"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Grid columns */}
              {grid.map((col, weekIdx) => (
                <div key={weekIdx} className="flex flex-1 flex-col gap-[3px]">
                  {col.map((cell, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`h-[13px] rounded-sm ${cell ? getCellColor(cell.count) : ''}`}
                      title={
                        cell
                          ? `${cell.count} activit${cell.count === 1 ? 'y' : 'ies'} on ${cell.date}`
                          : undefined
                      }
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
              <span>Less</span>
              <div className="h-[10px] w-[10px] rounded-sm bg-muted" />
              <div className="h-[10px] w-[10px] rounded-sm bg-nuts/25" />
              <div className="h-[10px] w-[10px] rounded-sm bg-nuts/50" />
              <div className="h-[10px] w-[10px] rounded-sm bg-nuts/75" />
              <div className="h-[10px] w-[10px] rounded-sm bg-nuts" />
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
