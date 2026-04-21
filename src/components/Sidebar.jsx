import { useState } from 'react'
import { Calendar, LayoutList, Settings, Plus, LogOut, Grid, ChevronDown, ChevronRight, Share2, BarChart3 } from 'lucide-react'
import { UserButton, useUser, SignOutButton } from '@clerk/clerk-react'


export default function Sidebar({ view, setView, onCreatePost }) {
  const { user } = useUser()
  const navItems = [
    { id: 'calendar',  label: 'Calendar',      icon: Calendar },
    { id: 'analytics', label: 'Analytics',     icon: BarChart3 },
    { id: 'list',      label: 'Content List',  icon: LayoutList },
    { id: 'settings',  label: 'Settings',      icon: Settings },
  ]

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div style={{ marginBottom: '40px', paddingLeft: '16px' }}>
        <div style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.04em', color: 'white' }}>
          eSTRIDE<span style={{ color: 'rgba(255,255,255,0.3)' }}>.ai</span>
        </div>
        <div style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
          Marketing Manager
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="label-caps" style={{ paddingLeft: '16px' }}>Dashboard</div>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${view === id ? 'active' : ''}`}
            onClick={() => setView(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}

        <div className="label-caps" style={{ paddingLeft: '16px', marginTop: '32px' }}>Growth</div>
        <button className="nav-item">
          <Share2 size={18} /> Connect Socials
        </button>
        <button className="nav-item">
          <Grid size={18} /> AI Workflows
        </button>
      </nav>

      {/* Bottom Profile Section (21st.dev Style) */}
      <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
        <button className="btn-primary" onClick={onCreatePost} style={{ width: '100%', marginBottom: '24px' }}>
          <Plus size={18} /> Create Content
        </button>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flexShrink: 0 }}>
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 34, height: 34 } } }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || "Ajay Pendem"}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.primaryEmailAddress?.emailAddress || "pendemajay7@gmail.com"}
              </div>
            </div>
          </div>

          <SignOutButton>
            <button style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }} className="hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20">
              <LogOut size={14} />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  )
}
