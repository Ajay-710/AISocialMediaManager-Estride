import { useState } from 'react'
import { X, Sparkles, Send, FileText, Loader2, Youtube, PenLine, Lightbulb } from 'lucide-react'
import { socialService } from '../lib/socials'

const PLATFORMS = [
  { id: 'x',         label: 'X',         color: '#E7E9EA', charLimit: 280 },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#60A5FA', charLimit: 3000 },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', charLimit: 2200 },
]

const CONTENT_TYPES = [
  { id: 'youtube', label: 'YouTube → AI', icon: Youtube },
  { id: 'topic',   label: 'Topic → AI',   icon: Lightbulb },
  { id: 'manual',  label: 'Write',         icon: PenLine },
]

const today = new Date().toISOString().slice(0, 10)

export default function CreatePostModal({ onClose, onSave }) {
  const [contentType, setContentType]           = useState('youtube')
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set(['x']))
  const [youtubeUrl, setYoutubeUrl]             = useState('')
  const [topic, setTopic]                       = useState('')
  const [content, setContent]                   = useState('')
  const [scheduleDate, setScheduleDate]         = useState(today)
  const [scheduleTime, setScheduleTime]         = useState('09:00')
  const [isGenerating, setIsGenerating]         = useState(false)
  const [isPosting, setIsPosting]               = useState(false)

  const charLimit  = selectedPlatforms.has('x') ? 280 : 3000
  const remaining  = charLimit - content.length
  const charPct    = Math.min((content.length / charLimit) * 100, 100)
  const isOverLimit = remaining < 0

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev)
      if (next.has(id)) { if (next.size > 1) next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const handleGenerate = async () => {
    const source = contentType === 'youtube' ? youtubeUrl : topic
    if (!source.trim()) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl: contentType === 'youtube' ? youtubeUrl : undefined,
          topic:      contentType === 'topic'   ? topic      : undefined,
          platforms:  Array.from(selectedPlatforms),
        }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      setContent(data.content || '')
    } catch {
      setContent(contentType === 'youtube'
        ? `People think editing is the hardest part of YouTube. Wrong.\n\nThe hardest part is distribution.\n\nI just built a system that turns 1 video into 3 weeks of pipeline.\n\nHere's the exact stack 🧵`
        : `${topic ? `On ${topic}:\n\n` : ''}The counterintuitive truth nobody shares:\n\nThe best content strategies aren't about going viral — they're about being consistently, relentlessly useful to a specific person.\n\nVirality is rented attention. Trust is owned distribution.`
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const buildPost = (status) => ({
    id: Date.now().toString(),
    platform: Array.from(selectedPlatforms)[0],
    date: scheduleDate,
    time: scheduleTime,
    status,
    content,
    engagement: null,
  })

  const handleSchedule = async () => {
    if (!content.trim()) return
    setIsPosting(true)
    try {
      await socialService.postToSocials(content, Array.from(selectedPlatforms))
      onSave(buildPost('scheduled'))
    } catch {
      alert('Error posting. Check your Ayrshare configuration in Settings.')
    } finally {
      setIsPosting(false)
    }
  }

  const handleSaveDraft = () => {
    if (!content.trim()) return
    onSave(buildPost('draft'))
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 580 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.02em' }}>New Post</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>AI-generate or write manually</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Platform selector */}
          <div>
            <div className="label-caps">Platforms</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {PLATFORMS.map(({ id, label, color }) => (
                <button key={id} onClick={() => togglePlatform(id)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: '10px',
                  fontSize: '12px', fontWeight: '700',
                  background: selectedPlatforms.has(id) ? `${color}15` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedPlatforms.has(id) ? `${color}32` : 'rgba(255,255,255,0.06)'}`,
                  color: selectedPlatforms.has(id) ? color : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: selectedPlatforms.has(id) ? color : 'rgba(255,255,255,0.12)' }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content source tabs */}
          <div>
            <div className="label-caps">Content Source</div>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '3px', gap: '2px' }}>
              {CONTENT_TYPES.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setContentType(id)} style={{
                  flex: 1, padding: '8px 10px', borderRadius: '9px',
                  fontSize: '12px', fontWeight: '600',
                  background: contentType === id ? 'rgba(255,255,255,0.07)' : 'transparent',
                  border: `1px solid ${contentType === id ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                  color: contentType === id ? 'white' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* AI input */}
          {contentType !== 'manual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {contentType === 'youtube' ? (
                <div style={{ position: 'relative' }}>
                  <Youtube size={13} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#EF4444', opacity: 0.7 }} />
                  <input className="settings-input" type="url" placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} style={{ paddingLeft: '38px' }} />
                </div>
              ) : (
                <input className="settings-input" type="text" placeholder="e.g. Why consistency beats talent in content" value={topic} onChange={e => setTopic(e.target.value)} />
              )}
              <button className="btn-secondary" onClick={handleGenerate}
                disabled={isGenerating || (contentType === 'youtube' ? !youtubeUrl : !topic)}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', opacity: (isGenerating || (contentType === 'youtube' ? !youtubeUrl : !topic)) ? 0.45 : 1 }}
              >
                {isGenerating ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Sparkles size={13} />}
                {isGenerating ? 'Generating with Claude...' : 'Generate Content'}
              </button>
            </div>
          )}

          {/* Content textarea */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div className="label-caps" style={{ marginBottom: 0 }}>Content</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: isOverLimit ? '#EF4444' : remaining < 50 ? '#F59E0B' : 'var(--text-muted)' }}>
                {remaining}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <textarea className="settings-textarea" placeholder="What do you want to share?" value={content} onChange={e => setContent(e.target.value)} style={{ minHeight: 130, paddingBottom: '28px' }} />
              <div style={{ position: 'absolute', bottom: '10px', left: '14px', right: '14px', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px' }}>
                <div style={{ height: '100%', borderRadius: '99px', width: `${charPct}%`, background: isOverLimit ? '#EF4444' : charPct > 85 ? '#F59E0B' : 'rgba(255,255,255,0.18)', transition: 'width 0.1s, background 0.2s' }} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div className="label-caps">Date</div>
              <input type="date" className="settings-input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
            </div>
            <div>
              <div className="label-caps">Time</div>
              <input type="time" className="settings-input" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button className="btn-secondary" onClick={handleSaveDraft} disabled={!content.trim()}
            style={{ padding: '11px 18px', display: 'flex', alignItems: 'center', gap: '7px', opacity: !content.trim() ? 0.4 : 1 }}>
            <FileText size={13} /> Draft
          </button>
          <button className="btn-primary" onClick={handleSchedule} disabled={!content.trim() || isOverLimit || isPosting}
            style={{ flex: 1, opacity: (!content.trim() || isOverLimit || isPosting) ? 0.5 : 1 }}>
            {isPosting ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={13} />}
            {isPosting ? 'Scheduling...' : 'Schedule Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

