# Quick Start Checklist

## ✅ How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start infrastructure:**
   ```bash
   docker-compose -f infra/docker-compose.yml up -d
   ```

3. **Set up environment variables:**
   - Copy `apps/api/.env.example` to `apps/api/.env`
   - Copy `apps/web/.env.example` to `apps/web/.env.local`
   - Update with your configuration

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

   Access:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Worker: Running in background

## ✅ How to Add a New Source

### Via Admin Panel:
1. Login as admin (admin@example.com / admin123)
2. Navigate to Admin → Sources
3. Click "Add Source"
4. Fill in: Name, URL, Type (RSS/API/HTML), Trust Level, Poll Interval
5. Click "Create Source"

### Via API:
```bash
curl -X POST http://localhost:4000/sources \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Source",
    "url": "https://example.com/rss",
    "sourceType": "RSS",
    "trustLevel": 8,
    "pollIntervalMinutes": 60
  }'
```

The worker will automatically poll the source at the specified interval.

## ✅ How to Enable OpenAI

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Add to `apps/api/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the API and worker services
4. The system will automatically use OpenAI adapter when the key is present
5. Without the key, the mock adapter will be used (good for local testing)

## ✅ How to Run Tests

### Backend Tests:
```bash
cd apps/api
npm run test
```

### Frontend Tests:
```bash
cd apps/web
npm run test
```

### All Tests:
```bash
npm run test
```

## ✅ How to Deploy

### Frontend (Vercel):
1. Connect GitHub repo to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` - VAPID public key
3. Deploy automatically on push to main

### Backend & Worker (Render):
1. Create new Web Service for API
2. Create new Background Worker for worker
3. Set environment variables (see README)
4. Deploy from GitHub

### Using Docker:
```bash
docker-compose -f infra/docker-compose.prod.yml up -d
```

## 🔧 Common Issues

### Database Connection Error:
- Ensure PostgreSQL is running: `docker-compose -f infra/docker-compose.yml ps`
- Check `DATABASE_URL` in `.env`

### Redis Connection Error:
- Ensure Redis is running: `docker-compose -f infra/docker-compose.yml ps`
- Check `REDIS_URL` in `.env`

### Worker Not Processing Jobs:
- Check worker logs: `cd worker && npm run dev`
- Ensure Redis is accessible
- Verify queues are created correctly

### OpenAI Not Working:
- Check API key is set correctly
- Verify you have credits in OpenAI account
- Check API logs for errors

## 📝 Next Steps

- [ ] Set up production database
- [ ] Configure Firebase for push notifications
- [ ] Generate VAPID keys for web push
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline
- [ ] Add more sources
- [ ] Customize AI prompts for better extraction

