# EduNews - Educational News App

A premium, real-time educational news aggregator built with Next.js, Firebase, Redis, and TailwindCSS.

## Features

- **Real-time News Feed**: Live updates via Server-Sent Events (SSE).
- **Multi-source Ingestion**: Fetches news from RSS feeds and News APIs.
- **Smart Caching**: Redis caching for high performance.
- **User Accounts**: Firebase Authentication (Google/Email).
- **Personalization**: Save articles and filter by category.
- **Premium UI**: Dark mode, glassmorphism, and smooth animations.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Auth**: Firebase Auth & Firestore
- **Cache**: Redis (Upstash or local)
- **Ingestion**: RSS Parser, NewsAPI

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd apps/web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Copy `.env.example` to `.env.local` and fill in your keys.
    ```bash
    cp .env.example .env.local
    ```

    - **Firebase**: Create a project at [console.firebase.google.com](https://console.firebase.google.com/). Enable Auth (Google/Email) and Firestore. Get config from Project Settings.
    - **Firebase Admin**: Generate a new private key in Project Settings > Service Accounts.
    - **Redis**: Use [Upstash](https://upstash.com/) for a free serverless Redis instance, or run locally.
    - **NewsAPI**: Get a key from [newsapi.org](https://newsapi.org/).

4.  **Run Locally**:
    ```bash
    npm run dev
    ```

## Deployment

### Vercel (Recommended)

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add Environment Variables in Vercel settings.
4.  Deploy.

### Cron Jobs (News Ingestion)

To keep the news fresh, set up a Cron job to call `/api/feeds/ingest`.

- **Vercel Cron**: Add `vercel.json`:
    ```json
    {
      "crons": [
        {
          "path": "/api/feeds/ingest",
          "schedule": "0 * * * *"
        }
      ]
    }
    ```
- **GitHub Actions**: Use a workflow to `curl` the endpoint.

## API Endpoints

- `GET /api/feeds/list`: Get paginated news.
- `GET /api/stream/updates`: SSE endpoint for live updates.
- `POST /api/feeds/ingest`: Trigger manual ingestion (requires `Authorization: Bearer <CRON_SECRET>`).
- `POST /api/auth/verify`: Verify Firebase token.

## License

MIT
