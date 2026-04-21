import { Clock, Edit3, Trash2, Globe, Send, Archive } from 'lucide-react'

const PLATFORM_ICONS = {
  x: { color: '#ffffff', label: 'X' },
  linkedin: { color: '#0A66C2', label: 'LinkedIn' },
  instagram: { color: '#E1306C', label: 'Instagram' }
}

const STATUS_CONFIG = {
  scheduled: { icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
  published: { icon: Send, color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
  draft: { icon: Archive, color: '#71717A', bg: 'rgba(113, 113, 122, 0.08)' }
}

export default function ListView({ posts }) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Work Archive</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Manage <strong>{posts.length}</strong> pieces of scheduled content</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {sorted.map((post) => {
          const Status = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;
          return (
            <div 
              key={post.id}
              className="settings-section"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                marginBottom: '0',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: PLATFORM_ICONS[post.platform]?.color || 'white'
                  }}>
                    {PLATFORM_ICONS[post.platform]?.label || 'P'}
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '99px',
                    background: Status.bg,
                    color: Status.color,
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Status.icon size={10} />
                    {post.status}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" style={{ padding: '8px', borderRadius: '8px' }}><Edit3 size={14} /></button>
                  <button className="btn-secondary" style={{ padding: '8px', borderRadius: '8px' }}><Trash2 size={14} /></button>
                </div>
              </div>

              {/* Content area */}
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {post.content}
              </p>

              {/* Metadata footer */}
              <div style={{ 
                borderTop: '1px solid var(--border-subtle)', 
                paddingTop: '16px', 
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={12} />
                  Scheduled for {post.date} @ {post.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
