module.exports = function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  // For MVP: redirect to the ZIP file without token verification
  // TODO: Implement token verification with persistent storage (database)
  return res.redirect(302, '/install/AlukimDictate.zip');
};
