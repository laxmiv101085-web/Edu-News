# ⚠️ DATABASE CONNECTION ISSUE

The connection to your Neon PostgreSQL database is failing with authentication error.

## How to Fix:

### Step 1: Get Your Correct Connection String

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Click on "Connection Details" or "Dashboard"
4. Copy the **connection string** (should look like):
   ```
   postgresql://username:password@host.neon.tech:5432/dbname?sslmode=require
   ```

### Step 2: Update the `.env` File

Open `apps/api/.env` and replace the `DATABASE_URL` line with your actual connection string from Neon.

```env
DATABASE_URL=your-actual-connection-string-from-neon

# Server
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# News Sources
NEWS_SOURCES=https://rss.app/feeds/v1.1/_T9BqHCOxe3yTBWnG.json,https://feeds.feedburner.com/ndtvnews-education
```

### Step 3: Test the Connection

```bash

node test-db.js
```

If it says "✅ Connected successfully!", you're good to go!

### Step 4: Start the Server

```bash
cd apps/api
npm run dev
```

## Common Issues:

1. **Password has special characters** - Make sure they're URL-encoded
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - etc.

2. **Wrong database name** - Check the database name in Neon console

3. **Port number** - Should be `5432` for PostgreSQL

## Alternative: Use Neon's Generated String

Neon provides pre-formatted connection strings in multiple formats:
- Look for "Pooled connection" or "Direct connection"
- Copy the Node.js version
- Paste it directly into DATABASE_URL

---

**Once you've updated the `.env` file, let me know and I'll restart the server!**
