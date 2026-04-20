import { useState } from 'react'
import { Calendar, LayoutList, Settings, Plus, LogOut, Grid, ChevronDown, ChevronRight, Share2, BarChart3 } from 'lucide-react'
import { UserButton, useUser, SignOutButton } from '@clerk/clerk-react'

// Pure React/CSS Collapsible to maintain the exact aesthetic without Tailwind clashes
const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div style={{ marginTop: '24px' }}>
      <button 
        className="sidebar-section-label" 
        onClick={() => setOpen(!open)}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer', 
          background: 'transparent', 
          border: 'none',
          paddingRight: '12px',
          outline: 'none',
        }}
      >
        {title}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <div style={{ 
        overflow: 'hidden', 
        transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s', 
        maxHeight: open ? '250px' : '0',
        opacity: open ? 1 : 0
      }}>
        <div style={{ paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Sidebar({ view, setView, onCreatePost }) {
  const { user } = useUser();

  const navItems = [
    { id: 'calendar',  label: 'Calendar',      icon: Calendar },
    { id: 'analytics', label: 'Analytics',     icon: BarChart3 },
    { id: 'list',      label: 'Content List',  icon: LayoutList },
    { id: 'settings',  label: 'Settings',      icon: Settings },
  ]

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand" style={{ border: 'none', marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: -4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            borderRadius: '10px',
            filter: 'blur(10px)',
            opacity: 0.8
          }} />
          <img 
            src="/logo.png" 
            alt="Estride" 
            style={{ 
              width: '120px', 
              display: 'block', 
              position: 'relative',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))'
            }} 
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Workspace</div>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${view === id ? 'active' : ''}`}
            onClick={() => setView(id)}
          >
            <Icon size={16} className="nav-item-icon" />
            {label}
          </button>
        ))}

        <CollapsibleSection title="Extra Options">
          <button className="nav-item">
            <Share2 size={16} className="nav-item-icon" /> Connect Socials
          </button>
          <button className="nav-item">
            <Grid size={16} className="nav-item-icon" /> Integrations
          </button>
        </CollapsibleSection>
      </nav>

      {/* Bottom Profile and Actions */}
      <div className="sidebar-bottom">
        <button className="create-btn" onClick={onCreatePost} style={{ width: '100%', marginBottom: '16px', justifyContent: 'center' }}>
          <Plus size={16} style={{ marginRight: '6px' }} /> Create Content
        </button>

        <div className="sidebar-user">
          <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 30, height: 30 } } }} />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.fullName || "Guest User"}</div>
            <div className="sidebar-user-plan">{user?.primaryEmailAddress?.emailAddress || "Pro · 13 posts scheduled"}</div>
          </div>
          <SignOutButton>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <LogOut size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  )
}
