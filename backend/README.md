# EduNews Backend API

FastAPI-based backend for the Educational News Platform with JWT authentication, PostgreSQL, Redis, and Celery for background tasks.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (optional, but recommended)

### Setup & Run

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start all services:**
   ```bash
   make up
   # Or: docker-compose up --build
   ```

4. **Run database migrations:**
   ```bash
   make migrate
   # Or: docker-compose exec backend alembic upgrade head
   ```

5. **Seed database with admin user and sample articles:**
   ```bash
   make seed
   # Or manually via API (see below)
   ```

6. **Access the API:**
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## 📋 Default Credentials

After seeding:
- **Email:** `admin@local`
- **Password:** `Test1234`
- **Role:** Admin

## 🧪 Testing Endpoints

### 1. Health Check
```bash
curl -i http://localhost:8000/health
```

**Expected Response:**
```json
{"status": "ok"}
```

### 2. Signup
```bash
curl -v -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@local","password":"Test1234"}'
```

**Expected Response (201):**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

**Error Response (400) - Email already exists:**
```json
{
  "detail": "Email already registered"
}
```

### 3. Login
```bash
curl -v -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"Test1234"}'
```

**Expected Response (200):**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

**Error Response (401) - Invalid credentials:**
```json
{
  "detail": "Incorrect email or password"
}
```

### 4. Get News (Public)
```bash
curl -v http://localhost:8000/api/news
```

**Expected Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "title": "JEE Main 2024 Registration Opens",
      "content": "...",
      "source_url": "https://...",
      "summary": "...",
      "tags": ["exam", "engineering"],
      "published_at": "2024-01-01T00:00:00",
      "created_at": "2024-01-01T00:00:00"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

**With filters:**
```bash
# Search by query
curl "http://localhost:8000/api/news?q=JEE&page=1&page_size=10"

# Filter by tag
curl "http://localhost:8000/api/news?tag=exam"
```

### 5. Get Single Article
```bash
curl -v http://localhost:8000/api/news/1
```

**Expected Response (200):**
```json
{
  "id": 1,
  "title": "...",
  "content": "...",
  ...
}
```

**Error Response (404):**
```json
{
  "detail": "Article not found"
}
```

### 6. Get Current User Profile (Protected)
```bash
# Replace <access_token> with token from login
curl -v http://localhost:8000/api/users/me \
  -H "Authorization: Bearer <access_token>"
```

**Expected Response (200):**
```json
{
  "id": 1,
  "name": "Admin",
  "email": "admin@local",
  "is_admin": true,
  "created_at": "2024-01-01T00:00:00"
}
```

**Error Response (401) - Missing/invalid token:**
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 7. Refresh Token
```bash
curl -v -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<refresh_token>"}'
```

**Expected Response (200):**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### 8. Admin: Seed Database
```bash
curl -v -X POST http://localhost:8000/api/admin/seed \
  -H "Authorization: Bearer <admin_access_token>"
```

**Expected Response (200):**
```json
{
  "message": "Database seeded successfully"
}
```

**Error Response (403) - Not admin:**
```json
{
  "detail": "Not enough permissions"
}
```

### 9. Admin: Get Statistics
```bash
curl -v http://localhost:8000/api/admin/stats \
  -H "Authorization: Bearer <admin_access_token>"
```

**Expected Response (200):**
```json
{
  "user_count": 1,
  "article_count": 10,
  "last_scrape_time": "2024-01-01T12:00:00"
}
```

### 10. Admin: Trigger Manual Scrape
```bash
curl -v -X POST http://localhost:8000/api/admin/scrape \
  -H "Authorization: Bearer <admin_access_token>"
```

**Expected Response (200):**
```json
{
  "message": "Scraping task started",
  "task_id": "abc123..."
}
```

### 11. Admin: Create Article
```bash
curl -v -X POST http://localhost:8000/api/news \
  -H "Authorization: Bearer <admin_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Article",
    "content": "Article content here...",
    "source_url": "https://example.com/article-1",
    "summary": "Short summary",
    "tags": ["news", "education"],
    "published_at": "2024-01-01T00:00:00"
  }'
```

## 🗄️ Database Models

### Users
- `id` (Integer, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `is_admin` (Boolean)
- `created_at` (DateTime)

### Articles
- `id` (Integer, Primary Key)
- `title` (String)
- `content` (Text)
- `source_url` (String, Unique)
- `summary` (Text, Optional)
- `tags` (Array of Strings)
- `published_at` (DateTime)
- `created_at` (DateTime)

### Scrape Logs
- `id` (Integer, Primary Key)
- `source` (String)
- `scraped_at` (DateTime)
- `status` (String) - 'success', 'failed', 'partial'
- `notes` (Text, Optional)

## 🔧 Configuration

Environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ACCESS_TOKEN_EXPIRES_MINUTES` - Access token expiry (default: 15)
- `REFRESH_TOKEN_EXPIRES_DAYS` - Refresh token expiry (default: 7)
- `CORS_ORIGINS` - Comma-separated list of allowed origins
- `CELERY_BROKER_URL` - Celery broker URL
- `CELERY_RESULT_BACKEND` - Celery result backend URL
- `SCRAPE_INTERVAL_MINUTES` - Automatic scrape interval (default: 15)

## 📦 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── database.py          # DB setup
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── security.py          # JWT & password hashing
│   ├── dependencies.py      # Auth dependencies
│   ├── routers/             # API routes
│   └── tasks/               # Celery tasks
├── alembic/                 # Database migrations
├── scripts/                 # Utility scripts
├── tests/                   # Tests
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## 🧪 Running Tests

```bash
make test
# Or: docker-compose exec backend pytest tests/ -v
```

## 📝 Makefile Commands

- `make build` - Build Docker images
- `make up` - Start all services
- `make down` - Stop all services
- `make migrate` - Run database migrations
- `make seed` - Seed database with sample data
- `make test` - Run tests
- `make clean` - Remove containers and volumes
- `make logs` - View backend logs
- `make worker-logs` - View worker logs

## 🔄 Background Jobs

The Celery worker automatically scrapes news every 15 minutes (configurable via `SCRAPE_INTERVAL_MINUTES`).

To manually trigger scraping:
```bash
curl -X POST http://localhost:8000/api/admin/scrape \
  -H "Authorization: Bearer <admin_token>"
```

## 🐛 Troubleshooting

### Database connection errors
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check DATABASE_URL in `.env` matches docker-compose settings

### Migration errors
- Ensure database is running: `docker-compose up db`
- Run migrations: `make migrate`

### Worker not processing jobs
- Check worker logs: `make worker-logs`
- Ensure Redis is running: `docker-compose ps redis`

## 📚 API Documentation

Interactive API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔒 Security Notes

- Change `JWT_SECRET` in production
- Use strong passwords
- Enable HTTPS in production
- Configure proper CORS origins
- Use environment variables for secrets

## 📄 License

MIT

