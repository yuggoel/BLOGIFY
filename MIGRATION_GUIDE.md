# Blogify Migration & Deployment Guide

## Part 1: Migrate from MongoDB to Supabase

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings > Database** and copy the connection string
3. It looks like: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

### Step 2: Create Database Tables

Go to **SQL Editor** in Supabase dashboard and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tags TEXT[] DEFAULT '{}',
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Update Environment Variables

Create or update your `.env` file:

```env
# Database Mode: "mongodb" or "supabase"
DB_MODE=supabase

# Supabase (PostgreSQL)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# MongoDB (keep for reference/fallback)
MONGODB_URI=mongodb+srv://...

# Frontend
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Step 4: Install Required Dependencies

```bash
pip install asyncpg
```

Or add to `requirements.txt`:
```
asyncpg==0.29.0
```

### Step 5: Test Locally

```bash
# Start backend
cd BACKEND/APP
uvicorn main:app --reload

# In another terminal, start frontend
cd frontend
npm run dev
```

---

## Part 2: Deploy to Vercel

### Option A: Deploy Frontend Only (Recommended for Start)

This deploys your Next.js frontend to Vercel. You'll need to deploy the backend separately.

#### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your `Blogify-github` repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detected)
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL (see Option B below)
6. Click **Deploy**

### Option B: Deploy Backend (FastAPI)

Vercel doesn't natively support FastAPI. Here are your options:

#### Option B1: Railway (Easiest - $5/mo)

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Set the **Root Directory** to `/` (project root)
5. Add environment variables:
   - `DB_MODE=supabase`
   - `DATABASE_URL=your-supabase-connection-string`
6. Set the **Start Command**: `uvicorn BACKEND.APP.main:app --host 0.0.0.0 --port $PORT`
7. Deploy! You'll get a URL like `https://blogify-production.up.railway.app`

#### Option B2: Render (Free tier available)

1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: Leave empty
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn BACKEND.APP.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (DB_MODE, DATABASE_URL)
6. Deploy!

#### Option B3: Vercel Serverless Functions (Advanced)

Convert FastAPI to serverless. Create `api/index.py`:

```python
from BACKEND.APP.main import app

# For Vercel serverless
handler = app
```

Add `vercel.json` in project root:

```json
{
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

**Note**: This requires restructuring and may have cold start issues.

---

## Part 3: Connect Everything

Once both are deployed:

### 1. Update Vercel Environment Variables

In Vercel dashboard → Your Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app
```

### 2. Configure CORS (Backend)

Update `BACKEND/APP/main.py` to allow your Vercel domain:

```python
origins = [
    "http://localhost:3000",
    "https://your-app.vercel.app",
    "https://your-custom-domain.com"
]
```

### 3. Redeploy

After updating environment variables, redeploy both services.

---

## Quick Checklist

- [ ] Create Supabase project and database tables
- [ ] Update `.env` with `DB_MODE=supabase` and `DATABASE_URL`
- [ ] Push code to GitHub
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Set `NEXT_PUBLIC_API_URL` in Vercel to backend URL
- [ ] Update CORS origins in backend
- [ ] Test everything works!

---

## Troubleshooting

### "CORS error"
- Make sure your Vercel domain is in the `origins` list in `main.py`
- Redeploy the backend

### "Connection refused" 
- Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Make sure the backend is running

### "Database error"
- Verify `DATABASE_URL` is correct
- Check Supabase dashboard for connection issues
- Ensure tables were created properly

### Static files (images) not working
For production, use Supabase Storage or Cloudinary instead of local `static/images`. The local folder won't persist on serverless deployments.
