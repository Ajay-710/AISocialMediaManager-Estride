import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns'

const PLATFORM_COLORS = {
  x: '#1D9BF0',
  linkedin: '#3B82F6',
  instagram: '#E1306C'
}

export const SingleMonthCalendar = ({ posts = [], onEditPost }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tighter">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage your content schedule</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  )

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map(day => (
          <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd')
        const cloneDay = day
        const dayPosts = posts.filter(p => p.date === format(cloneDay, 'yyyy-MM-dd'))
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isToday = isSameDay(day, new Date())

        days.push(
          <div
            key={day}
            className={`relative min-h-[140px] p-4 border border-white/[0.03] transition-all duration-300 group
              ${!isCurrentMonth ? 'opacity-20 grayscale' : 'opacity-100'}
              ${isToday ? 'bg-indigo-500/5' : 'hover:bg-white/[0.02]'}
            `}
            style={{
              borderRadius: isToday ? '24px' : '0',
              zIndex: isToday ? 10 : 1
            }}
          >
            {isToday && (
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-[24px] pointer-events-none" />
            )}
            
            <div className="flex justify-between items-start mb-3">
              <span className={`text-lg font-black tracking-tighter ${isToday ? 'text-indigo-400' : 'text-white'}`}>
                {formattedDate}
              </span>
              {dayPosts.length > 0 && (
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-lg transition-all">
                  <MoreHorizontal size={14} className="text-gray-500" />
                </button>
              )}
            </div>

            <div className="space-y-1.5 overflow-hidden">
              {dayPosts.slice(0, 3).map((post, idx) => (
                <div
                  key={idx}
                  onClick={() => onEditPost?.(post)}
                  className="flex items-center gap-2 px-2 py-1.5 bg-white/5 border border-white/5 rounded-lg overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ cursor: onEditPost ? 'pointer' : 'default', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (onEditPost) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '' }}
                  title={post.content?.slice(0, 60)}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: PLATFORM_COLORS[post.platform] }}
                  />
                  <span className="text-[10px] font-bold text-white/70 uppercase truncate">
                    {post.platform}
                  </span>
                </div>
              ))}
              {dayPosts.length > 3 && (
                <div className="text-[10px] font-black text-gray-500 pl-2">
                  +{dayPosts.length - 3} MORE
                </div>
              )}
            </div>

            {/* Hover Action */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
               <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                 <span className="text-white text-xs">+</span>
               </div>
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div className="grid grid-cols-7 border-collapse" key={day}>
          {days}
        </div>
      )
      days = []
    }
    return <div className="border border-white/[0.03] rounded-[32px] overflow-hidden bg-white/[0.01]">{rows}</div>
  }

  return (
    <div className="social-calendar-wrapper">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  )
}
