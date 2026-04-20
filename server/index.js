import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// API Routes
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
