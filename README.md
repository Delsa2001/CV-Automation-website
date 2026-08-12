# Lumenos Careers Website

Public careers / apply site for Lumenos ATS.

Open roles and CV submissions are proxied to the main ATS app.

## Setup

```bash
npm install
```

Create `.env.local`:

```env
ATS_URL=https://cv-automationdeshancosta.vercel.app
NEXT_PUBLIC_ATS_URL=https://cv-automationdeshancosta.vercel.app
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Import this repo
2. Set `ATS_URL` and `NEXT_PUBLIC_ATS_URL` to your main ATS deployment URL
3. Deploy

`/api/careers` and `/api/apply` are rewritten to the main ATS backend.
