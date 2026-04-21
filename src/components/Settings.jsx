import { useState } from 'react'
import { Save, Zap } from 'lucide-react'

function Toggle({ defaultChecked = true }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <label className="toggle">
      <input type="checkbox" checked={on} onChange={() => setOn(o => !o)} />
      <span className="toggle-slider" />
    </label>
  )
}

const accounts = [
  { id: 'x',         label: 'X (Twitter)',  handle: '@yourhandle',   color: 'var(--platform-x)',        connected: true  },
  { id: 'linkedin',  label: 'LinkedIn',     handle: 'Your Name',      color: 'var(--platform-linkedin)', connected: true  },
  { id: 'instagram', label: 'Instagram',    handle: '@yourhandle',    color: 'var(--platform-instagram)',connected: false },
]

export default function Settings() {
  return (
    <div className="settings-view">
      {/* Brand Voice */}
      <div className="settings-section">
        <div className="settings-section-title">Brand Voice</div>
        <div className="settings-section-desc">
          Claude reads this before writing any content. Keep it sharp.
        </div>

        <div className="settings-field">
          <label className="label-caps">Your Name / Brand Name</label>
          <input className="settings-input" type="text" placeholder="e.g. Ajay · Estride" />
        </div>

        <div className="settings-field">
          <label className="label-caps">Tone of Voice</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Direct, bold, data-driven, no fluff"
          />
        </div>

        <div className="settings-field">
          <label className="label-caps">Target Audience</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Startup founders, B2B marketers, solopreneurs"
          />
        </div>

        <div className="settings-field">
          <label className="label-caps">Restricted Words / Phrases</label>
          <textarea
            className="settings-textarea"
            placeholder="e.g. synergy, leverage, circle back, game-changer, guru"
          />
        </div>

        <button className="btn-primary" style={{ width: 'auto' }}>
          <Save size={14} />
          Save Global Persona
        </button>
      </div>

      {/* Connected Accounts */}
      <div className="settings-section">
        <div className="settings-section-title">Connected Accounts</div>
        <div className="settings-section-desc">
          Manage your Blotato-connected social profiles.
        </div>

        {accounts.map(acc => (
          <div key={acc.id} className="account-row">
            <div className="account-info">
              <div
                className="platform-badge"
                style={{
                  width: 34,
                  height: 34,
                  background: `${acc.color}18`,
                  color: acc.color,
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: 8,
                  border: `1px solid ${acc.color}28`,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {acc.id === 'x' ? 'X' : acc.id === 'linkedin' ? 'in' : acc.id === 'instagram' ? 'IG' : 'TT'}
              </div>
              <div>
                <div className="account-name">{acc.label}</div>
                <div className="account-handle">
                  {acc.connected ? acc.handle : 'Not connected — set up via Blotato'}
                </div>
              </div>
            </div>
            <Toggle defaultChecked={acc.connected} />
          </div>
        ))}
      </div>
    </div>
  )
}
