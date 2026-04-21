import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CalendarView from './components/CalendarView'
import ListView from './components/ListView'
import Settings from './components/Settings'
import CreatePostModal from './components/CreatePostModal'
import { PLATFORMS } from './data/mockData'

import { storage } from './lib/storage'
import { SingleMonthCalendar } from './components/SingleMonthCalendar'
import AnalyticsDashboard from './components/AnalyticsDashboard'

export default function App({ demoMode = false }) {
  const [view, setView] = useState('calendar')
  const [posts, setPosts] = useState([])
  const [activePlatforms, setActivePlatforms] = useState(new Set(['x', 'linkedin', 'instagram']))
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    storage.loadPosts().then(data => {
      setPosts(data)
      setIsLoading(false)
    })
  }, [])

  const handleAddPost = async (newPost) => {
    const added = await storage.addPost(newPost)
    if (added) {
      setPosts(prev => [added, ...prev])
    }
    setShowModal(false)
  }

  const togglePlatform = (id) => {
    setActivePlatforms(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const visiblePosts = posts.filter(p => activePlatforms.has(p.platform))

  const renderContent = () => (
    <div className="app">
      <Sidebar
        view={view}
        setView={setView}
        onCreatePost={() => setShowModal(true)}
        demoMode={demoMode}
      />

      <div className="main-content">
        <Header
          view={view}
          onCreatePost={() => setShowModal(true)}
        />

        <div className="page-container">
          {/* Sub-header for Platform Filtering */}
          <div style={{ 
            padding: '20px 40px', 
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {PLATFORMS.map(({ id, label, color }) => {
                const isActive = activePlatforms.has(id)
                return (
                  <button
                    key={id}
                    onClick={() => togglePlatform(id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: isActive ? `${color}15` : 'transparent',
                      border: `1px solid ${isActive ? `${color}30` : 'rgba(255,255,255,0.05)'}`,
                      color: isActive ? color : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? color : 'rgba(255,255,255,0.2)' }} />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="page-content" style={{ padding: '40px', overflowY: 'auto' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mb-4"></div>
                <p className="text-gray-400 font-medium tracking-wide text-sm">Synchronizing Database...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%' }}
                >
                  {view === 'calendar' && (
                    <SingleMonthCalendar
                      posts={visiblePosts}
                    />
                  )}
                  {view === 'analytics' && <AnalyticsDashboard />}
                  {view === 'list' && (
                    <ListView posts={visiblePosts} />
                  )}
                  {view === 'settings' && <Settings />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CreatePostModal 
          onClose={() => setShowModal(false)} 
          onSave={handleAddPost}
        />
      )}
    </div>
  );

  if (demoMode) {
    return <>{renderContent()}</>;
  }

  return (
    <>
      <SignedOut>
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-base)' }}>
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      
      <SignedIn>
        {renderContent()}
      </SignedIn>
    </>
  )
}
