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

// ── Skill helpers ─────────────────────────────────────────────────────────────

function loadSkills() {
  let brandVoice = '';
  let repurposeSkill = '';
  try {
    brandVoice     = fs.readFileSync(join(skillsDir, 'brand_voice_template.md'),    'utf-8');
    repurposeSkill = fs.readFileSync(join(skillsDir, 'skill_repurpose_youtube.md'), 'utf-8');
  } catch (err) {
    console.warn('[skills] Could not load skill files:', err.message);
  }
  return { brandVoice, repurposeSkill };
}

async function fetchYouTubeTranscript(videoUrl) {
  try {
    const { YoutubeTranscript } = await import('youtube-transcript');
    const items = await YoutubeTranscript.fetchTranscript(videoUrl);
    return items.map(i => i.text).join(' ');
  } catch (err) {
    console.warn('[transcript] Fetch failed:', err.message);
    return null;
  }
}

// Builds the Claude system prompt directly from the skill SOP + brand voice file.
function buildYouTubeSystemPrompt(repurposeSkill, brandVoice) {
  return [
    'You are an expert social media content strategist executing a strict skill protocol.',
    '',
    repurposeSkill,
    '',
    brandVoice
      ? `## Brand Voice Reference\n\n${brandVoice}`
      : '## Brand Voice\nTone: Direct, bold, data-driven. No fluff. No corporate buzzwords.\nAudience: Startup founders, B2B marketers, solopreneurs.',
    '',
    'IMPORTANT: Follow the Step-by-Step SOP above exactly. Return all posts in the exact output format specified in Step 5.',
  ].join('\n');
}

function buildYouTubeUserMessage(videoUrl, transcript, platforms) {
  const platformList = (platforms || ['x']).join(', ');
  if (transcript && transcript.length > 100) {
    return [
      `Repurpose the following YouTube video for: ${platformList}`,
      '',
      `Video URL: ${videoUrl}`,
      '',
      '## Transcript',
      transcript,
    ].join('\n');
  }
  // Transcript unavailable — Claude should still produce quality posts based on URL context
  return [
    `Repurpose this YouTube video for: ${platformList}`,
    '',
    `Video URL: ${videoUrl}`,
    '',
    'No transcript was available. Generate high-quality posts following the SOP output format, ',
    'using the video URL as context. Make reasonable inferences about the content type and topic.',
  ].join('\n');
}

function buildTopicSystemPrompt(brandVoice) {
  const voice = brandVoice && brandVoice.length > 200
    ? brandVoice
    : 'Tone: Direct, bold, data-driven. No fluff. Audience: Startup founders, B2B marketers.';
  return [
    'You are an expert social media content strategist writing platform-native posts.',
    '',
    '## Brand Voice',
    voice,
    '',
    '## Output Format',
    'Return posts in this exact format:',
    '',
    '---',
    '',
    '**[X — Post 1: Hook]**',
    '[post text]',
    '',
    '---',
    '',
    '**[X — Post 2: Tactical]**',
    '[post text]',
    '',
    '---',
    '',
    '**[X — Post 3: Quote/Stat]**',
    '[post text]',
    '',
    '---',
    '',
    '**[LinkedIn — Post]**',
    '[post text]',
    '',
    '---',
    '',
    'Rules:',
    '- X posts: under 280 chars. Punchy, no hashtags unless essential.',
    '- LinkedIn: 150–300 words, hook opener, narrative body, close with a discussion question.',
    '- No fabricated statistics.',
    '- No restricted words from the brand voice file.',
  ].join('\n');
}

async function callClaude(systemPrompt, userMessage) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client  = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2048,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userMessage }],
    });
    console.log('[claude] Generated successfully');
    return message.content[0]?.text ?? null;
  } catch (err) {
    console.error('[claude] API error:', err.message);
    return null;
  }
}

