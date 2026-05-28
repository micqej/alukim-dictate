const { randomBytes } = require('crypto');

// In-memory token store
const tokens = new Map();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, lang = 'sk' } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      error: lang === 'sk' ? 'Neplatný email' : 'Invalid email'
    });
  }

  try {
    // Generate unique token
    const token = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Store token
    tokens.set(token, {
      email,
      createdAt: Date.now(),
      expiresAt,
      downloaded: false
    });

    // Clean up expired tokens
    for (const [key, value] of tokens.entries()) {
      if (value.expiresAt < Date.now()) {
        tokens.delete(key);
      }
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
};
