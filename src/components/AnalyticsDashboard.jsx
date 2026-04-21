import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Plus, Download, Filter, MoreHorizontal, TrendingUp, Users, Zap, Globe } from 'lucide-react'

// Static monthly chart data — will be replaced with real time-series once the
// backend accumulates enough historical posts to aggregate by month.
const CHART_DATA = [
  { name: 'Jan', reach: 4000, eng: 2400 },
  { name: 'Feb', reach: 3000, eng: 1398 },
  { name: 'Mar', reach: 5200, eng: 4100 },
  { name: 'Apr', reach: 2780, eng: 3908 },
  { name: 'May', reach: 1890, eng: 4800 },
  { name: 'Jun', reach: 2390, eng: 3800 },
  { name: 'Jul', reach: 3490, eng: 4300 },
]

const StatBadge = ({ value, trend }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 10px', borderRadius: '99px',
    background: trend === 'up' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
    color:      trend === 'up' ? '#10B981'               : '#EF4444',
    fontSize: '11px', fontWeight: '700',
    border: `1px solid ${trend === 'up' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
  }}>
    {trend === 'up' ? '↑' : '↓'} {value}
  </div>
)

// ── Derive real stats from posts prop ────────────────────────────────────────
function deriveStats(posts) {
  const published = posts.filter(p => p.status === 'published')
  const scheduled = posts.filter(p => p.status === 'scheduled')
  const drafts    = posts.filter(p => p.status === 'draft')

  const totalEng = published.reduce((sum, p) => {
    if (!p.engagement) return sum
    return sum + (p.engagement.likes || 0) + (p.engagement.reposts || 0) + (p.engagement.replies || 0)
  }, 0)

  const totalLikes = published.reduce((s, p) => s + (p.engagement?.likes || 0), 0)

  // Platform breakdown by post count
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

  return { published, scheduled, drafts, totalEng, totalLikes, platformData, engRate, total }
}

export default function AnalyticsDashboard({ posts = [] }) {
  const { published, totalEng, totalLikes, platformData, engRate, total } = deriveStats(posts)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'white' }}>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
            <span>Workspace</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span style={{ color: 'white' }}>Analytics</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.04em' }}>Performance Report</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" style={{ padding: '10px' }}><Download size={15} /></button>
          <button className="btn-primary" style={{ padding: '10px 18px' }}>
            <Plus size={15} /> Export
          </button>
        </div>
      </div>

      {/* KPI strip — derived from real posts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Posts',      value: total,                         sub: `${published.length} published`, icon: Globe   },
          { label: 'Total Engagement', value: totalEng.toLocaleString(),     sub: 'likes + shares + replies',     icon: TrendingUp },
          { label: 'Total Likes',      value: totalLikes.toLocaleString(),   sub: 'across published posts',        icon: Users   },
          { label: 'Avg Eng. Rate',    value: `${engRate}%`,                 sub: 'per 1K impressions (est.)',     icon: Zap     },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="settings-section" style={{ padding: '20px 24px', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: 30, height: 30, borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={14} style={{ opacity: 0.5 }} />
              </div>
              <MoreHorizontal size={13} style={{ opacity: 0.2 }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.03em' }}>{value}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>

        {/* Reach area chart */}
        <div className="settings-section" style={{ padding: '24px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Network Reach (Estimated)</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.04em' }}>
                  {(totalEng * 12).toLocaleString()}
                </span>
                <StatBadge value="12.5%" trend="up" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn-secondary" style={{ padding: '7px 12px', fontSize: '11px', fontWeight: '700' }}>
                Last 7 months
              </button>
              <button className="btn-secondary" style={{ padding: '7px' }}><Filter size={13} /></button>
            </div>
          </div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="gReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ffffff" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600 }} dy={8} />
                <Tooltip
                  contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }}
                  itemStyle={{ color: 'white', fontWeight: '700' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.08)' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#gReach)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="settings-section" style={{ padding: '24px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Platform Mix</h3>
            <Globe size={13} style={{ opacity: 0.25 }} />
          </div>

          {platformData.length > 0 ? (
            <>
              <div style={{ height: '120px', marginBottom: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} layout="vertical" barSize={16}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }}
                      formatter={(v) => [`${v}%`, '']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}
                      shape={(props) => {
                        const { x, y, width, height, index } = props
                        const color = platformData[index]?.color ?? '#fff'
                        return <rect x={x} y={y} width={width} height={height} rx={4} fill={color} fillOpacity={0.85} />
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {platformData.map(p => (
                  <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                      <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
                    </div>
                    <span style={{ fontWeight: '700' }}>{p.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', paddingTop: '20px' }}>
              No posts yet — create content to see platform breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Engagement trend */}
      <div className="settings-section" style={{ padding: '24px', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Engagement Trend</h3>
          <StatBadge value="8.4%" trend="up" />
        </div>
        <div style={{ height: '160px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="gEng" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} dy={8} />
              <Tooltip
                contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }}
                itemStyle={{ color: 'white', fontWeight: '700' }}
                cursor={{ stroke: 'rgba(255,255,255,0.08)' }}
              />
              <Area type="monotone" dataKey="eng" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#gEng)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
