import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format, addMonths, subMonths,
  startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
  isSameMonth, isSameDay, addDays,
} from 'date-fns'
import { FadeInStagger } from './GsapComponents'

const PLATFORM_COLORS  = { x: '#E7E9EA', linkedin: '#60A5FA', instagram: '#E1306C' }
const PLATFORM_LABELS  = { x: 'X', linkedin: 'in', instagram: 'IG' }
const STATUS_COLORS    = { published: '#10B981', scheduled: '#F59E0B', draft: '#71717A' }
const DAYS             = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildWeeks(currentMonth) {
  const monthStart = startOfMonth(currentMonth)
  const start      = startOfWeek(monthStart)
  const end        = endOfWeek(endOfMonth(monthStart))
  const weeks      = []
  let week         = []
  let day          = start
  while (day <= end) {
    week.push(day)
    if (week.length === 7) { weeks.push(week); week = [] }
    day = addDays(day, 1)
  }
  return weeks
}

function NavBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.45)',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
    >
      {children}
    </button>
  )
}

function PostChip({ post, onEditPost }) {
  const statusColor   = STATUS_COLORS[post.status]  || STATUS_COLORS.draft
  const platformColor = PLATFORM_COLORS[post.platform] || '#fff'
  const platformLabel = PLATFORM_LABELS[post.platform] || '?'
  const preview       = post.content?.split('\n')[0]?.slice(0, 30) || ''

  return (
    <div
      onClick={() => onEditPost?.(post)}
      title={post.content?.slice(0, 100)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '3px 7px 3px 0',
        borderRadius: 6,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderLeft: `2.5px solid ${statusColor}`,
        cursor: onEditPost ? 'pointer' : 'default',
        overflow: 'hidden',
        transition: 'background 0.12s, border-color 0.12s',
      }}
      onMouseEnter={e => { if (onEditPost) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = `${statusColor}60` } }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderLeftColor = statusColor }}
    >
      <div style={{
        fontSize: 7, fontWeight: 900, letterSpacing: '0.02em',
        color: platformColor,
        background: `${platformColor}14`,
        padding: '1px 4px', borderRadius: 4,
        flexShrink: 0,
      }}>
        {platformLabel}
      </div>
      <span style={{
        fontSize: 10, fontWeight: 500,
        color: 'rgba(255,255,255,0.5)',
        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        flex: 1, lineHeight: 1.2,
      }}>
        {preview}
      </span>
    </div>
  )
}

function DayCell({ day, posts, monthStart, onEditPost }) {
  const dateStr        = format(day, 'yyyy-MM-dd')
  const dayPosts       = posts.filter(p => p.date === dateStr)
  const isCurrentMonth = isSameMonth(day, monthStart)
  const isToday        = isSameDay(day, new Date())

  return (
    <div
      style={{
        position: 'relative',
        padding: '9px 9px 7px',
        borderRadius: 12,
        background: isToday ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)',
        border: `1px solid ${isToday ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)'}`,
        opacity: isCurrentMonth ? 1 : 0.2,
        display: 'flex', flexDirection: 'column', gap: 4,
        minHeight: 96,
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        if (!isToday && isCurrentMonth) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        }
      }}
      onMouseLeave={e => {
        if (!isToday) {
          e.currentTarget.style.background = isToday ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)'
          e.currentTarget.style.borderColor = isToday ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)'
        }
      }}
    >
      {/* Date row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <span style={{
          fontSize: 13, fontWeight: isToday ? 900 : 600, lineHeight: 1,
          color: isToday ? 'white' : 'rgba(255,255,255,0.55)',
        }}>
          {format(day, 'd')}
        </span>
        {dayPosts.length > 0 && (
          <span style={{
            fontSize: 9, fontWeight: 800,
            color: 'rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '0px 5px', borderRadius: 99,
          }}>
            {dayPosts.length}
          </span>
        )}
      </div>

      {/* Post chips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {dayPosts.slice(0, 3).map((post, idx) => (
          <PostChip key={idx} post={post} onEditPost={onEditPost} />
        ))}
        {dayPosts.length > 3 && (
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.2)', paddingLeft: 6 }}>
            +{dayPosts.length - 3} more
          </div>
        )}
      </div>
    </div>
  )
}

export const SingleMonthCalendar = ({ posts = [], onEditPost }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart    = startOfMonth(currentMonth)
  const monthKey      = format(currentMonth, 'yyyy-MM')
  const weeks         = buildWeeks(currentMonth)

  const monthPosts    = posts.filter(p => p.date?.startsWith(monthKey))
  const scheduledAmt  = monthPosts.filter(p => p.status === 'scheduled').length
  const publishedAmt  = monthPosts.filter(p => p.status === 'published').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, paddingBottom: 14,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        {/* Left: title + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', color: 'white', lineHeight: 1 }}>
              {format(currentMonth, 'MMMM')}
              <span style={{ color: 'rgba(255,255,255,0.22)', marginLeft: 7 }}>
                {format(currentMonth, 'yyyy')}
              </span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {monthPosts.length > 0 && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '2px 9px', borderRadius: 99 }}>
                {monthPosts.length} total
              </span>
            )}
            {publishedAmt > 0 && (
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', padding: '2px 9px', borderRadius: 99 }}>
                {publishedAmt} published
              </span>
            )}
            {scheduledAmt > 0 && (
              <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', padding: '2px 9px', borderRadius: 99 }}>
                {scheduledAmt} scheduled
              </span>
            )}
          </div>
        </div>

        {/* Right: legend + nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[['#10B981', 'Published'], ['#F59E0B', 'Scheduled'], ['#71717A', 'Draft']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
          {/* Nav */}
          <div style={{ display: 'flex', gap: 5 }}>
            <NavBtn onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft size={14} /></NavBtn>
            <NavBtn onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight size={14} /></NavBtn>
          </div>
        </div>
      </div>

      {/* ── Day labels ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4, flexShrink: 0 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <FadeInStagger staggerDelay={0.03}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, flex: 1 }}>
              {week.map((day, di) => (
                <DayCell
                  key={di}
                  day={day}
                  posts={posts}
                  monthStart={monthStart}
                  onEditPost={onEditPost}
                />
              ))}
            </div>
          ))}
        </div>
      </FadeInStagger>

    </div>
  )
}
