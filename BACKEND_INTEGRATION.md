# Backend Integration Guide

This guide will help you integrate a new backend from scratch with your cloud PostgreSQL database.

## 🎯 What You Have

- ✅ **Cloud PostgreSQL** (Neon) - Already configured
- ✅ **Cloud Redis** (Upstash) - Already configured
- ✅ **Frontend** - Running on Next.js, ready at `http://localhost:3000`

## 🚀 Quick Start Options

Choose your preferred backend stack:

### Option 1: Node.js + Express (Simplest)

1. **Create backend directory:**
   ```bash
   mkdir apps/api
   cd apps/api
   npm init -y
   ```

2. **Install dependencies:**
   ```bash
   npm install express cors dotenv pg
   npm install -D nodemon typescript @types/node @types/express
   ```

3. **Create `.env` file in `apps/api/`:**
   ```env
   DATABASE_URL=postgresql://your-connection-string
   REDIS_URL=redis://your-redis-url
   PORT=4000
   ```

4. **Create `apps/api/index.js`:**
   ```javascript
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();
   const PORT = process.env.PORT || 4000;

   app.use(cors());
   app.use(express.json());

   // Health check
   app.get('/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date() });
   });

   // Sample feed endpoint
   app.get('/api/feed', (req, res) => {
     res.json({
       items: [],
       total: 0,
       page: 1
     });
   });

   app.listen(PORT, () => {
     console.log(`🚀 API server running on http://localhost:${PORT}`);
   });
   ```

5. **Start server:**
   ```bash
   node index.js
   ```

### Option 2: Node.js + NestJS (Recommended for Scale)

1. **Create NestJS app:**
   ```bash
   cd apps
   npx @nestjs/cli new api
   cd api
   ```

2. **Install Prisma for database:**
   ```bash
   npm install @prisma/client
   npm install -D prisma
   npx prisma init
   ```

3. **Configure Prisma in `apps/api/.env`:**
   ```env
   DATABASE_URL="postgresql://your-neon-connection-string"
   ```

4. **Create schema in `apps/api/prisma/schema.prisma`:**
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model Article {
     id          String   @id @default(uuid())
     title       String
     content     String
     summary     String?
     category    String
     publishedAt DateTime @default(now())
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

5. **Push schema to database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

6. **Start NestJS server:**
   ```bash
   npm run start:dev
   ```

### Option 3: Python + FastAPI

1. **Create backend directory:**
   ```bash
   mkdir apps/api
   cd apps/api
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv
   ```

4. **Create `apps/api/.env`:**
   ```env
   DATABASE_URL=postgresql://your-connection-string
   ```

5. **Create `apps/api/main.py`:**
   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   import os
   from dotenv import load_dotenv

   load_dotenv()
   app = FastAPI()

   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   @app.get("/health")
   def health_check():
       return {"status": "ok"}

   @app.get("/api/feed")
   def get_feed():
       return {"items": [], "total": 0, "page": 1}

   if __name__ == "__main__":
       import uvicorn
       uvicorn.run(app, host="0.0.0.0", port=4000)
   ```

6. **Run server:**
   ```bash
   python main.py
   ```

## 🗄️ Database Schema Suggestions

Based on your frontend needs, here's a recommended schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Articles/News Items table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT,
  summary TEXT,
  category VARCHAR(100),
  source VARCHAR(255),
  author VARCHAR(255),
  image_url TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User saved articles
CREATE TABLE saved_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  article_id UUID REFERENCES articles(id),
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Notifications/Alerts
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints Your Frontend Expects

Implement these endpoints for full frontend functionality:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Feed
- `GET /api/feed` - Get paginated articles
  - Query params: `?page=1&limit=10&category=exam`
- `GET /api/articles/:id` - Get article details

### Saved Items
- `GET /api/saved` - Get user's saved articles
- `POST /api/articles/:id/save` - Save article
- `DELETE /api/articles/:id/save` - Unsave article

### User
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

## 🔧 Update Frontend Configuration

Once your backend is running, update `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Or for production:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 📝 Next Steps

1. ✅ Choose your backend stack (Express/NestJS/FastAPI)
2. ✅ Set up the basic server with health check
3. ✅ Connect to your Neon PostgreSQL database
4. ✅ Create database schema
5. ✅ Implement authentication endpoints
6. ✅ Implement feed/articles endpoints
7. ✅ Test with frontend
8. ✅ Deploy backend to cloud (Render/Railway/Vercel/etc.)

## 🚀 Deployment Options

### Backend Hosting
- **Render.com** - Free tier, auto-deploy from Git
- **Railway.app** - Free tier, excellent DX
- **Vercel** - Serverless functions (for Next.js API routes)
- **Fly.io** - Free tier, good for containers
- **Heroku** - Classic PaaS option

### Database (Already have Neon!)
- ✅ **Neon** - Serverless PostgreSQL (you have this)
- **Supabase** - PostgreSQL + Auth + Storage
- **PlanetScale** - MySQL alternative

### Redis (Already have Upstash!)
- ✅ **Upstash** - Serverless Redis (you have this)
- **Redis Cloud** - Managed Redis

---

**You're all set!** Choose your stack and start building. The frontend is waiting! 🎉
