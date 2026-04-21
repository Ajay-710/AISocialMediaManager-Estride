import React from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { Plus, Download, Filter, MoreHorizontal, ArrowUpRight, TrendingUp, Users, Zap, Globe } from 'lucide-react'

const DATA = [
  { name: 'Jan', reach: 4000, eng: 2400 },
  { name: 'Feb', reach: 3000, eng: 1398 },
  { name: 'Mar', reach: 2000, eng: 9800 },
  { name: 'Apr', reach: 2780, eng: 3908 },
  { name: 'May', reach: 1890, eng: 4800 },
  { name: 'Jun', reach: 2390, eng: 3800 },
  { name: 'Jul', reach: 3490, eng: 4300 },
]

const PLATFORM_DATA = [
  { name: 'X', value: 45, color: '#FFFFFF' },
  { name: 'LinkedIn', value: 27, color: '#3B82F6' },
  { name: 'Instagram', value: 18, color: '#E1306C' },
  { name: 'Google', value: 10, color: '#71717A' },
]

const StatBadge = ({ value, trend }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '99px',
    background: trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: trend === 'up' ? '#10B981' : '#EF4444',
    fontSize: '11px',
    fontWeight: '700',
    border: `1px solid ${trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`
  }}>
    {trend === 'up' ? '+' : '-'}{value}
  </div>
)

export default function AnalyticsDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'white' }}>
      
      {/* Top Navigation / Breadcrumbs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
            <span>Workflows</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span style={{ color: 'white' }}>Analytics</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.04em' }}>Performance Report</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
            {['AJ', 'EK', 'MD'].map((initials, i) => (
              <div key={i} style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#1A1A1A',
                border: '2px solid #050505',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '800',
                marginLeft: i === 0 ? 0 : '-12px',
                color: 'var(--text-muted)'
              }}>
                {initials}
              </div>
            ))}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'white',
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '-12px',
              border: '2px solid #050505'
            }}>
              <Plus size={14} />
            </div>
          </div>
          <button className="btn-secondary" style={{ padding: '10px' }}><Download size={16} /></button>
          <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
            <Plus size={16} /> New Report
          </button>
        </div>
      </div>

      {/* Hero Numbers Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        
        {/* Main Revenue Card */}
        <div className="settings-section" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>Total Network Reach</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.05em' }}>1,284,976</span>
                <StatBadge value="12.5%" trend="up" />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>vs prev. 1.1M  Last 30 Days</div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '11px', fontWeight: '700', border: '1px solid var(--border-glass)' }}>
                Timeframe: Sep 1 - Sep 30
              </div>
              <button className="btn-secondary" style={{ padding: '8px' }}><Filter size={14} /></button>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  hide={true}
                />
                <Tooltip 
                  contentStyle={{ background: '#0A0A0A', border: '1px solid var(--border-glass)', borderRadius: '12px' }}
                  itemStyle={{ color: 'white', fontSize: '12px', fontWeight: '700' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#ffffff" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorReach)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Mini Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="settings-section" style={{ padding: '24px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <Users size={16} />
              </div>
              <MoreHorizontal size={14} style={{ opacity: 0.3 }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>New Followers</div>
            <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>48,201</div>
            <StatBadge value="4.3%" trend="up" />
          </div>

          <div className="settings-section" style={{ padding: '24px', flex: 1, background: 'white', color: 'black' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <Zap size={16} />
              </div>
              <ArrowUpRight size={14} style={{ opacity: 0.3 }} />
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontWeight: '600' }}>Engagement Rate</div>
            <div style={{ fontSize: '24px', fontWeight: '900', margin: '4px 0' }}>8.42%</div>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.4 }}>Top 1% of Niche</div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Platform Value Card */}
        <div className="settings-section" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Platform Value</h3>
            <Globe size={14} style={{ opacity: 0.3 }} />
          </div>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLATFORM_DATA} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {PLATFORM_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {PLATFORM_DATA.map(p => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
                <span style={{ fontWeight: '700' }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Dynamic Placeholder */}
        <div className="settings-section" style={{ padding: '24px', gridColumn: 'span 2' }}>
           <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '24px' }}>Growth Trajectory</h3>
           <div style={{ height: '240px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={DATA}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                 <Tooltip />
                 <Area type="stepAfter" dataKey="eng" stroke="#3B82F6" strokeWidth={2} fill="rgba(59, 130, 246, 0.05)" />
                 <Area type="stepAfter" dataKey="reach" stroke="#ffffff" strokeWidth={2} fill="rgba(255, 255, 255, 0.05)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  )
}

