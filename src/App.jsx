import { useState } from 'react'
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CalendarView from './components/CalendarView'
import ListView from './components/ListView'
import Settings from './components/Settings'
import CreatePostModal from './components/CreatePostModal'
import { mockPosts } from './data/mockData'

import { storage } from './lib/storage'
import { PremiumCalendar } from './components/PremiumCalendar'
import AnalyticsDashboard from './components/AnalyticsDashboard'

export default function App() {
  const [view, setView] = useState('analytics') // Default to analytics for the "wow" factor now
  const [posts, setPosts] = useState(() => storage.loadPosts())
  const [activePlatforms, setActivePlatforms] = useState(new Set(['x', 'linkedin', 'instagram']))
  const [showModal, setShowModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)) // April 2026

  const handleAddPost = (newPost) => {
    const updated = storage.addPost(newPost)
    setPosts(updated)
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

  return (
    <>
      <SignedOut>
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-base)' }}>
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="app">
          <Sidebar
            view={view}
            setView={setView}
            onCreatePost={() => setShowModal(true)}
          />

          <div className="main-content">
            <Header
              view={view}
              activePlatforms={activePlatforms}
              onTogglePlatform={togglePlatform}
              onCreatePost={() => setShowModal(true)}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />

            <div className="page-container">
              <div className="page-content" style={{ padding: '40px' }}>
                {view === 'calendar' && (
                  <PremiumCalendar
                    posts={visiblePosts}
                  />
                )}
                {view === 'analytics' && <AnalyticsDashboard />}
                {view === 'list' && (
                  <ListView posts={visiblePosts} />
                )}
                {view === 'settings' && <Settings />}
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
      </SignedIn>
    </>
  )
}
