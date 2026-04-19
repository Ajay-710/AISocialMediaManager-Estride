const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const PLATFORM_LABELS = {
  x:         'X',
  linkedin:  'in',
  instagram: 'IG',
}

function PostChip({ post }) {
  const snippet = post.content.split('\n')[0].slice(0, 28)
  return (
    <div className={`post-chip ${post.platform}`} title={post.content}>
      <span className="post-chip-dot" />
      <span>{PLATFORM_LABELS[post.platform]} · {snippet}{snippet.length >= 28 ? '…' : ''}</span>
    </div>
  )
}

export default function CalendarView({ posts, currentMonth }) {
  const year  = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth    = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month
  const todayDate = isCurrentMonth ? today.getDate() : -1

  // Build 35 (5×7) or 42 (6×7) cells
  const totalCells = firstDayOfWeek + daysInMonth
  const gridSize   = totalCells <= 35 ? 35 : 42
  const cells = []

  for (let i = 0; i < gridSize; i++) {
    if (i < firstDayOfWeek) {
      const dayNum = daysInPrevMonth - firstDayOfWeek + 1 + i
      cells.push({ dayNum, isOtherMonth: true, date: null })
    } else if (i < firstDayOfWeek + daysInMonth) {
      const dayNum = i - firstDayOfWeek + 1
      const pad    = String(month + 1).padStart(2, '0')
      const d      = String(dayNum).padStart(2, '0')
      cells.push({ dayNum, isOtherMonth: false, date: `${year}-${pad}-${d}` })
    } else {
      const dayNum = i - firstDayOfWeek - daysInMonth + 1
      cells.push({ dayNum, isOtherMonth: true, date: null })
    }
  }

  const postsByDate = {}
  posts.forEach(p => {
    if (!postsByDate[p.date]) postsByDate[p.date] = []
    postsByDate[p.date].push(p)
  })

  const publishedCount  = posts.filter(p => p.status === 'published').length
  const scheduledCount  = posts.filter(p => p.status === 'scheduled').length
  const draftCount      = posts.filter(p => p.status === 'draft').length

  return (
    <div>
      {/* Stats bar */}
      <div className="calendar-toolbar">
        <div className="calendar-stats">
          <div className="calendar-stat">
            <span className="calendar-stat-dot" style={{ background: 'var(--status-published)' }} />
            <span>{publishedCount} Published</span>
          </div>
          <div className="calendar-stat">
            <span className="calendar-stat-dot" style={{ background: 'var(--status-scheduled)' }} />
            <span>{scheduledCount} Scheduled</span>
          </div>
          <div className="calendar-stat">
            <span className="calendar-stat-dot" style={{ background: 'var(--status-draft)' }} />
            <span>{draftCount} Draft{draftCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {posts.length} post{posts.length !== 1 ? 's' : ''} this month
        </span>
      </div>

      {/* Grid */}
      <div className="calendar-grid-wrapper">
        <div className="calendar-grid">
          {DAY_NAMES.map(d => (
            <div key={d} className="calendar-day-name">{d}</div>
          ))}

          {cells.map((cell, idx) => {
            const cellPosts = cell.date ? (postsByDate[cell.date] || []) : []
            const isToday   = cell.dayNum === todayDate && !cell.isOtherMonth
            const MAX_CHIPS = 3

            return (
              <div
                key={idx}
                className={[
                  'calendar-cell',
                  cell.isOtherMonth ? 'other-month' : '',
                  isToday ? 'today' : '',
                ].join(' ')}
                style={{ 
                  background: cell.isOtherMonth ? 'transparent' : 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}
              >
                <div className="day-number" style={{ 
                  fontSize: '14px', 
                  opacity: cell.isOtherMonth ? 0.3 : 0.8,
                  marginBottom: '10px'
                }}>
                  {cell.dayNum}
                </div>
                {cellPosts.length > 0 && (
                  <div className="post-chips" style={{ gap: '4px' }}>
                    {cellPosts.slice(0, MAX_CHIPS).map(p => (
                      <div key={p.id} className={`post-chip ${p.platform}`} style={{ 
                        borderRadius: '6px', 
                        padding: '4px 8px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.03)'
                      }}>
                        <div style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: PLATFORM_LABELS[p.platform] === 'X' ? '#1D9BF0' : PLATFORM_LABELS[p.platform] === 'in' ? '#3B82F6' : '#E1306C',
                          marginRight: '6px'
                        }} />
                        <span style={{ fontSize: '11px', fontWeight: '500' }}>{PLATFORM_LABELS[p.platform]} Post</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
