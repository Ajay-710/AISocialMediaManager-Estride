import { ChevronLeft, ChevronRight, Plus, Bell } from 'lucide-react'
import { PLATFORMS } from '../data/mockData'

const VIEW_TITLES = {
  calendar: 'Content Calendar',
  list:     'Content List',
  settings: 'Settings',
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function PlatformDot({ color }) {
  return (
    <span
      className="platform-filter-dot"
      style={{ background: color }}
    />
  )
}

export default function Header({
  view,
  activePlatforms,
  onTogglePlatform,
  onCreatePost,
  currentMonth,
  setCurrentMonth,
}) {
  const changeMonth = (dir) => {
    setCurrentMonth(prev => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() + dir)
      return d
    })
  }

  return (
    <header className="header" style={{ padding: '0 24px', height: '80px' }}>
      {/* Left */}
      <div className="header-left">
        <h1 className="header-title" style={{ fontSize: '20px' }}>{VIEW_TITLES[view]}</h1>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
        {view === 'calendar' && (
          <div className="month-nav" style={{ border: 'none', background: 'transparent' }}>
            <button className="month-nav-btn" onClick={() => changeMonth(-1)}>
              <ChevronLeft size={16} />
            </button>
            <span className="month-nav-label" style={{ minWidth: '130px', fontSize: '14px' }}>
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button className="month-nav-btn" onClick={() => changeMonth(1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Center: Platform filters with a premium look */}
      {view !== 'settings' && (
        <div className="platform-filters" style={{ background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {PLATFORMS.map(({ id, label, color }) => {
            const isActive = activePlatforms.has(id)
            return (
              <button
                key={id}
                className={`platform-filter-btn ${isActive ? `active-${id}` : ''}`}
                onClick={() => onTogglePlatform(id)}
                style={{ border: 'none', background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent' }}
              >
                <PlatformDot color={isActive ? color : 'var(--text-muted)'} />
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Right */}
      <div className="header-right">
        <div style={{ position: 'relative', marginRight: '16px' }}>
          <input 
            type="text" 
            placeholder="Search content..." 
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '10px', 
              padding: '8px 12px', 
              width: '200px', 
              fontSize: '13px',
              color: 'white',
              outline: 'none'
            }} 
          />
        </div>
        <button className="create-btn" onClick={onCreatePost}>
          <Plus size={15} />
          Create Post
        </button>
      </div>
    </header>
  )
}
