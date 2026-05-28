# AlukimDictate Landing & Download

Simple landing page for AlukimDictate macOS app with email-gated downloads.

## Features

- 🎤 Clean, minimal design (one viewport)
- 🌍 Bilingual (SK/EN)
- 📧 Email-gated downloads with unique tokens
- ⚡ Deployed on Vercel
- 📱 Mobile-friendly

## Setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
vercel
```

Then point DNS:
```
dictate.alukim.sk → your-vercel-domain.vercel.app
```

## Structure

- `index.html` - Landing page (client-side)
- `api/generate-token.js` - Token generation endpoint
- `api/download/[token].js` - Download endpoint
- `public/install/AlukimDictate.zip` - App binary
