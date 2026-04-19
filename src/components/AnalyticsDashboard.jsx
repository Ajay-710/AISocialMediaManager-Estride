import React from 'react'
import { TrendingUp, Users, MousePointer2, BarChart2, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '../lib/utils'

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
        <Icon size={20} />
      </div>
      <div className={cn(
        "flex items-center text-xs font-medium",
        trend === 'up' ? "text-emerald-400" : "text-rose-400"
      )}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-gray-500 font-medium">{title}</div>
  </div>
)

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Impressions" value="1.2M" change="+12.5%" icon={TrendingUp} trend="up" />
        <StatCard title="Active Followers" value="48.2K" change="+4.3%" icon={Users} trend="up" />
        <StatCard title="Total Clicks" value="24.1K" change="-2.1%" icon={MousePointer2} trend="down" />
        <StatCard title="Avg. Engagement" value="5.8%" change="+0.8%" icon={Zap} trend="up" />
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
        {/* Performance Chart Placeholder */}
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Engagement Growth</h3>
              <p className="text-sm text-gray-500">Weekly performance across all platforms</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="absolute inset-x-0 bottom-0 h-48 flex items-end px-8 pb-8 gap-3">
            {[40, 65, 45, 90, 55, 75, 60, 85, 45, 95].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-indigo-500/20 rounded-t-lg relative group/bar hover:bg-indigo-500/40 transition-all duration-500"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Platform Sidebar */}
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Best Platform</h3>
            <p className="text-sm text-gray-400">Instagram is your top performer this week</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C]">IG</div>
                <div className="text-sm font-medium text-white">Instagram</div>
              </div>
              <div className="text-sm font-bold text-white">62%</div>
            </div>
            <div className="flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">in</div>
                <div className="text-sm font-medium text-white">LinkedIn</div>
              </div>
              <div className="text-sm font-bold text-white">24%</div>
            </div>
            <div className="flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1D9BF0]/20 flex items-center justify-center text-[#1D9BF0]">X</div>
                <div className="text-sm font-medium text-white">X (Twitter)</div>
              </div>
              <div className="text-sm font-bold text-white">14%</div>
            </div>
          </div>

          <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-all border border-white/10">
            View Detailed Reports
          </button>
        </div>
      </div>
    </div>
  )
}