async function callN8N(payload) {
  const webhookUrl = process.env.VITE_N8N_WEBHOOK_URL;
  if (!webhookUrl) return null;
  try {
    const res = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`N8N returned ${res.status}`);
    const data = await res.json();
    console.log('[n8n] Generated successfully');
    return data.content ?? null;
  } catch (err) {
    console.error('[n8n] Webhook error:', err.message);
    return null;
  }
}

const YOUTUBE_FALLBACK = `**[X — Post 1: Hook]**
People think editing is the hardest part of YouTube. Wrong.

The hardest part is distribution.

I just built a system that turns 1 video into 3 weeks of content. 🧵

---

**[X — Post 2: Tactical]**
My exact repurposing stack:

1. Record once
2. Transcript → AI extracts key ideas
3. Generate 3 X posts + 1 LinkedIn post
4. Schedule across all platforms

One video. Three weeks of pipeline.

---

**[X — Post 3: Quote/Stat]**
"Your product is a commodity. Your audience is the moat."

Distribution is the only unfair advantage left. Build the system.

---

**[LinkedIn — Post]**
I analyzed what separates creators who plateau from those who scale.

It's not talent. It's not consistency. It's distribution infrastructure.

The best creators treat one long-form video as raw material — not a finished product. They extract, repurpose, and schedule systematically, not manually.

The result? 5× the output with 20% of the effort.

What's the biggest bottleneck in your current content workflow?`;

function buildTopicFallback(topic) {
  return `**[X — Post 1: Hook]**
${topic ? `On ${topic}:\n\n` : ''}The counterintuitive truth nobody shares:

Consistency beats talent. Every time.

---

**[X — Post 2: Tactical]**
3 things that actually move the needle${topic ? ` on ${topic}` : ''}:

1. Show up before you feel ready
2. Prioritise depth over frequency
3. Study your misses — not your hits

---

**[X — Post 3: Quote/Stat]**
"The market is always right. Your taste is irrelevant."

Build what resonates, not what you think should resonate.

---

**[LinkedIn — Post]**
${topic ? `Here's what six months of working on ${topic} taught me:\n\n` : ''}The biggest mistake I see? Optimising for impressions instead of trust.

Impressions are rented attention. Trust is owned distribution.

When I switched my goal from "go viral" to "be the most useful person in the room," everything changed — quality went up, engagement went up, and ironically, reach went up too.

What metric do you wish you'd focused on earlier?`;
}

// ── AI Generation ─────────────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  try {
    const { youtubeUrl, topic, platforms = ['x'] } = req.body;
    const { brandVoice, repurposeSkill } = loadSkills();

    let content = null;

    if (youtubeUrl) {
      // ── YouTube repurpose flow ────────────────────────────────────────────
      console.log('[generate] YouTube mode:', youtubeUrl);
      const transcript  = await fetchYouTubeTranscript(youtubeUrl);
      const systemPrompt = buildYouTubeSystemPrompt(repurposeSkill, brandVoice);
      const userMessage  = buildYouTubeUserMessage(youtubeUrl, transcript, platforms);

      content = await callClaude(systemPrompt, userMessage);

      if (!content) {
        content = await callN8N({
          mode: 'youtube', youtubeUrl, transcript, platforms,
          systemPrompt, userMessage,
        });
      }

      if (!content) content = YOUTUBE_FALLBACK;

    } else if (topic) {
      // ── Topic generation flow ─────────────────────────────────────────────
      console.log('[generate] Topic mode:', topic);
      const systemPrompt = buildTopicSystemPrompt(brandVoice);
      const userMessage  = `Write social posts about this topic for ${platforms.join(', ')}:\n\n${topic}`;

      content = await callClaude(systemPrompt, userMessage);

      if (!content) {
        content = await callN8N({
          mode: 'topic', topic, platforms,
          systemPrompt, userMessage,
        });
      }

      if (!content) content = buildTopicFallback(topic);

    } else {
      return res.status(400).json({ error: 'Provide either youtubeUrl or topic.' });
    }

    res.json({ content });
  } catch (err) {
    console.error('[generate] Unhandled error:', err.message);
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
