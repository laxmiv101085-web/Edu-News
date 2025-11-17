# Educational Real-Time News & Notifications Platform (MVP)

A full-stack MVP that automatically ingests exam/scholarship/result notices from trusted sources, summarizes and classifies them with AI, stores them in a database, shows a searchable feed in a Next.js web app (PWA), and sends real-time notifications (web + mobile via FCM).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 14+ (or use Docker)
- Redis 6+ (or use Docker)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   # Edit the .env files with your configuration
   ```

3. **Start infrastructure (PostgreSQL, Redis):**
   ```bash
   docker-compose -f infra/docker-compose.yml up -d postgres redis
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

5. **Seed sample data:**
   ```bash
   npm run seed
   ```

6. **Start all services:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Worker: Background processing

### Environment Variables

#### Backend (`apps/api/.env`)
```env
# Database
DATABASE_URL=postgres://user:password@localhost:5432/educational_news

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI (optional - use mock adapter if not provided)
OPENAI_API_KEY=sk-your-openai-api-key

# Firebase Cloud Messaging
FIREBASE_SERVER_KEY=your-fcm-server-key
FIREBASE_PROJECT_ID=your-firebase-project-id

# Web Push (VAPID)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# API
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

#### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
```

## 📁 Project Structure

```
.
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # Next.js frontend
├── worker/           # Background job processor
├── infra/            # Docker compose, deployment configs
├── scripts/          # Migration and seed scripts
└── README.md
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key tables:

- `users` - User accounts
- `user_devices` - FCM tokens for push notifications
- `alert_rules` - User-defined notification rules
- `sources` - RSS/API/HTML sources to ingest
- `raw_items` - Raw ingested content
- `items` - Processed items with AI summaries
- `notifications` - Notification records

See `apps/api/prisma/schema.prisma` for full schema.

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Feed
- `GET /feed` - Get paginated feed (auth optional)
- `GET /items/:id` - Get item details

### Alert Rules (Authenticated)
- `POST /alert-rules` - Create alert rule
- `GET /alert-rules` - List user's alert rules
- `DELETE /alert-rules/:id` - Delete alert rule

### Sources (Admin)
- `POST /sources` - Add new source
- `GET /sources` - List all sources
- `PUT /sources/:id` - Update source
- `DELETE /sources/:id` - Delete source

### Devices (Authenticated)
- `POST /user/devices/register` - Register FCM token

### Example cURL Commands

**Register:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Feed:**
```bash
curl http://localhost:4000/feed?page=1&limit=10
```

**Create Alert Rule (with auth token):**
```bash
curl -X POST http://localhost:4000/alert-rules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "JEE Notifications",
    "keywords": ["JEE", "Joint Entrance"],
    "examNames": ["JEE Main", "JEE Advanced"],
    "types": ["exam", "scholarship"],
    "locations": ["Uttar Pradesh"]
  }'
```

**Add Source (admin):**
```bash
curl -X POST http://localhost:4000/sources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "name": "JEE Official",
    "url": "https://jeemain.nta.ac.in/rss",
    "sourceType": "rss",
    "trustLevel": 9,
    "pollIntervalMinutes": 60
  }'
```

**Register Device:**
```bash
curl -X POST http://localhost:4000/user/devices/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fcmToken": "your-fcm-token",
    "platform": "web"
  }'
```

## 🤖 AI Processing

The system uses an AI adapter pattern for processing items. By default, a mock adapter is used for local testing.

### Enable OpenAI

1. Set `OPENAI_API_KEY` in `apps/api/.env`
2. The system will automatically use OpenAI adapter when the key is present
3. For local testing without OpenAI, the mock adapter will be used

### AI Adapter Interface

The AI adapter extracts:
- Short summary (≤40 words)
- Long summary (≤150 words)
- Tags
- Entities (exam name, dates, institutions)

## 📱 Adding a New Source

1. **Via Admin Panel:**
   - Login as admin
   - Navigate to Admin → Sources
   - Click "Add Source"
   - Fill in: Name, URL, Type (RSS/API/HTML), Trust Level, Poll Interval

2. **Via API:**
   ```bash
   curl -X POST http://localhost:4000/sources \
     -H "Authorization: Bearer ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"...","url":"...","sourceType":"rss","trustLevel":8}'
   ```

3. **The worker will automatically:**
   - Poll the source at the specified interval
   - Respect robots.txt for HTML sources
   - Ingest and process new items
   - Match against user alert rules

## 🧪 Running Tests

```bash
# Run all tests
npm run test

# Run backend tests only
npm run test:api

# Run frontend tests only
npm run test:web
```

## 🚢 Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend & Worker (Render/GCP)

1. **Render:**
   - Create new Web Service for API
   - Create new Background Worker for worker
   - Set environment variables
   - Deploy from GitHub

2. **GCP:**
   - Use Cloud Run for API
   - Use Cloud Run Jobs for worker
   - See `infra/gcp/` for Terraform examples

### Docker Compose (Production)

```bash
docker-compose -f infra/docker-compose.prod.yml up -d
```

## 📋 Checklist / Next Steps

- [x] **How to run locally:** See "Local Development" section above
- [x] **How to add a new source:** See "Adding a New Source" section
- [x] **How to enable OpenAI:** Set `OPENAI_API_KEY` in `.env`
- [x] **How to run tests:** `npm run test`
- [x] **How to deploy:** See "Deployment" section

## 🔒 Security & Compliance

- Passwords are hashed with bcrypt
- JWT tokens for authentication
- Rate limiting on public APIs
- CORS policy for trusted domains
- Robots.txt respect for scraping
- Data retention policies (configurable)

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Metrics endpoint: `GET /metrics` (Prometheus format)
- Logging via Winston (backend) and console (frontend)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT

