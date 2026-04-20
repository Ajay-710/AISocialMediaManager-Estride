import { ChevronLeft, ChevronRight, Plus, Bell, Search } from 'lucide-react'
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
    <header className="header" style={{ padding: '0 24px', height: '80px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      {/* Left */}
      <div className="header-left">
        <h1 className="header-title" style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>
          {VIEW_TITLES[view]}
        </h1>
      </div>

      {/* Right */}
      <div className="header-right">
        <div style={{ position: 'relative', marginRight: '16px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          <input 
            type="text" 
            placeholder="Search workspace..." 
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '12px', 
              padding: '10px 12px 10px 36px', 
              width: '240px', 
              fontSize: '13px',
              color: 'white',
              outline: 'none'
            }} 
          />
        </div>
      </div>
    </header>
  )
}
