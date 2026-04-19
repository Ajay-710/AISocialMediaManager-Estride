import { Clock, Heart, Repeat2, MessageCircle, Edit3, Trash2 } from 'lucide-react'

const PLATFORM_LABELS = { x: 'X', linkedin: 'in', instagram: 'IG' }
const PLATFORM_COLORS = {
  x:         { bg: 'var(--platform-x-subtle)',         color: 'var(--platform-x)' },
  linkedin:  { bg: 'var(--platform-linkedin-subtle)',  color: 'var(--platform-linkedin)' },
  instagram: { bg: 'var(--platform-instagram-subtle)', color: 'var(--platform-instagram)' },
}

function PlatformBadge({ platform, size = 36 }) {
  const { bg, color } = PLATFORM_COLORS[platform]
  return (
    <div
      className="platform-badge"
      style={{
        width: size,
        height: size,
        background: bg,
        color,
        fontSize: size * 0.33,
        border: `1px solid ${color}22`,
        borderRadius: 8,
      }}
    >
      {PLATFORM_LABELS[platform]}
    </div>
  )
}

function formatDate(dateStr, time) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${label} · ${time}`
}

export default function ListView({ posts }) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      <div className="list-view-header">
        <p className="list-count">
          Showing <strong>{posts.length}</strong> posts
        </p>
      </div>

      <div className="posts-list">
        {sorted.map((post, i) => (
          <div
            key={post.id}
            className="post-card"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            {/* Platform */}
            <div className="post-card-platform">
              <PlatformBadge platform={post.platform} />
            </div>

            {/* Body */}
            <div className="post-card-body">
              <div className="post-card-meta">
                <span className={`status-badge ${post.status}`}>
                  {post.status}
                </span>
                <span className="post-date">
                  <Clock size={11} />
                  {formatDate(post.date, post.time)}
                </span>
              </div>

              <p className="post-content-preview">{post.content}</p>

              {post.engagement && (
                <div className="post-engagement">
                  <span className="engagement-stat">
                    <Heart size={12} />
                    <strong>{post.engagement.likes.toLocaleString()}</strong>
                  </span>
                  <span className="engagement-stat">
                    <Repeat2 size={12} />
                    <strong>{post.engagement.reposts.toLocaleString()}</strong>
                  </span>
                  <span className="engagement-stat">
                    <MessageCircle size={12} />
                    <strong>{post.engagement.replies.toLocaleString()}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="post-card-actions">
              <button className="action-btn" title="Edit">
                <Edit3 size={14} />
              </button>
              <button className="action-btn" title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
