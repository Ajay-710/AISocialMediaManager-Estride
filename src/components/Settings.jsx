import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Save, Check, Loader2, ExternalLink, AlertCircle, User } from 'lucide-react'
import { storage } from '../lib/storage'
import { socialService } from '../lib/socials'

const PLATFORM_DISPLAY = [
  { id: 'x',         label: 'X (Twitter)', badge: 'X',  color: '#E7E9EA', handleKey: 'handle_x',         placeholder: '@yourhandle'              },
  { id: 'linkedin',  label: 'LinkedIn',    badge: 'in', color: '#60A5FA', handleKey: 'handle_linkedin',  placeholder: 'linkedin.com/in/yourname' },
  { id: 'instagram', label: 'Instagram',   badge: 'IG', color: '#F43F5E', handleKey: 'handle_instagram', placeholder: '@yourhandle'              },
]

function SaveButton({ state, onClick, label = 'Save Changes', minWidth = 160 }) {
  return (
    <button
      className="btn-primary"
      style={{ width: 'auto', minWidth, fontSize: 13 }}
      onClick={onClick}
      disabled={state === 'saving'}
    >
      {state === 'saving' && <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />}
      {state === 'saved'  && <Check size={13} />}
      {state === 'error'  && <AlertCircle size={13} />}
      {state === 'idle'   && <Save size={13} />}
      {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved!' : state === 'error' ? 'Error — retry' : label}
    </button>
  )
}

export default function Settings() {
  const { user } = useUser()

  // ── Profile state (profiles table) ────────────────────────────────────────
  const [profile, setProfile] = useState({
    display_name:     '',
    bio:              '',
    handle_x:         '',
    handle_linkedin:  '',
    handle_instagram: '',
  })
  const [profileSave, setProfileSave] = useState('idle')

  // ── Brand voice state (brand_voice table) ─────────────────────────────────
  const [voice, setVoice] = useState({
    brand_name:       '',
    tone:             '',
    audience:         '',
    restricted_words: '',
  })
  const [voiceSave, setVoiceSave] = useState('idle')

  // ── Ayrshare state ────────────────────────────────────────────────────────
  const [profileKey,    setProfileKey]    = useState(null)
  const [connectState,  setConnectState]  = useState('idle')
  const [connectMsg,    setConnectMsg]    = useState('')

  const [isLoading, setIsLoading] = useState(true)

  // ── Load both tables on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      storage.loadProfile(user.id),
      storage.loadBrandVoice(user.id),
    ]).then(([prof, bv]) => {
      if (prof) {
        setProfile({
          display_name:     prof.display_name     || '',
          bio:              prof.bio              || '',
          handle_x:         prof.handle_x         || '',
          handle_linkedin:  prof.handle_linkedin  || '',
          handle_instagram: prof.handle_instagram || '',
        })
      }
      if (bv) {
        setVoice({
          brand_name:       bv.brand_name       || '',
          tone:             bv.tone             || '',
          audience:         bv.audience         || '',
          restricted_words: bv.restricted_words || '',
        })
        setProfileKey(bv.ayrshare_profile_key || null)
      }
      setIsLoading(false)
    })
  }, [user?.id])

  const setP = key => e => setProfile(prev => ({ ...prev, [key]: e.target.value }))
  const setV = key => e => setVoice(prev => ({ ...prev, [key]: e.target.value }))

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!user?.id || profileSave === 'saving') return
    setProfileSave('saving')
    const ok = await storage.saveProfile(profile, user.id)
    setProfileSave(ok ? 'saved' : 'error')
    if (ok) setTimeout(() => setProfileSave('idle'), 2500)
  }

  // ── Save brand voice ───────────────────────────────────────────────────────
  const handleSaveVoice = async () => {
    if (!user?.id || voiceSave === 'saving') return
    setVoiceSave('saving')
    const ok = await storage.saveBrandVoice(
      { ...voice, ayrshare_profile_key: profileKey },
      user.id
    )
    setVoiceSave(ok ? 'saved' : 'error')
    if (ok) setTimeout(() => setVoiceSave('idle'), 2500)
  }

  // ── Ayrshare connect ───────────────────────────────────────────────────────
  const handleConnect = async () => {
    if (connectState === 'loading') return
    setConnectState('loading')
    setConnectMsg('')
    try {
      const { url, profileKey: newKey, simulated } = await socialService.getConnectLink(profileKey)
      if (newKey && newKey !== profileKey) {
        setProfileKey(newKey)
        await storage.saveBrandVoice({ ...voice, ayrshare_profile_key: newKey }, user.id)
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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', padding: '40px 0' }}>
        <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
        <span style={{ fontSize: 13 }}>Loading your settings…</span>
      </div>
    )
  }

  return (
    <div className="settings-view" style={{ maxWidth: 640 }}>

      {/* ── Your Profile ────────────────────────────────────────── */}
      <div className="settings-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={13} style={{ opacity: 0.45 }} />
          </div>
          <div className="settings-section-title" style={{ marginBottom: 0 }}>Your Profile</div>
        </div>
        <div className="settings-section-desc">
          Your public identity. Social handles are shown in the Connected Accounts section and passed to AI workflows.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="settings-field" style={{ marginBottom: 0 }}>
            <label className="label-caps" style={{ marginTop: 0 }}>Display Name</label>
            <input
              className="settings-input"
              type="text"
              placeholder={user?.fullName || 'Your name'}
              value={profile.display_name}
              onChange={setP('display_name')}
            />
          </div>
          <div className="settings-field" style={{ marginBottom: 0 }}>
            <label className="label-caps" style={{ marginTop: 0 }}>Clerk Account</label>
            <input
              className="settings-input"
              type="text"
              value={user?.primaryEmailAddress?.emailAddress || ''}
              readOnly
              style={{ opacity: 0.45, cursor: 'default' }}
            />
          </div>
        </div>

        <div className="settings-field">
          <label className="label-caps">Bio / Tagline</label>
          <textarea
            className="settings-textarea"
            placeholder="e.g. Founder @ Estride · Building AI-powered marketing tools"
            value={profile.bio}
            onChange={setP('bio')}
            style={{ minHeight: 70 }}
          />
        </div>

        <div className="label-caps" style={{ marginTop: 20, marginBottom: 12 }}>Social Handles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {PLATFORM_DISPLAY.map(({ label, badge, color, handleKey, placeholder }) => (
            <div key={handleKey} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: `${color}12`, border: `1px solid ${color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color,
              }}>
                {badge}
              </div>
              <input
                className="settings-input"
                type="text"
                placeholder={placeholder}
                value={profile[handleKey]}
                onChange={setP(handleKey)}
                style={{ flex: 1 }}
              />
            </div>
          ))}
        </div>

        <SaveButton state={profileSave} onClick={handleSaveProfile} label="Save Profile" />
      </div>

      {/* ── Brand Voice ─────────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Brand Voice</div>
        <div className="settings-section-desc">
          Claude reads this before writing any content. Keep it sharp — vague instructions produce vague copy.
        </div>

        <div className="settings-field">
          <label className="label-caps">Brand Name</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Ajay · Estride"
            value={voice.brand_name}
            onChange={setV('brand_name')}
          />
        </div>

        <div className="settings-field">
          <label className="label-caps">Tone of Voice</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Direct, bold, data-driven, no fluff"
            value={voice.tone}
            onChange={setV('tone')}
          />
        </div>

        <div className="settings-field">
          <label className="label-caps">Target Audience</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Startup founders, B2B marketers, solopreneurs"
            value={voice.audience}
            onChange={setV('audience')}
          />
        </div>

        <div className="settings-field" style={{ marginBottom: 20 }}>
          <label className="label-caps">Restricted Words / Phrases</label>
          <textarea
            className="settings-textarea"
            placeholder="e.g. synergy, leverage, circle back, game-changer, guru"
            value={voice.restricted_words}
            onChange={setV('restricted_words')}
            style={{ minHeight: 80 }}
          />
        </div>

        <SaveButton state={voiceSave} onClick={handleSaveVoice} label="Save Brand Voice" />
      </div>

      {/* ── Connected Accounts ──────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Connected Accounts</div>
        <div className="settings-section-desc">
          Social accounts are linked via Ayrshare. One click below opens their secure OAuth manager. Your handles above are stored separately in your profile.
        </div>

        {PLATFORM_DISPLAY.map(({ id, label, badge, color, handleKey }) => {
          const handle = profile[handleKey]
          const connected = !!profileKey
          return (
            <div key={id} className="account-row">
              <div className="account-info">
                <div
                  className="platform-badge"
                  style={{ width: 34, height: 34, background: `${color}18`, color, fontSize: 11, fontWeight: 800, borderRadius: 8, border: `1px solid ${color}28` }}
                >
                  {badge}
                </div>
                <div>
                  <div className="account-name">{label}</div>
                  <div className="account-handle">
                    {handle
                      ? <span style={{ color: color, opacity: 0.8 }}>{handle}</span>
                      : connected
                        ? 'Profile linked via Ayrshare'
                        : 'Not connected — click below to link'}
                  </div>
                </div>
              </div>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: connected ? '#10B981' : 'var(--text-muted)',
                boxShadow: connected ? '0 0 6px rgba(16,185,129,0.5)' : 'none',
                flexShrink: 0,
              }} />
            </div>
          )
        })}

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn-primary"
            style={{ width: '100%' }}
            onClick={handleConnect}
            disabled={connectState === 'loading'}
          >
            {connectState === 'loading'
              ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Opening Ayrshare…</>
              : <><ExternalLink size={14} /> {profileKey ? 'Manage Connected Accounts' : 'Connect Accounts via Ayrshare'}</>
            }
          </button>

          {connectMsg && (
            <div style={{
              fontSize: 12, padding: '10px 14px', borderRadius: 10, lineHeight: 1.5,
              background: connectState === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
              border: `1px solid ${connectState === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
              color: connectState === 'error' ? '#F87171' : '#86EFAC',
            }}>
              {connectMsg}
            </div>
          )}

          {profileKey && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              Ayrshare key: <code style={{ opacity: 0.45 }}>{profileKey.slice(0, 12)}…</code>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
