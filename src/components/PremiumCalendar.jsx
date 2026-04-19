import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { cn } from "../lib/utils"

export function PremiumCalendar({ posts = [], className }) {
  const [cursor, setCursor] = React.useState(new Date(2026, 3, 1)) // Default to April 2026

  const prev = () => setCursor(addMonths(cursor, -1))
  const next = () => setCursor(addMonths(cursor, 1))

  const renderMonthGrid = (base) => {
    const start = startOfMonth(base)
    const end = endOfMonth(base)
    const days = eachDayOfInterval({ start, end })
    const padStart = start.getDay()

    return (
      <div className="w-full">
        <div className="mb-4 text-center font-bold text-lg tracking-tight text-white">
          {format(base, "MMMM yyyy")}
        </div>
        <div className="grid grid-cols-7 text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((wd) => (
            <div key={wd} className="h-7 flex items-center justify-center">
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: padStart }).map((_, i) => (
            <div key={`pad-${i}`} className="h-20" />
          ))}
          {days.map((dt) => {
            const dateKey = format(dt, "yyyy-MM-dd")
            const cellPosts = posts.filter(p => p.date === dateKey)
            const activeToday = isToday(dt)

            return (
              <div
                key={dt.toISOString()}
                className={cn(
                  "h-24 p-2 flex flex-col gap-1 rounded-xl border transition-all duration-200",
                  "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10",
                  activeToday && "border-indigo-500/50 bg-indigo-500/5"
                )}
              >
                <span className={cn(
                  "text-xs font-semibold",
                  activeToday ? "text-indigo-400" : "text-gray-400"
                )}>{dt.getDate()}</span>
                
                <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                  {cellPosts.map(post => (
                    <div 
                      key={post.id} 
                      className="flex items-center gap-1.5 p-1 rounded-md bg-white/5 border border-white/5 text-[9px] font-medium text-white/80"
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: post.platform === 'x' ? '#1D9BF0' : post.platform === 'linkedin' ? '#3B82F6' : '#E1306C' }} />
                      <span className="truncate">{post.platform.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto space-y-8", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={prev}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={next}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {renderMonthGrid(cursor)}
        {renderMonthGrid(addMonths(cursor, 1))}
      </div>
    </div>
  )
}
