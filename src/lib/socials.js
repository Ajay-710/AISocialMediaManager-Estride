/**
 * Ayrshare Social Media Service
 * Handles multi-platform posting for Estride Marketing OS
 */

const AYRSHARE_API_KEY = import.meta.env.VITE_AYRSHARE_API_KEY;

export const socialService = {
  /**
   * Post content to selected platforms
   * @param {string} postText - The content to share
   * @param {string[]} platforms - Array of platform IDs (e.g., ['facebook', 'twitter', 'linkedin'])
   */
  async postToSocials(postText, platforms) {
    if (!AYRSHARE_API_KEY || AYRSHARE_API_KEY === 'your_ayrshare_key_here') {
      console.warn("Ayrshare API Key missing. Simulating successful post.");
      return { status: "success", simulated: true };
    }

    try {
      const response = await fetch('https://api.ayrshare.com/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AYRSHARE_API_KEY}`
        },
        body: JSON.stringify({
          post: postText,
          platforms: platforms.map(p => p === 'x' ? 'twitter' : p), // Ayrshare uses 'twitter' for X
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Social Posting Error:", error);
      throw error;
    }
  },

  /**
   * Generate a Social Connection Link for the user (Multi-tenant)
   * This is used for the "Connect Socials" button
   */
  async getProfileLink() {
    // In a full multi-tenant app, we would pass a 'profileKey' here.
    // For the free/pro tier start, we can just use the primary account.
    console.log("Generating social login flow via Ayrshare...");
    return "https://app.ayrshare.com/social";
  }
};
