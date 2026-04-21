import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars before anything else reads process.env
dotenv.config({ path: join(__dirname, '../.env.local') });

import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';

const skillsDir = join(__dirname, '../../skills');

const app = express();
app.use(cors());
app.use(express.json());

// ── SQLite (local dev fallback — Supabase is the production store) ──────────
const db = new Database(join(__dirname, 'database.sqlite'));
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY, platform TEXT, date TEXT, time TEXT,
    status TEXT, content TEXT, engagement TEXT
  )
`);

const seedCount = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
if (seedCount === 0) {
  const insert = db.prepare('INSERT INTO posts (id, platform, date, time, status, content, engagement) VALUES (@id, @platform, @date, @time, @status, @content, @engagement)');
  [
    { id: '1', platform: 'x',        date: '2026-04-03', time: '09:15', status: 'published', content: 'Spent 3 hours this week building an AI content pipeline… Here is the exact stack I am using 🧵', engagement: JSON.stringify({ likes: 847, reposts: 203, replies: 64 }) },
    { id: '2', platform: 'linkedin', date: '2026-04-05', time: '08:30', status: 'published', content: 'Frequency is a trap. Depth is the moat.', engagement: JSON.stringify({ likes: 1243, reposts: 89, replies: 156 }) },
  ].forEach(p => insert.run(p));
}

// ── AI Generation ─────────────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  try {
    const { youtubeUrl, platforms } = req.body;
    let brandVoice = '';
    let repurposeSkill = '';

    try {
      brandVoice    = fs.readFileSync(join(skillsDir, 'brand_voice_template.md'),   'utf-8');
      repurposeSkill = fs.readFileSync(join(skillsDir, 'skill_repurpose_youtube.md'), 'utf-8');
    } catch { /* skills dir not readable, continue without */ }

    const webhookUrl = process.env.VITE_N8N_WEBHOOK_URL;
    let generatedContent = '';
    let n8nSuccess = false;

    if (webhookUrl) {
      try {
        const aiRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ youtubeUrl, platforms, instructions: repurposeSkill, brand_voice: brandVoice, timestamp: new Date().toISOString() }),
        });
        if (aiRes.ok) {
          const d = await aiRes.json();
          generatedContent = d.content;
          n8nSuccess = true;
        }
      } catch (err) {
        console.error('N8N webhook failed:', err.message);
      }
    }

    if (!n8nSuccess) {
      generatedContent = `[X — Post 1: Hook]
People think editing is the hardest part of YouTube. Wrong.
The hardest part is distribution.
I just built a system that turns 1 video into 3 weeks of pipeline. 🧵👇

---

[X — Post 2: Tactical]
My exact 4-step Ryan Doser repurposing framework:

1. Ingest via Blotato
2. Inject Brand Voice constraints
3. Generate distinct angle hooks
4. Automate publishing

Stop doing manual data-entry. Your time is worth more.

---

[LinkedIn — Post]
I analyzed 500 viral videos this week.

The one thing they had in common? A bulletproof distribution strategy.
Nobody scales by clicking "Copy Link" and posting it manually everywhere.
You scale by treating your raw video like raw material, and your tools like automated assembly lines.

What's the biggest bottleneck in your team's workflow right now?`;
    }

    res.json({ content: generatedContent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Social Posting Proxy (keeps AYRSHARE_API_KEY server-side) ─────────────────
app.post('/api/social/post', async (req, res) => {
  const { content, platforms, profileKey } = req.body;
  const apiKey = process.env.AYRSHARE_API_KEY;

  if (!apiKey) {
    console.warn('AYRSHARE_API_KEY not set — simulating post.');
    return res.json({ status: 'success', simulated: true });
  }

  try {
    const response = await fetch('https://api.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(profileKey && { 'Profile-Key': profileKey }),
      },
      body: JSON.stringify({
        post: content,
        platforms: platforms.map(p => p === 'x' ? 'twitter' : p),
      }),
    });
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Ayrshare OAuth Connect Link (multi-tenant profile flow) ───────────────────
app.post('/api/social/connect', async (req, res) => {
  const { profileKey: existingKey } = req.body;
  const apiKey = process.env.AYRSHARE_API_KEY;

  if (!apiKey) {
    // No key configured — return Ayrshare's generic login page as a safe fallback
    return res.json({ url: 'https://app.ayrshare.com', simulated: true, profileKey: null });
  }

  try {
    // Step 1: reuse or create a profile for this user
    let profileKey = existingKey;
    if (!profileKey) {
      const profileRes = await fetch('https://api.ayrshare.com/api/profiles/profile', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `estride_user_${Date.now()}` }),
      });
      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.message || 'Profile creation failed');
      profileKey = profileData.profileKey;
    }

    // Step 2: generate the JWT-signed social connect URL
    const jwtRes = await fetch('https://api.ayrshare.com/api/profiles/generateJWT', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'app', profileKey }),
    });
    const jwtData = await jwtRes.json();
    if (!jwtRes.ok) throw new Error(jwtData.message || 'JWT generation failed');

    res.json({ url: jwtData.url, profileKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SQLite CRUD (local dev, mirrors Supabase schema) ─────────────────────────
app.get('/api/posts', (_req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY date DESC, time DESC').all();
    res.json(posts.map(p => ({ ...p, engagement: p.engagement ? JSON.parse(p.engagement) : null })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/posts', (req, res) => {
  try {
    const { platform, date, time, status, content } = req.body;
    const post = { id: Date.now().toString(), platform, date, time, status, content, engagement: null };
    db.prepare('INSERT INTO posts (id,platform,date,time,status,content,engagement) VALUES (@id,@platform,@date,@time,@status,@content,@engagement)').run(post);
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/posts/:id', (req, res) => {
  try {
    const { status, content } = req.body;
    db.prepare('UPDATE posts SET status=@status, content=@content WHERE id=@id').run({ status, content, id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/posts/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM posts WHERE id=@id').run({ id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}`));
