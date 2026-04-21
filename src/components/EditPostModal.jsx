import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'

const PLATFORMS = [
  { id: 'x',         label: 'X',         color: '#E7E9EA' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#60A5FA' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
]

const STATUSES = [
  { id: 'draft',     label: 'Draft',     color: '#71717A' },
  { id: 'scheduled', label: 'Scheduled', color: '#F59E0B' },
  { id: 'published', label: 'Published', color: '#10B981' },
]

export default function EditPostModal({ post, onClose, onSave }) {
  const [form, setForm] = useState({
    platform: post.platform || 'x',
    content:  post.content  || '',
    date:     post.date     || '',
    time:     post.time     || '',
    status:   post.status   || 'draft',
  })
  const [isSaving, setIsSaving] = useState(false)

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = async () => {
    setIsSaving(true)
    await onSave({ ...post, ...form })
    setIsSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 540 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.02em' }}>Edit Post</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Update content, platform, or schedule</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Platform */}
          <div>
            <div className="label-caps">Platform</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {PLATFORMS.map(({ id, label, color }) => (
                <button key={id} onClick={() => setForm(p => ({ ...p, platform: id }))} style={{
                  flex: 1, padding: '9px 8px', borderRadius: '10px',
                  fontSize: '12px', fontWeight: '700',
                  background: form.platform === id ? `${color}15` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${form.platform === id ? `${color}32` : 'rgba(255,255,255,0.06)'}`,
                  color: form.platform === id ? color : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <div className="label-caps">Status</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {STATUSES.map(({ id, label, color }) => (
                <button key={id} onClick={() => setForm(p => ({ ...p, status: id }))} style={{
                  flex: 1, padding: '8px', borderRadius: '10px',
                  fontSize: '11px', fontWeight: '700',
                  background: form.status === id ? `${color}15` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${form.status === id ? `${color}30` : 'rgba(255,255,255,0.06)'}`,
                  color: form.status === id ? color : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="label-caps">Content</div>
            <textarea className="settings-textarea" value={form.content} onChange={set('content')} style={{ minHeight: 130 }} />
          </div>

          {/* Date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div className="label-caps">Date</div>
              <input type="date" className="settings-input" value={form.date} onChange={set('date')} />
            </div>
            <div>
              <div className="label-caps">Time</div>
              <input type="time" className="settings-input" value={form.time} onChange={set('time')} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '11px 20px' }}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ flex: 1 }}>
            {isSaving ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={13} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
