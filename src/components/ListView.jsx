import { Clock, Edit3, Trash2, Globe, Send, Archive, FileText } from 'lucide-react'

const PLATFORM_ICONS = {
  x:         { color: '#E7E9EA', label: 'X'  },
  linkedin:  { color: '#60A5FA', label: 'in' },
  instagram: { color: '#F43F5E', label: 'IG' },
}

const STATUS_CONFIG = {
  scheduled: { icon: Clock,   color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
  published: { icon: Send,    color: '#10B981', bg: 'rgba(16,185,129,0.08)'  },
  draft:     { icon: Archive, color: '#71717A', bg: 'rgba(113,113,122,0.08)' },
}

export default function ListView({ posts, onDelete }) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><FileText size={36} /></div>
        <div className="empty-state-title">No posts yet</div>
        <div className="empty-state-sub">
          Hit "Create Content" in the sidebar to schedule your first post, or adjust the platform filters above.
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Work Archive</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            {sorted.length} piece{sorted.length !== 1 ? 's' : ''} of content
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {sorted.map((post, i) => {
          const Status = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft
          const platform = PLATFORM_ICONS[post.platform] || { color: '#fff', label: '?' }

          return (
            <div
              key={post.id}
              className="settings-section fade-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 24px',
                marginBottom: 0,
                transition: 'border-color 0.2s, background 0.2s',
                cursor: 'default',
                animationDelay: `${i * 0.04}s`,
              }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Platform badge */}
                  <div style={{
                    width: 30, height: 30, borderRadius: '7px',
                    background: `${platform.color}14`,
                    border: `1px solid ${platform.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: '800', color: platform.color,
                  }}>
                    {platform.label}
                  </div>

                  {/* Status badge */}
                  <div style={{
                    padding: '3px 9px', borderRadius: '99px',
                    background: Status.bg, color: Status.color,
                    fontSize: '10px', fontWeight: '700',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    <Status.icon size={10} />
                    {post.status}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '7px', borderRadius: '8px' }}
                    title="Edit"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '7px', borderRadius: '8px', color: '#F87171' }}
                    title="Delete"
                    onClick={() => onDelete?.(post.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <p style={{
                fontSize: '14px', lineHeight: '1.65',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '14px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {post.content}
              </p>

              {/* Footer */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.04)',
                paddingTop: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: '11px', color: 'var(--text-muted)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Globe size={11} />
                  {post.date} @ {post.time}
                </div>
                {post.engagement && (
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <span>♥ {post.engagement.likes?.toLocaleString()}</span>
                    <span>↺ {post.engagement.reposts?.toLocaleString()}</span>
                    <span>↩ {post.engagement.replies?.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
