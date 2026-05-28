const http = require('http');
const fs = require('fs');
const path = require('path');
const { randomBytes } = require('crypto');
const { URL } = require('url');

// In-memory token storage
const tokens = new Map();

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // API: Generate token
  if (pathname === '/api/generate-token' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email, lang = 'sk' } = JSON.parse(body);

        if (!email || !email.includes('@')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: lang === 'sk' ? 'Neplatný email' : 'Invalid email'
          }));
          return;
        }

        const token = randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

        tokens.set(token, { email, createdAt: Date.now(), expiresAt });

        // Cleanup expired
        for (const [key, val] of tokens.entries()) {
          if (val.expiresAt < Date.now()) tokens.delete(key);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  // API: Download
  if (pathname.startsWith('/api/download/') && req.method === 'GET') {
    const token = pathname.split('/').pop();
    const tokenData = tokens.get(token);

    if (!tokenData || tokenData.expiresAt < Date.now()) {
      res.writeHead(401);
      res.end('Token expired or invalid');
      return;
    }

    const filepath = path.join(__dirname, '../public/install/AlukimDictate.zip');
    if (fs.existsSync(filepath)) {
      res.writeHead(200, { 'Content-Disposition': 'attachment; filename="AlukimDictate.zip"' });
      res.end(fs.readFileSync(filepath));
    } else {
      res.writeHead(404);
      res.end('File not found');
    }
    return;
  }

  // Static files
  let filepath = pathname === '/' ? '/index.html' : pathname;
  filepath = path.join(__dirname, '../public', filepath);

  fs.readFile(filepath, (err, data) => {
    if (err) {
      // Fallback to index.html
      fs.readFile(path.join(__dirname, '../public/index.html'), (err2, data2) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data2);
      });
      return;
    }

    const ext = path.extname(filepath);
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.zip': 'application/zip'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AlukimDictate running on http://localhost:${PORT}`);
});
