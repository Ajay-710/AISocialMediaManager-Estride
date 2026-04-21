import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Save, Check, Loader2, ExternalLink, AlertCircle } from 'lucide-react'
import { storage } from '../lib/storage'
import { socialService } from '../lib/socials'

// ── Platform rows ────────────────────────────────────────────────────────────

const PLATFORM_DISPLAY = [
  { id: 'x',         label: 'X (Twitter)', badge: 'X',  color: '#E7E9EA' },
  { id: 'linkedin',  label: 'LinkedIn',    badge: 'in', color: '#60A5FA' },
  { id: 'instagram', label: 'Instagram',   badge: 'IG', color: '#F43F5E' },
]

// ── Main component ───────────────────────────────────────────────────────────

export default function Settings() {
  const { user } = useUser()

  // Brand voice form state
  const [form, setForm] = useState({
    brand_name:       '',
    tone:             '',
    audience:         '',
    restricted_words: '',
  })

  // Persisted Ayrshare profileKey (stored in brand_voice row)
  const [profileKey, setProfileKey] = useState(null)

  // UI states
  const [isLoading,   setIsLoading]   = useState(true)
  const [saveState,   setSaveState]   = useState('idle')   // 'idle' | 'saving' | 'saved' | 'error'
  const [connectState, setConnectState] = useState('idle') // 'idle' | 'loading' | 'done' | 'error'
  const [connectMsg,  setConnectMsg]  = useState('')

  // ── Load from Supabase on mount ────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return
    storage.loadBrandVoice(user.id).then(data => {
      if (data) {
        setForm({
          brand_name:       data.brand_name       || '',
          tone:             data.tone             || '',
          audience:         data.audience         || '',
          restricted_words: data.restricted_words || '',
        })
        setProfileKey(data.ayrshare_profile_key || null)
      }
      setIsLoading(false)
    })
  }, [user?.id])

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  // ── Save brand voice ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user?.id || saveState === 'saving') return
    setSaveState('saving')
    const ok = await storage.saveBrandVoice(
      { ...form, ayrshare_profile_key: profileKey },
      user.id
    )
    setSaveState(ok ? 'saved' : 'error')
    if (ok) setTimeout(() => setSaveState('idle'), 2500)
  }

  // ── Ayrshare OAuth connect ─────────────────────────────────────────────────
  const handleConnect = async () => {
    if (connectState === 'loading') return
    setConnectState('loading')
    setConnectMsg('')
    try {
      const { url, profileKey: newKey, simulated } = await socialService.getConnectLink(profileKey)

      // Persist the new profileKey immediately so posting works after connect
      if (newKey && newKey !== profileKey) {
        setProfileKey(newKey)
        await storage.saveBrandVoice({ ...form, ayrshare_profile_key: newKey }, user.id)
      }

      if (simulated) {
        setConnectMsg('AYRSHARE_API_KEY not set in .env.local — running in simulation mode.')
        setConnectState('done')
        return
      }

      window.open(url, '_blank', 'noopener,noreferrer')
      setConnectMsg('Ayrshare opened in a new tab. Connect your accounts, then return here.')
      setConnectState('done')
    } catch (err) {
      setConnectMsg(`Failed to get connect link: ${err.message}`)
      setConnectState('error')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', padding: '40px 0' }}>
        <Loader2 size={16} className="animate-spin" />
        <span style={{ fontSize: 13 }}>Loading your settings…</span>
      </div>
    )
  }

  return (
    <div className="settings-view" style={{ maxWidth: 640 }}>

      {/* ── Brand Voice ─────────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Brand Voice</div>
        <div className="settings-section-desc">
          Claude reads this before writing any content. Keep it sharp — vague instructions produce vague copy.
        </div>

        <div className="settings-field">
          <label className="label-caps">Your Name / Brand Name</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Ajay · Estride"
            value={form.brand_name}
            onChange={set('brand_name')}
          />
        </div>

        <div className="settings-field">
          <label className="label-caps">Tone of Voice</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Direct, bold, data-driven, no fluff"
            value={form.tone}
            onChange={set('tone')}
          />
        </div>

        <div className="settings-field">
          <label className="label-caps">Target Audience</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Startup founders, B2B marketers, solopreneurs"
            value={form.audience}
            onChange={set('audience')}
          />
        </div>

        <div className="settings-field" style={{ marginBottom: 20 }}>
          <label className="label-caps">Restricted Words / Phrases</label>
          <textarea
            className="settings-textarea"
            placeholder="e.g. synergy, leverage, circle back, game-changer, guru"
            value={form.restricted_words}
            onChange={set('restricted_words')}
            style={{ minHeight: 80 }}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: 'auto', minWidth: 160 }}
          onClick={handleSave}
          disabled={saveState === 'saving'}
        >
          {saveState === 'saving' && <Loader2 size={14} className="animate-spin" />}
          {saveState === 'saved'  && <Check size={14} />}
          {saveState === 'error'  && <AlertCircle size={14} />}
          {saveState === 'idle'   && <Save size={14} />}

          {saveState === 'saving' ? 'Saving…'  :
           saveState === 'saved'  ? 'Saved!'   :
           saveState === 'error'  ? 'Error — retry' :
           'Save Global Persona'}
        </button>
      </div>

      {/* ── Connected Accounts ──────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Connected Accounts</div>
        <div className="settings-section-desc">
          Social accounts are linked via Ayrshare. One click below opens their secure OAuth manager where you can connect X, LinkedIn, and Instagram.
        </div>

        {PLATFORM_DISPLAY.map(({ id, label, badge, color }) => (
          <div key={id} className="account-row">
            <div className="account-info">
              <div
                className="platform-badge"
                style={{
                  width: 34, height: 34,
                  background: `${color}18`,
                  color,
                  fontSize: 11, fontWeight: 800,
                  borderRadius: 8,
                  border: `1px solid ${color}28`,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {badge}
              </div>
              <div>
                <div className="account-name">{label}</div>
                <div className="account-handle" style={{ fontSize: 11 }}>
                  {profileKey
                    ? 'Profile linked — manage connections via Ayrshare'
                    : 'Not connected — click "Connect Accounts" below'}
                </div>
              </div>
            </div>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: profileKey ? 'var(--status-published)' : 'var(--text-muted)',
              boxShadow: profileKey ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
              flexShrink: 0,
            }} />
          </div>
        ))}

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn-primary"
            style={{ width: '100%' }}
            onClick={handleConnect}
            disabled={connectState === 'loading'}
          >
            {connectState === 'loading'
              ? <><Loader2 size={15} className="animate-spin" /> Opening Ayrshare…</>
              : <><ExternalLink size={15} /> {profileKey ? 'Manage Connected Accounts' : 'Connect Accounts via Ayrshare'}</>
            }
          </button>

          {connectMsg && (
            <div style={{
              fontSize: 12,
              padding: '10px 14px',
              borderRadius: 10,
              background: connectState === 'error'
                ? 'rgba(239,68,68,0.08)'
                : 'rgba(34,197,94,0.08)',
              border: `1px solid ${connectState === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
              color: connectState === 'error' ? '#F87171' : '#86EFAC',
              lineHeight: 1.5,
            }}>
              {connectMsg}
            </div>
          )}

          {profileKey && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              Profile key: <code style={{ opacity: 0.5 }}>{profileKey.slice(0, 12)}…</code>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
