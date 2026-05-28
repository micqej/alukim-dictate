import { randomBytes } from 'crypto';

// In-memory token store - persists for the lifetime of this serverless instance
const tokens = new Map();

export async function POST(req, res) {
  const { email, lang = 'sk' } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      error: lang === 'sk' ? 'Neplatný email' : 'Invalid email'
    });
  }

  // Generate unique token
  const token = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  // Store token (in production, save to DB)
  tokens.set(token, {
    email,
    createdAt: Date.now(),
    expiresAt,
    downloaded: false
  });

  // Clean up expired tokens periodically
  for (const [key, value] of tokens.entries()) {
    if (value.expiresAt < Date.now()) {
      tokens.delete(key);
    }
  }

  return res.status(200).json({ token });
}
