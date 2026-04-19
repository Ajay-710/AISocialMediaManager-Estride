export const mockPosts = [
  {
    id: 1,
    platform: 'x',
    date: '2026-04-03',
    time: '09:15',
    status: 'published',
    content: `Spent 3 hours this week building an AI content pipeline.

Result: I now produce 5× more content in 20% of the time.

Here's the exact stack I'm using 🧵`,
    engagement: { likes: 847, reposts: 203, replies: 64 },
  },
  {
    id: 2,
    platform: 'linkedin',
    date: '2026-04-05',
    time: '08:30',
    status: 'published',
    content: `I've been building in public for 90 days. Here's what nobody tells you:

The algorithm doesn't reward consistency — it rewards relevance.

I posted every day for a month and saw zero growth. Then I posted one deeply researched piece and hit 40K impressions.

Lesson: frequency is a trap. Depth is the moat.

What's been your biggest LinkedIn growth lesson?`,
    engagement: { likes: 1243, reposts: 89, replies: 156 },
  },
  {
    id: 3,
    platform: 'instagram',
    date: '2026-04-07',
    time: '18:00',
    status: 'published',
    content: `5 UI design principles I wish I knew 3 years ago ✨

1. White space is not empty space — it's breathing room
2. Color should direct attention, not decorate
3. Every font choice is a personality decision
4. Consistency > creativity in product design
5. The best designs are invisible

Save this for your next project.`,
    engagement: { likes: 2891, reposts: 412, replies: 98 },
  },
  {
    id: 4,
    platform: 'x',
    date: '2026-04-09',
    time: '11:00',
    status: 'published',
    content: `Most founders I talk to are obsessed with building.

The best ones are obsessed with distribution.

Your product is a commodity.
Your audience is the moat.`,
    engagement: { likes: 1102, reposts: 341, replies: 88 },
  },
  {
    id: 5,
    platform: 'linkedin',
    date: '2026-04-12',
    time: '07:45',
    status: 'published',
    content: `Hot take: AI won't replace marketers.

But marketers who use AI will replace those who don't.

I've been using an AI content pipeline for 60 days. My output is up 400%. My quality score (per engagement metrics) is up 60%.

The bottleneck was never creativity — it was execution speed.

Are you using AI in your content workflow yet?`,
    engagement: { likes: 3421, reposts: 267, replies: 312 },
  },
  {
    id: 7,
    platform: 'x',
    date: '2026-04-16',
    time: '14:00',
    status: 'published',
    content: `The content creation flywheel nobody talks about:

1. Record one long-form video
2. AI transcribes + extracts key ideas
3. Auto-generate 10 social posts
4. Schedule across all platforms
5. Repurpose top performers into threads

One piece of content → 3 weeks of posts.

This is the only content strategy you need in 2026.`,
    engagement: { likes: 2210, reposts: 589, replies: 177 },
  },
  {
    id: 8,
    platform: 'x',
    date: '2026-04-19',
    time: '10:30',
    status: 'scheduled',
    content: `Counterintuitive insight from 6 months of daily posting:

Your worst-performing posts teach you more than your best ones.

Best posts = luck + timing + topic alignment
Worst posts = a clear signal about what your audience actually values

Study the misses. The hits are mostly noise.`,
    engagement: null,
  },
  {
    id: 9,
    platform: 'linkedin',
    date: '2026-04-21',
    time: '08:00',
    status: 'scheduled',
    content: `I analyzed 500 LinkedIn posts that went viral in Q1 2026.

The pattern is uncomfortably simple:

→ Contrarian opening line
→ Short sentence rhythm
→ One concrete data point
→ Personal narrative bridge
→ Actionable takeaway
→ Conversation-starting question

Every. Single. Time.

What's your highest-performing post formula?`,
    engagement: null,
  },
  {
    id: 10,
    platform: 'instagram',
    date: '2026-04-23',
    time: '17:00',
    status: 'scheduled',
    content: `The AI tools changing creative work in 2026 🤖

Save this before it gets buried:
• Claude for writing & strategy
• Midjourney for visuals
• Blotato for scheduling
• Descript for video editing
• Perplexity for research

Which ones are you sleeping on?`,
    engagement: null,
  },
  {
    id: 11,
    platform: 'x',
    date: '2026-04-26',
    time: '09:00',
    status: 'draft',
    content: `Nobody warns you about this when you start building in public:

The posts you're most proud of will underperform.
The posts you wrote in 10 minutes will go viral.

The market is always right. Your taste is irrelevant.`,
    engagement: null,
  },
  {
    id: 13,
    platform: 'linkedin',
    date: '2026-04-26',
    time: '11:00',
    status: 'draft',
    content: `The single biggest mistake I made growing my audience from 0 to 10K:

I optimized for impressions instead of trust.

Impressions are rented attention.
Trust is owned distribution.

When I switched my goal from "go viral" to "be the most useful person in the room," everything changed.

What's the metric you wish you'd tracked earlier?`,
    engagement: null,
  },
]

export const PLATFORMS = [
  { id: 'x',         label: 'X',         color: '#1D9BF0' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#3B82F6' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
]
