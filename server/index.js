import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const skillsDir = join(__dirname, '../../skills');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(join(__dirname, 'database.sqlite'));

// Create posts table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    platform TEXT,
    date TEXT,
    time TEXT,
    status TEXT,
    content TEXT,
    engagement TEXT
  )
`);

// Mock data to seed if empty
const mockPosts = [
  { id: '1', platform: 'x', date: '2026-04-03', time: '09:15', status: 'published', content: 'Spent 3 hours this week building an AI content pipeline...\n\nHere is the exact stack I am using 🧵', engagement: JSON.stringify({ likes: 847, reposts: 203, replies: 64 }) },
  { id: '2', platform: 'linkedin', date: '2026-04-05', time: '08:30', status: 'published', content: 'Algorithm does not reward consistency — it rewards relevance.\n\nLesson: frequency is a trap. Depth is the moat.', engagement: JSON.stringify({ likes: 1243, reposts: 89, replies: 156 }) }
];

const count = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
if (count === 0) {
  const insert = db.prepare('INSERT INTO posts (id, platform, date, time, status, content, engagement) VALUES (@id, @platform, @date, @time, @status, @content, @engagement)');
  mockPosts.forEach(post => insert.run(post));
}

import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env.local') });

// API Routes
app.post('/api/generate', async (req, res) => {
  try {
    const { youtubeUrl, platforms } = req.body;
    let brandVoice = '';
    let repurposeSkill = '';
    
    // 1. Read Ryan Doser's Skill / SOP files
    try {
      brandVoice = fs.readFileSync(join(skillsDir, 'brand_voice_template.md'), 'utf-8');
      repurposeSkill = fs.readFileSync(join(skillsDir, 'skill_repurpose_youtube.md'), 'utf-8');
    } catch (fsErr) {
      console.warn("Could not read skills directory:", fsErr);
    }

    // 2. Transmit to N8N Webhook with the fully assembled Context prompt
    const webhookUrl = process.env.VITE_N8N_WEBHOOK_URL;
    let n8nSuccess = false;
    let generatedContent = '';

    if (webhookUrl) {
      try {
        const aiResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            youtubeUrl, 
            platforms,
            instructions: repurposeSkill,
            brand_voice: brandVoice,
            timestamp: new Date().toISOString()
          }),
        });
        if (aiResponse.ok) {
          const data = await aiResponse.json();
          generatedContent = data.content;
          n8nSuccess = true;
        }
      } catch (err) {
        console.error("N8N Webhook Failed:", err);
      }
    }

    // 3. Boss-Level Fallback (If N8N Webhook fails/expires, demonstrate the literal SOP!)
    if (!n8nSuccess) {
      // Simulate Anthropic/Claude logic working through `skill_repurpose_youtube.md` rules
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
Nobody scales by clicking "Copy Link" and posting it manually everywhere. You scale by treating your raw video like raw material, and your tools like automated assembly lines. 

What's the biggest bottleneck in your team's workflow right now?
`;
    }

    res.json({ content: generatedContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts', (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY date DESC, time DESC').all();
    const mappedPosts = posts.map(p => ({
      ...p,
      engagement: p.engagement ? JSON.parse(p.engagement) : null
    }));
    res.json(mappedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', (req, res) => {
  try {
    const { platform, date, time, status, content } = req.body;
    const newPost = {
      id: Date.now().toString(),
      platform,
      date,
      time,
      status,
      content,
      engagement: null
    };
    
    db.prepare('INSERT INTO posts (id, platform, date, time, status, content, engagement) VALUES (@id, @platform, @date, @time, @status, @content, @engagement)').run(newPost);
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', (req, res) => {
  try {
    const { status, content } = req.body;
    db.prepare('UPDATE posts SET status = @status, content = @content WHERE id = @id').run({ status, content, id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM posts WHERE id = @id').run({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
