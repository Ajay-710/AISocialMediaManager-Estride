import { useState, useEffect, useMemo } from 'react'
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ListView from './components/ListView'
import Settings from './components/Settings'
import CreatePostModal from './components/CreatePostModal'
import EditPostModal from './components/EditPostModal'
import { PLATFORMS } from './data/mockData'
import { storage } from './lib/storage'
import { SingleMonthCalendar } from './components/SingleMonthCalendar'
import AnalyticsDashboard from './components/AnalyticsDashboard'

export default function App() {
  const { user } = useUser()
  const [view, setView] = useState('calendar')
  const [posts, setPosts] = useState([])
  const [activePlatforms, setActivePlatforms] = useState(new Set(['x', 'linkedin', 'instagram']))
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user?.id) {
      storage.loadPosts(user.id).then(data => {
        setPosts(data)
        setIsLoading(false)
      })
    }
  }, [user?.id])

  const handleAddPost = async (newPost) => {
    const added = await storage.addPost(newPost, user?.id)
    if (added) setPosts(prev => [added, ...prev])
    setShowModal(false)
  }

  const handleDeletePost = async (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
    const ok = await storage.deletePost(postId, user?.id)
    if (!ok) storage.loadPosts(user?.id).then(setPosts)
  }

  const handleEditPost = (post) => setEditingPost(post)

  const handleUpdatePost = async (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
    await storage.updatePost(updatedPost.id, updatedPost, user?.id)
    setEditingPost(null)
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

  const visiblePosts = useMemo(() => posts
    .filter(p => activePlatforms.has(p.platform))
    .filter(p => !searchQuery || p.content.toLowerCase().includes(searchQuery.toLowerCase())),
    [posts, activePlatforms, searchQuery]
  )

  return (
    <>
      <SignedOut>
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-deep)' }}>
          <SignIn routing="hash" />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="app">
          <Sidebar
            view={view}
            setView={setView}
            onCreatePost={() => setShowModal(true)}
            postCount={posts.length}
          />

          <div className="main-content">
            <Header
              view={view}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
            />

            <div className="page-container">
              {/* Platform filter bar — hidden on Settings & Workflows */}
              {view !== 'settings' && view !== 'workflows' && <div style={{
                padding: '12px 40px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.01)',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {PLATFORMS.map(({ id, label, color }) => {
                    const isActive = activePlatforms.has(id)
                    const count = posts.filter(p => p.platform === id).length
                    return (
                      <button
                        key={id}
                        onClick={() => togglePlatform(id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '7px',
                          padding: '5px 13px', borderRadius: '99px',
                          fontSize: '12px', fontWeight: '600',
                          background: isActive ? `${color}12` : 'transparent',
                          border: `1px solid ${isActive ? `${color}28` : 'rgba(255,255,255,0.05)'}`,
                          color: isActive ? color : 'var(--text-muted)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? color : 'rgba(255,255,255,0.15)' }} />
                        {label}
                        {count > 0 && <span style={{ fontSize: '10px', opacity: 0.5 }}>{count}</span>}
                      </button>
                    )
                  })}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
                  {visiblePosts.length} post{visiblePosts.length !== 1 ? 's' : ''}
                  {searchQuery && <span style={{ color: 'rgba(255,255,255,0.35)' }}> · "{searchQuery}"</span>}
                </div>
              </div>}

              <div className="page-content">
                {isLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '14px' }}>
                    <div className="spinner" />
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em' }}>SYNCHRONIZING...</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={view}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      style={{ height: '100%' }}
                    >
                      {view === 'calendar'  && <SingleMonthCalendar posts={visiblePosts} onEditPost={handleEditPost} />}
                      {view === 'analytics' && <AnalyticsDashboard posts={visiblePosts} onEditPost={handleEditPost} />}
                      {view === 'list'      && <ListView posts={visiblePosts} onDelete={handleDeletePost} onEdit={handleEditPost} />}
                      {view === 'settings'  && <Settings />}
                      {view === 'workflows' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" opacity="0.4" /><path d="M14 4l-4 16" /></svg>
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 6 }}>Custom Workflows</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 280 }}>Connect webhooks from external tools to fully automate pipeline creation here soon.</div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {showModal && (
            <CreatePostModal onClose={() => setShowModal(false)} onSave={handleAddPost} />
          )}

          {editingPost && (
            <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleUpdatePost} />
          )}
        </div>
      </SignedIn>
    </>
  )
}
