import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, MousePointer2, BarChart2, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

const StatCard = ({ title, value, change, icon: Icon, trend, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:bg-[#121212] hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative z-10 flex justify-between items-start mb-4">
      <div className="p-2 rounded-xl bg-white/5 text-gray-300 border border-white/5 group-hover:bg-white/10 transition-colors">
        <Icon size={18} />
      </div>
      <div className={cn(
        "flex items-center text-xs font-semibold px-2 py-1 rounded-md bg-white/5 border border-white/5",
        trend === 'up' ? "text-gray-200" : "text-gray-400"
      )}>
        {trend === 'up' ? <ArrowUpRight size={13} className="mr-1" /> : <ArrowDownRight size={13} className="mr-1" />}
        {change}
      </div>
    </div>
    <div className="relative z-10">
      <div className="text-3xl font-extrabold text-white mb-1 tracking-tight" style={{ lineHeight: 1.2 }}>{value}</div>
      <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">{title}</div>
    </div>
  </motion.div>
)

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%' }}>
      {/* Metrics Row */}
      <motion.div 
        initial={{ opacity: 0, filter: 'blur(5px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard delay={0.1} title="Impressions" value="1.2M" change="+12.5%" icon={TrendingUp} trend="up" />
        <StatCard delay={0.2} title="Followers" value="48.2K" change="+4.3%" icon={Users} trend="up" />
        <StatCard delay={0.3} title="Clicks" value="24.1K" change="-2.1%" icon={MousePointer2} trend="down" />
        <StatCard delay={0.4} title="Engagement" value="5.8%" change="+0.8%" icon={Zap} trend="up" />
      </motion.div>

      {/* Main Bento Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '32px', 
        flex: 1, 
        minHeight: '500px' 
      }}>
        {/* Performance Chart Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ 
            gridColumn: 'span 2', 
            background: '#0A0A0A', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '24px', 
            padding: '40px', 
            position: 'relative',
            overflow: 'hidden'
          }}
          className="group hover:border-white/20 transition-colors duration-500"
        >
          {/* Extremely subtle dot matrix background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'relative', zIndex: 10 }}>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight" style={{ lineHeight: 1 }}>Engagement Velocity</h3>
              <p className="text-sm text-gray-500 mt-2">Aggregate cross-platform metrics</p>
            </div>
            <select className="bg-transparent border border-white/10 rounded-lg px-4 py-2 text-xs font-semibold text-gray-300 outline-none cursor-pointer hover:bg-white/5 transition-colors">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div style={{ 
            position: 'absolute', 
            inset: '160px 40px 40px', 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: '12px' 
          }}>
            <AnimatePresence>
              {mounted && [40, 65, 45, 90, 55, 75, 60, 85, 45, 95, 70, 80].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + (i * 0.04), type: 'spring', stiffness: 80 }}
                  whileHover={{ scaleY: 1.05, transformOrigin: 'bottom', backgroundColor: '#ffffff' }}
                  style={{ 
                    flex: 1, 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px 8px 0 0',
                    cursor: 'crosshair',
                    position: 'relative',
                    transition: 'background-color 0.3s'
                  }} 
                  className="group/bar"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 shadow-md pointer-events-none transition-opacity">
                    {h * 12}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Best Platform Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ 
            background: '#0A0A0A', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '24px', 
            padding: '40px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="hover:border-white/20 transition-colors duration-500"
        >
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h3 className="text-xl font-bold text-white tracking-tight mb-2" style={{ lineHeight: 1 }}>Platform Rank</h3>
            <p className="text-sm text-gray-500">Instagram drives the most value</p>
          </div>
          
          <div className="space-y-4 my-10" style={{ position: 'relative', zIndex: 10 }}>
            {/* Rank 1 */}
            <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs">IG</div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight" style={{ lineHeight: 1.2 }}>Instagram</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase">12k New</div>
                </div>
              </div>
              <div className="text-lg font-bold text-white">62%</div>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-4 rounded-xl border border-transparent hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 text-gray-300 flex items-center justify-center font-black text-xs">IN</div>
                <div>
                  <div className="text-sm font-bold text-gray-300 tracking-tight" style={{ lineHeight: 1.2 }}>LinkedIn</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase">4.2k New</div>
                </div>
              </div>
              <div className="text-[15px] font-bold text-gray-300 group-hover:text-white">24%</div>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-4 rounded-xl border border-transparent hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 text-gray-500 flex items-center justify-center font-black text-xs">𝕏</div>
                <div>
                  <div className="text-sm font-bold text-gray-500 tracking-tight" style={{ lineHeight: 1.2 }}>X (Twitter)</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase">1.1k New</div>
                </div>
              </div>
              <div className="text-[15px] font-bold text-gray-500 group-hover:text-white">14%</div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: '#FFFFFF', 
              color: '#000000', 
              borderRadius: '12px', 
              fontSize: '13px', 
              fontWeight: 800, 
              border: '1px solid #FFFFFF', 
              cursor: 'pointer',
              zIndex: 10,
              position: 'relative',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            className="hover:bg-transparent hover:text-white transition-colors duration-300"
          >
            Export Report
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

