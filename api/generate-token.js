import { randomBytes } from 'crypto';

const tokens = new Map(); // In production, use database

export async function POST(req) {
  const { email, lang = 'sk' } = req.body;

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({
      error: lang === 'sk' ? 'Neplatný email' : 'Invalid email'
    }), { status: 400 });
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

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
