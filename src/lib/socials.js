/**
 * Social media service — all Ayrshare calls proxy through Express
 * (/api/social/*) so the API key never reaches the browser bundle.
 *
 * Server reads AYRSHARE_API_KEY (no VITE_ prefix) from .env.local.
 * Add it to .env.local:  AYRSHARE_API_KEY=your_key_here
 */

export const socialService = {
  /**
   * Post content to one or more platforms.
   * @param {string} postText
   * @param {string[]} platforms  e.g. ['x', 'linkedin', 'instagram']
   * @param {string|null} profileKey  Ayrshare per-user profile key (multi-tenant)
   */
  async postToSocials(postText, platforms, profileKey = null) {
    const res = await fetch('/api/social/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: postText, platforms, profileKey }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
  },

  /**
   * Get (or create) an Ayrshare social-connect link for this user.
   * Returns { url: string, profileKey: string, simulated?: boolean }.
   * @param {string|null} existingProfileKey  reuse the stored key if available
   */
  async getConnectLink(existingProfileKey = null) {
    const res = await fetch('/api/social/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileKey: existingProfileKey }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
  },
};
