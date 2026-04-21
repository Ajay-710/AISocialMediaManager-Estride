import { Calendar, LayoutList, Settings, Plus, LogOut, Share2, BarChart3, Cpu } from 'lucide-react'
import { UserButton, useUser, SignOutButton } from '@clerk/clerk-react'

export default function Sidebar({ view, setView, onCreatePost, postCount = 0 }) {
  const { user } = useUser()

  const navItems = [
    { id: 'calendar',  label: 'Calendar',        icon: Calendar },
    { id: 'analytics', label: 'Analytics',       icon: BarChart3 },
    { id: 'list',      label: 'Content Archive', icon: LayoutList },
    { id: 'settings',  label: 'Settings',         icon: Settings },
  ]

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div style={{ marginBottom: '36px', paddingLeft: '16px' }}>
        <div style={{ fontSize: '19px', fontWeight: '900', letterSpacing: '-0.04em', color: 'white', lineHeight: 1 }}>
          eSTRIDE<span style={{ color: 'rgba(255,255,255,0.22)' }}>.ai</span>
        </div>
        <div style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '5px' }}>
          AI Marketing OS
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="label-caps" style={{ paddingLeft: '16px' }}>Workspace</div>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${view === id ? 'active' : ''}`} onClick={() => setView(id)}>
            <Icon size={16} />
            <span style={{ flex: 1 }}>{label}</span>
            {id === 'list' && postCount > 0 && (
              <span style={{ fontSize: '10px', fontWeight: '700', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '99px', color: 'rgba(255,255,255,0.35)' }}>
                {postCount}
              </span>
            )}
          </button>
        ))}

        <div className="label-caps" style={{ paddingLeft: '16px', marginTop: '28px' }}>Tools</div>
        <button className="nav-item" onClick={() => setView('settings')}>
          <Share2 size={16} />
          <span>Connect Socials</span>
        </button>
        <button className="nav-item" onClick={onCreatePost}>
          <Cpu size={16} />
          <span>AI Workflows</span>
        </button>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <button className="btn-primary" onClick={onCreatePost} style={{ width: '100%', marginBottom: '16px', fontSize: '13px', padding: '11px 20px' }}>
          <Plus size={15} /> Create Content
        </button>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '11px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flexShrink: 0 }}>
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 30, height: 30 } } }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'User'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.primaryEmailAddress?.emailAddress || ''}
              </div>
            </div>
          </div>
          <SignOutButton>
            <button style={{ width: '100%', padding: '7px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#F87171' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <LogOut size={12} /> Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  )
}
