import { Search, X } from 'lucide-react'

const VIEW_TITLES = {
  calendar:  'Content Calendar',
  list:      'Content Archive',
  analytics: 'Performance Report',
  settings:  'Settings',
}

export default function Header({ view, searchQuery, onSearch }) {
  return (
    <header className="header" style={{ padding: '0 32px', height: '60px', borderBottom: '1px solid rgba(255,255,255,0.03)', flexShrink: 0 }}>
      <div className="header-left">
        <h1 style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em', color: 'white' }}>
          {VIEW_TITLES[view] || view}
        </h1>
      </div>
      <div className="header-right">
        {view !== 'settings' && <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '7px 32px 7px 32px',
              width: '210px',
              fontSize: '12px',
              color: 'white',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
          />
          {searchQuery && (
            <button
              onClick={() => onSearch('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, cursor: 'pointer', background: 'none', border: 'none', color: 'white', display: 'flex' }}
            >
              <X size={12} />
            </button>
          )}
        </div>}
      </div>
    </header>
  )
}
