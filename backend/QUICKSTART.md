# Quick Start Guide

## Exact Commands to Run Locally

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create .env file (copy from example)
```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql+asyncpg://postgres:password@db:5432/edunews
REDIS_URL=redis://redis:6379/0
JWT_SECRET=changeme123
ACCESS_TOKEN_EXPIRES_MINUTES=15
REFRESH_TOKEN_EXPIRES_DAYS=7
ALGORITHM=HS256
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
SCRAPE_INTERVAL_MINUTES=15
EOF
```

### 3. Start all services
```bash
make up
# Or: docker-compose up --build
```

### 4. Run migrations (wait for services to be healthy)
```bash
make migrate
# Or: docker-compose exec backend alembic upgrade head
```

### 5. Seed database
```bash
make seed
# Or: docker-compose exec backend python scripts/run_seed.py
```

### 6. Test the API
```bash
# Health check
curl http://localhost:8000/health

# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@local","password":"Test1234"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"Test1234"}'

# Get news
curl http://localhost:8000/api/news
```

## What You'll Have After These Steps

✅ **Signup/Login works** - Admin user created, can authenticate  
✅ **News visible** - Sample articles available at `/api/news`  
✅ **Scraping ready** - Can trigger manually via `/api/admin/scrape` or runs automatically every 15 minutes

## Access Points

- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Default Admin Credentials

- Email: `admin@local`
- Password: `Test1234`

