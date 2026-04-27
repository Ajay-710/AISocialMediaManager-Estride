import { useState } from 'react'
import { X, Sparkles, Send, FileText, Loader2, Youtube, PenLine, Lightbulb } from 'lucide-react'
import { socialService } from '../lib/socials'
import { FadeInStagger, MagneticWrapper } from './GsapComponents'

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
  const [selectedPlatform, setSelectedPlatform] = useState('x')
  const [youtubeUrl, setYoutubeUrl]             = useState('')
  const [topic, setTopic]                       = useState('')
  const [content, setContent]                   = useState('')
  const [scheduleDate, setScheduleDate]         = useState(today)
  const [scheduleTime, setScheduleTime]         = useState('09:00')
  const [isGenerating, setIsGenerating]         = useState(false)
  const [isPosting, setIsPosting]               = useState(false)

  const charLimit   = selectedPlatform === 'x' ? 280 : selectedPlatform === 'instagram' ? 2200 : 3000
  const remaining   = charLimit - content.length
  const charPct     = Math.min((content.length / charLimit) * 100, 100)
  const isOverLimit = remaining < 0

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
          platforms:  [selectedPlatform],
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
    platform: selectedPlatform,
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
      await socialService.postToSocials(content, [selectedPlatform])
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
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-content" style={{
        maxWidth: 580, width: '100%',
        padding: '30px 36px', borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(20,20,24,0.98) 0%, rgba(12,12,14,0.99) 100%)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -15px rgba(0,0,0,0.9), 0 0 100px -20px rgba(99,102,241,0.15)'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.03em', color: 'white' }}>New Post</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>AI-generate or write manually</div>
          </div>
          <MagneticWrapper>
            <button onClick={onClose} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <X size={16} />
            </button>
          </MagneticWrapper>
        </div>

        <FadeInStagger staggerDelay={0.07}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Platform selector */}
            <div>
              <div className="label-caps" style={{ letterSpacing: '0.15em', fontSize: '10px' }}>Destination Platform</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {PLATFORMS.map(({ id, label, color }) => (
                  <button key={id} onClick={() => setSelectedPlatform(id)} style={{
                    flex: 1, padding: '12px 0', borderRadius: '14px',
                    fontSize: '13px', fontWeight: '800', letterSpacing: '-0.01em',
                    background: selectedPlatform === id ? `${color}18` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedPlatform === id ? `${color}40` : 'rgba(255,255,255,0.05)'}`,
                    color: selectedPlatform === id ? color : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    boxShadow: selectedPlatform === id ? `0 0 20px -8px ${color}60` : 'none',
                    transform: selectedPlatform === id ? 'translateY(-2px)' : 'none',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedPlatform === id ? color : 'rgba(255,255,255,0.12)', boxShadow: selectedPlatform === id ? `0 0 10px ${color}` : 'none' }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content source tabs */}
            <div>
              <div className="label-caps" style={{ letterSpacing: '0.15em', fontSize: '10px' }}>Creation Mode</div>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '4px', gap: '3px' }}>
                {CONTENT_TYPES.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setContentType(id)} style={{
                    flex: 1, padding: '10px 0', borderRadius: '12px',
                    fontSize: '12px', fontWeight: '700', letterSpacing: '-0.01em',
                    background: contentType === id ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: `1px solid ${contentType === id ? 'rgba(255,255,255,0.05)' : 'transparent'}`,
                    color: contentType === id ? 'white' : 'var(--text-muted)',
                    boxShadow: contentType === id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <Icon size={14} style={{ color: contentType === id ? '#6366F1' : 'inherit' }} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI input */}
            {contentType !== 'manual' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {contentType === 'youtube' ? (
                  <div style={{ position: 'relative' }}>
                    <Youtube size={15} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#EF4444', opacity: 0.9 }} />
                    <input className="settings-input" type="url" placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} style={{ paddingLeft: '42px', fontSize: '14px', borderRadius: '14px' }} />
                  </div>
                ) : (
                  <input className="settings-input" type="text" placeholder="e.g. Why consistency beats talent in content..." value={topic} onChange={e => setTopic(e.target.value)} style={{ fontSize: '14px', borderRadius: '14px' }} />
                )}
                <MagneticWrapper>
                  <button className="btn-secondary" onClick={handleGenerate}
                    disabled={isGenerating || (contentType === 'youtube' ? !youtubeUrl : !topic)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '13px', padding: '12px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8', opacity: (isGenerating || (contentType === 'youtube' ? !youtubeUrl : !topic)) ? 0.45 : 1 }}
                  >
                    {isGenerating ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Sparkles size={15} />}
                    <span style={{ fontWeight: 800 }}>{isGenerating ? 'Synthesizing with Claude...' : 'Generate Magic Flow'}</span>
                  </button>
                </MagneticWrapper>
              </div>
            )}

            {/* Content textarea */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div className="label-caps" style={{ marginBottom: 0, letterSpacing: '0.15em', fontSize: '10px' }}>Compose</div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: isOverLimit ? '#EF4444' : remaining < 50 ? '#F59E0B' : 'rgba(255,255,255,0.2)' }}>
                  {remaining}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <textarea className="settings-textarea" placeholder="Start typing your masterpiece..." value={content} onChange={e => setContent(e.target.value)} style={{ minHeight: 140, paddingBottom: '32px', fontSize: '14px', lineHeight: 1.6, borderRadius: '16px' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '99px' }}>
                  <div style={{ height: '100%', borderRadius: '99px', width: `${charPct}%`, background: isOverLimit ? '#EF4444' : charPct > 85 ? '#F59E0B' : 'linear-gradient(90deg, #6366F1, #8B5CF6)', boxShadow: '0 0 10px rgba(99,102,241,0.3)', transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s' }} />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div className="label-caps" style={{ letterSpacing: '0.15em', fontSize: '10px' }}>Publish Date</div>
                <input type="date" className="settings-input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ fontSize: '13px', borderRadius: '12px' }} />
              </div>
              <div>
                <div className="label-caps" style={{ letterSpacing: '0.15em', fontSize: '10px' }}>Publish Time</div>
                <input type="time" className="settings-input" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={{ fontSize: '13px', borderRadius: '12px' }} />
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <MagneticWrapper>
                <button className="btn-secondary" onClick={handleSaveDraft} disabled={!content.trim()}
                  style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '14px', fontSize: '13px', opacity: !content.trim() ? 0.4 : 1 }}>
                  <FileText size={15} /> <span style={{ fontWeight: 700 }}>Save Draft</span>
                </button>
              </MagneticWrapper>
              
              <MagneticWrapper>
                <button className="btn-primary" onClick={handleSchedule} disabled={!content.trim() || isOverLimit || isPosting}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', fontSize: '13px', opacity: (!content.trim() || isOverLimit || isPosting) ? 0.5 : 1, width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {isPosting ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={15} />}
                    <span style={{ fontWeight: 800 }}>{isPosting ? 'Deploying to Platform...' : 'Schedule & Deploy'}</span>
                  </div>
                </button>
              </MagneticWrapper>
            </div>
            
          </div>
        </FadeInStagger>
      </div>
    </div>
  )
}

