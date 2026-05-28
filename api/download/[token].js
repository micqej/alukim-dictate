// For MVP: simplified download without token verification
// TODO: In production, verify token from persistent store (database)

export async function GET(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  // For MVP: redirect to the ZIP file
  // Token verification will be implemented when using persistent storage
  return res.redirect(302, '/install/AlukimDictate.zip');
}
