import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Users, Zap, Globe, Heart, Edit3 } from 'lucide-react'

const PLATFORM_COLORS = { x: '#E7E9EA', linkedin: '#3B82F6', instagram: '#E1306C' }
const PLATFORM_LABELS = { x: 'X', linkedin: 'in', instagram: 'IG' }

const CHART_DATA = [
  { name: 'Jan', reach: 4000, eng: 2400 },
  { name: 'Feb', reach: 3000, eng: 1398 },
  { name: 'Mar', reach: 5200, eng: 4100 },
  { name: 'Apr', reach: 2780, eng: 3908 },
  { name: 'May', reach: 1890, eng: 4800 },
  { name: 'Jun', reach: 2390, eng: 3800 },
  { name: 'Jul', reach: 3490, eng: 4300 },
]

function deriveStats(posts) {
  const published = posts.filter(p => p.status === 'published')
  const scheduled = posts.filter(p => p.status === 'scheduled')
  const drafts    = posts.filter(p => p.status === 'draft')

  const totalEng   = published.reduce((sum, p) => !p.engagement ? sum : sum + (p.engagement.likes || 0) + (p.engagement.reposts || 0) + (p.engagement.replies || 0), 0)
  const totalLikes = published.reduce((s, p) => s + (p.engagement?.likes || 0), 0)

  const counts = posts.reduce((acc, p) => ({ ...acc, [p.platform]: (acc[p.platform] || 0) + 1 }), {})
  const total  = posts.length || 1
  const platformData = [
    { name: 'X',         value: Math.round((counts.x         || 0) / total * 100), color: '#E7E9EA' },
    { name: 'LinkedIn',  value: Math.round((counts.linkedin  || 0) / total * 100), color: '#3B82F6' },
    { name: 'Instagram', value: Math.round((counts.instagram || 0) / total * 100), color: '#E1306C' },
  ].filter(p => p.value > 0)

  const engRate = published.length
    ? ((totalEng / (published.length * 1000)) * 100).toFixed(2)
    : '0.00'

  const topPosts = [...published]
    .filter(p => p.engagement)
    .sort((a, b) => {
      const ea = (a.engagement?.likes || 0) + (a.engagement?.reposts || 0) + (a.engagement?.replies || 0)
      const eb = (b.engagement?.likes || 0) + (b.engagement?.reposts || 0) + (b.engagement?.replies || 0)
      return eb - ea
    })
    .slice(0, 3)

  return { published, scheduled, drafts, totalEng, totalLikes, platformData, engRate, total, topPosts }
}

const TOOLTIP_STYLE = { background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }

export default function AnalyticsDashboard({ posts = [], onEditPost }) {
  const { published, totalEng, totalLikes, platformData, engRate, total, topPosts } = deriveStats(posts)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'white' }}>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Posts',      value: total,                       sub: `${published.length} published`,  icon: Globe      },
          { label: 'Total Engagement', value: totalEng.toLocaleString(),   sub: 'likes + reposts + replies',      icon: TrendingUp },
          { label: 'Total Likes',      value: totalLikes.toLocaleString(), sub: 'across published posts',         icon: Users      },
          { label: 'Avg Eng. Rate',    value: `${engRate}%`,               sub: 'per 1K impressions (est.)',      icon: Zap        },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="settings-section" style={{ padding: '18px 20px', marginBottom: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: '7px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Icon size={13} style={{ opacity: 0.45 }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '3px' }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.03em' }}>{value}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '12px' }}>

        {/* Reach chart */}
        <div className="settings-section" style={{ padding: '22px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '3px' }}>Est. Network Reach</div>
              <div style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.04em' }}>
                {(totalEng * 12).toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)', padding: '3px 9px', borderRadius: '99px' }}>
              ↑ 12.5%
            </div>
          </div>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="gReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ffffff" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10, fontWeight: 600 }} dy={8} />
                <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: 'white', fontWeight: '700' }} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <Area type="monotone" dataKey="reach" stroke="#ffffff" strokeWidth={1.5} fillOpacity={1} fill="url(#gReach)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform mix */}
        <div className="settings-section" style={{ padding: '22px', marginBottom: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '18px' }}>Platform Mix</div>
          {platformData.length > 0 ? (
            <>
              <div style={{ height: '100px', marginBottom: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} layout="vertical" barSize={14}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={TOOLTIP_STYLE} formatter={v => [`${v}%`, '']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}
                      shape={(props) => {
                        const { x, y, width, height, index } = props
                        return <rect x={x} y={y} width={width} height={height} rx={3} fill={platformData[index]?.color ?? '#fff'} fillOpacity={0.8} />
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {platformData.map(p => (
                  <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color }} />
                      <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
                    </div>
                    <span style={{ fontWeight: '700' }}>{p.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', paddingTop: '20px' }}>
              No posts yet.
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Engagement trend + Top posts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '12px' }}>

        {/* Engagement trend */}
        <div className="settings-section" style={{ padding: '22px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700' }}>Engagement Trend</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#3B82F6', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)', padding: '3px 9px', borderRadius: '99px' }}>
              ↑ 8.4%
            </div>
          </div>
          <div style={{ height: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="gEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} dy={8} />
                <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: 'white', fontWeight: '700' }} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <Area type="monotone" dataKey="eng" stroke="#3B82F6" strokeWidth={1.5} fillOpacity={1} fill="url(#gEng)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top performing posts */}
        <div className="settings-section" style={{ padding: '22px', marginBottom: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>Top Performing Posts</div>
          {topPosts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topPosts.map((post, i) => {
                const eng = (post.engagement?.likes || 0) + (post.engagement?.reposts || 0) + (post.engagement?.replies || 0)
                const color = PLATFORM_COLORS[post.platform] || '#fff'
                return (
                  <div key={post.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', width: 16, paddingTop: 1, flexShrink: 0 }}>
                      #{i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {post.content}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                        <span style={{ fontSize: '9px', fontWeight: '800', color, background: `${color}12`, border: `1px solid ${color}20`, padding: '2px 7px', borderRadius: '99px' }}>
                          {PLATFORM_LABELS[post.platform] || post.platform}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>
                          <Heart size={9} style={{ color: '#F43F5E', opacity: 0.8 }} />
                          {eng.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {onEditPost && (
                      <button
                        onClick={() => onEditPost(post)}
                        style={{ padding: '5px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', flexShrink: 0 }}
                      >
                        <Edit3 size={10} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', paddingTop: '20px' }}>
              No published posts with engagement yet.
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
