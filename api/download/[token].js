import { promises as fs } from 'fs';
import { join } from 'path';

const tokens = new Map(); // Same as generate-token

export async function GET(req, { params }) {
  const { token } = params;

  // Verify token exists and is not expired
  const tokenData = tokens.get(token);
  if (!tokenData || tokenData.expiresAt < Date.now()) {
    return new Response('Token expired or invalid', { status: 401 });
  }

  try {
    // In production, serve from /public/install/AlukimDictate.zip
    // For now, return a redirect to the file
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/install/AlukimDictate.zip',
        'Content-Disposition': 'attachment; filename="AlukimDictate.zip"'
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    return new Response('Download failed', { status: 500 });
  }
}
