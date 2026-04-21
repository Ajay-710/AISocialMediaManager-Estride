import { Clock, Edit3, Trash2, Send, Archive, FileText, Heart, Repeat2, MessageCircle } from 'lucide-react'

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

export default function ListView({ posts, onDelete, onEdit }) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><FileText size={32} /></div>
        <div className="empty-state-title">No posts found</div>
        <div className="empty-state-sub">
          Hit "Create Content" in the sidebar to schedule your first post, or clear the search filter above.
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em' }}>Content Archive</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
          {sorted.length} piece{sorted.length !== 1 ? 's' : ''} of content
        </p>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {sorted.map((post, i) => {
          const Status   = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft
          const platform = PLATFORM_ICONS[post.platform] || { color: '#fff', label: '?' }

          return (
            <div
              key={post.id}
              className="settings-section fade-in"
              style={{ display: 'flex', flexDirection: 'column', padding: '18px 22px', marginBottom: 0, animationDelay: `${i * 0.035}s` }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '7px',
                    background: `${platform.color}12`, border: `1px solid ${platform.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', fontWeight: '800', color: platform.color,
                  }}>
                    {platform.label}
                  </div>
                  <div style={{
                    padding: '2px 8px', borderRadius: '99px',
                    background: Status.bg, color: Status.color,
                    fontSize: '9px', fontWeight: '700',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Status.icon size={9} />
                    {post.status}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {post.date} · {post.time}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px', borderRadius: '8px' }}
                    title="Edit post"
                    onClick={() => onEdit?.(post)}
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px', borderRadius: '8px', transition: 'color 0.15s' }}
                    title="Delete post"
                    onClick={() => onDelete?.(post.id)}
                    onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
                    onMouseLeave={e => e.currentTarget.style.color = 'white'}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <p style={{
                fontSize: '13px', lineHeight: '1.7', color: 'rgba(255,255,255,0.75)',
                marginBottom: post.engagement ? '12px' : 0,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {post.content}
              </p>

              {/* Engagement */}
              {post.engagement && (
                <div style={{ display: 'flex', gap: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Heart size={11} style={{ color: '#F43F5E', opacity: 0.8 }} />
                    {post.engagement.likes?.toLocaleString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Repeat2 size={11} style={{ color: '#10B981', opacity: 0.8 }} />
                    {post.engagement.reposts?.toLocaleString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <MessageCircle size={11} style={{ color: '#60A5FA', opacity: 0.8 }} />
                    {post.engagement.replies?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
