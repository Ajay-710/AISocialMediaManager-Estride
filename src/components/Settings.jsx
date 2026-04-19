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
          <label className="settings-label">Your Name / Brand Name</label>
          <input className="settings-input" type="text" placeholder="e.g. Ajay · Estride" />
        </div>

        <div className="settings-field">
          <label className="settings-label">Tone of Voice</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Direct, bold, data-driven, no fluff"
          />
        </div>

        <div className="settings-field">
          <label className="settings-label">Target Audience</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. Startup founders, B2B marketers, solopreneurs"
          />
        </div>

        <div className="settings-field">
          <label className="settings-label">Content Pillars (comma-separated)</label>
          <input
            className="settings-input"
            type="text"
            placeholder="e.g. AI tools, content strategy, building in public, productivity"
          />
        </div>

        <div className="settings-field">
          <label className="settings-label">Restricted Words / Phrases</label>
          <textarea
            className="settings-textarea"
            placeholder="e.g. synergy, leverage, circle back, game-changer, guru"
          />
        </div>

        <button className="settings-save-btn">
          <Save size={14} />
          Save Brand Voice
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

      {/* AI Settings */}
      <div className="settings-section">
        <div className="settings-section-title">AI Generation</div>
        <div className="settings-section-desc">
          Control how Claude generates your content.
        </div>

        <div className="settings-field">
          <label className="settings-label">Default Model</label>
          <select className="settings-input" style={{ cursor: 'pointer' }}>
            <option value="claude-sonnet-4-6">claude-sonnet-4-6 (default)</option>
            <option value="claude-opus-4-7">claude-opus-4-7 (highest quality)</option>
            <option value="claude-haiku-4-5">claude-haiku-4-5 (fastest)</option>
          </select>
        </div>

        <div className="account-row">
          <div className="account-info">
            <Zap size={16} style={{ color: 'var(--status-scheduled)' }} />
            <div>
              <div className="account-name">Auto-generate on transcript import</div>
              <div className="account-handle">Instantly draft posts when a YouTube URL is added</div>
            </div>
          </div>
          <Toggle defaultChecked={true} />
        </div>

        <div className="account-row">
          <div className="account-info">
            <Zap size={16} style={{ color: 'var(--accent-light)' }} />
            <div>
              <div className="account-name">Require approval before scheduling</div>
              <div className="account-handle">Always show a preview before sending to Blotato</div>
            </div>
          </div>
          <Toggle defaultChecked={true} />
        </div>
      </div>
    </div>
  )
}
