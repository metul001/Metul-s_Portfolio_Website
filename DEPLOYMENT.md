# Deployment Guide

## Run locally

```bash
npm install
npm run dev
```

## Test production build

```bash
npm run build
```

## Deploy with Vercel

1. Push the project to a GitHub repository.
2. Sign in to Vercel with GitHub.
3. Click **Add New > Project**.
4. Import the repository.
5. Framework preset: **Vite**.
6. Build command: `npm run build`.
7. Output directory: `dist`.
8. Click **Deploy**.

Future pushes to the connected GitHub branch will automatically create new Vercel deployments.
