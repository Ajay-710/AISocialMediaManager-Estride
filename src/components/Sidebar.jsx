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

const ClerkUserSection = () => {
  const { user } = useUser();
  return (
    <>
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
    </>
  );
};

export default function Sidebar({ view, setView, onCreatePost }) {
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

      {/* Bottom Profile and Actions */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', marginTop: 'auto' }}>
        <button className="btn-primary" onClick={onCreatePost} style={{ width: '100%', marginBottom: '24px', boxShadow: '0 10px 30px rgba(255,255,255,0.05)' }}>
          <Plus size={18} /> Create Content
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px' }}>
          <ClerkUserSection />
        </div>
      </div>
    </aside>
  )
}
