## AI Culinary Chef (Next.js)

Next.js App Router project with serverless API routes that call the Gemini API.

### Directory structure to maintain

Keep the project like this (high-level):

- `src/app/`: App Router pages + layouts
- `src/app/api/`: Serverless API routes
- `src/components/`: React components used by pages
- `src/lib/`: shared utilities (validation, rate limiting, etc.)
- `public/`: static assets

### Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**:

- **`GEMINI_API_KEY`** (required): Gemini API key used by serverless API routes

Locally, copy `.env.example` to `.env.local` and fill in values:

```bash
copy .env.example .env.local
```

### Local development

Install deps and run the dev server:

```bash
npm install
npm run dev
```

### Build commands / output directory (Vercel)

Vercel auto-detects Next.js and uses the correct defaults:

- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: *(leave empty / default)* — Next.js outputs to `.next` and Vercel handles it automatically

### Deploy to Vercel via GitHub

1. Push this folder to a GitHub repository (don’t include `.env.local`; it’s ignored by `.gitignore`).
2. In Vercel, click **Add New → Project**, import the GitHub repo.
3. Add the required env var (`GEMINI_API_KEY`) in Vercel settings.
4. Deploy.

### Notes

- This repo intentionally includes `--webpack` for builds to avoid Turbopack platform issues on some Windows setups. Vercel (Linux) builds are unaffected.
