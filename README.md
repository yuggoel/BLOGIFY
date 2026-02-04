# Blogify

<p align="center"><i>Your space to write, express, and inspire.</i></p>

<p align="center">
  <a href="https://blogify-iota-seven.vercel.app/">🌐 Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a>
</p>

---

## 🚀 Live Demo

**Frontend:** https://blogify-iota-seven.vercel.app/  
**Backend API:** https://web-production-97fe.up.railway.app/

---

## 📖 Introduction

Blogify is a modern, full-stack blogging platform where anyone can share their thoughts, ideas, and stories. Built with Next.js and FastAPI, it offers a clean, fast, and responsive experience for writers and readers alike.

Whether you're a student, developer, writer, or someone who simply loves expressing ideas, Blogify makes blogging feel natural and enjoyable. Create your own account, write what matters to you, explore posts from others, and build your digital voice — all in one place.

---

## ✨ Features

### Core Features
- 🔐 User signup & login  
- ✍️ Create, edit & delete blogs with **Markdown support**
- 🎨 Clean and responsive UI (dark mode)
- 📰 Explore blogs from others with pagination
- 👤 Personal profile & dashboard
- 🏷️ Tag-based post organization
- 👥 View other users' profiles

### Additional Features
- Edit profile details (name, bio, profile picture)
- Featured posts section on feed
- Mobile-responsive design
- Real-time form validation

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Markdown** - Markdown rendering

### Backend
- **Python FastAPI** - High-performance web framework
- **Supabase PostgreSQL** - Cloud database (production)
- **MongoDB** - NoSQL database (development)
- **asyncpg** - Async PostgreSQL driver
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **Supabase** - Database hosting

---

## 📋 Prerequisites

Before starting, make sure you have installed:

- Git
- Node.js 18+
- Python 3.10+
- MongoDB (Local or MongoDB Atlas)

---

##  Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yuggoel/BLOGIFY.git
cd BLOGIFY
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Database Setup

#### Option A: Supabase (Recommended for Production)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the schema from `MIGRATION_GUIDE.md`
4. Go to **Settings → Database** and copy the pooler connection string

#### Option B: MongoDB (Local Development)

Download & install MongoDB (Community Edition):
https://www.mongodb.com/try/download/community

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community@6.0

# Linux
sudo systemctl start mongod
```

#### Configure Environment Variables
Create a `.env` file in the project root:
```env
# For Supabase (production)
DB_MODE=supabase
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# For MongoDB (development)
# DB_MODE=mongodb
# MONGODB_URI=mongodb://localhost:27017
# MONGODB_DB=blog_db

# Frontend
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 4. Run the Application

#### Backend
```bash
uvicorn BACKEND.APP.main:app --reload
```
API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:3000

---

##  Quick Start (Run Both Backend & Frontend)

Once you have installed the dependencies for both Backend and Frontend, you can start the entire application with a single script located in the root directory:

- **Windows (Double-click):** Run `start_app.bat`
- **PowerShell:** Run `.\start_app.ps1`

This will automatically:
1. Start the FastAPI Backend server.
2. Start the Next.js Frontend server.
3. Open your default browser to the application.

---

##  API Endpoints

### Authentication
- `POST /users/signup` - User registration
- `POST /users/login` - User login

### Posts
- `GET /posts` - Get all posts (with pagination)
- `GET /posts/count` - Get total post count
- `POST /posts` - Create a new post
- `GET /posts/{id}` - Get a specific post
- `PUT /posts/{id}` - Update a post
- `DELETE /posts/{id}` - Delete a post
- `POST /posts/upload` - Upload an image

### Users
- `GET /users/count` - Get total user count
- `GET /users/{id}` - Get a specific user
- `PUT /users/{id}` - Update user profile
- `DELETE /users/{id}` - Delete user account

---

## 🚀 Deployment

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed deployment instructions.

### Quick Deploy

**Backend (Railway):**
1. Connect GitHub repo to Railway
2. Set environment variables: `DB_MODE`, `DATABASE_URL`
3. Deploy!

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Set `NEXT_PUBLIC_API_URL` to your Railway URL
4. Deploy!

---

##  External Services & Libraries

### Frontend – Next.js

- **Next.js 16** - React framework with App Router and server components
- **React 19** - UI library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **React Markdown** - Render markdown content in posts
- **TypeScript** - Type-safe JavaScript

### Backend – Python FastAPI

- **FastAPI** - High-performance async web framework
- **Uvicorn** - ASGI server for running the application
- **Pydantic** - Data validation and schema models
- **asyncpg** - Async PostgreSQL driver for Supabase
- **Motor** - Async MongoDB driver (development)
- **bcrypt** - Password hashing

### Database

- **Supabase PostgreSQL** (Production) - Cloud-hosted PostgreSQL
- **MongoDB** (Development) - Local NoSQL database

---

##  Concepts Used

### BACKEND

- FastAPI Framework
- Asynchronous Programming (async/await)
- REST API Endpoints (CRUD)
- Routing with APIRouter
- Dependency Injection (Depends)
- Pydantic Models for request & response validation
- Repository Pattern to separate DB logic
- HTTP Methods — GET, POST, PUT, DELETE
- HTTP Status Codes — 200, 201, 404, 204
- Error Handling (HTTPException)
- Query Parameters using Query() (skip, limit)
- Middleware (CORS) for frontend communication
- Environment Variables (.env) for config security
- Modular Project Structure
- Uvicorn Server for running the application

### DATABASE (MongoDB)

- MongoDB — NoSQL Document Database
- ObjectId — MongoDB unique identifier
- Motor (Async MongoDB Driver) — async DB queries
- Update Document (update_one)
- Delete Document (delete_one)
- Database Dependency (get_database)
- MongoDB URI from .env file

---

##  Python files created

- **main.py** : Entry point of the FastAPI app; starts the server, loads settings, and registers all routes.
- **database.py** : Creates and manages the MongoDB connection using Motor and provides the async DB instance.
- **models.py** : Defines Pydantic schemas for validating request data and formatting API responses.
- **config.py** : Loads environment variables (like MongoDB URL) for secure and centralized configuration.
- **routers/** : Directory that organizes API route files by feature.
  - **routers/posts.py** : Contains API routes for creating, reading, updating, and deleting posts.
  - **routers/auth.py** : Contains authentication routes like user registration and login.
- **repositories/** : Directory that holds database logic separate from API code.
  - **repositories/post_repository.py** : Handles MongoDB queries for posts (insert, find, update, delete).
  - **repositories/user_repository.py** : Handles MongoDB queries for users (create, find, update).

---

##  Extra files

- **.env** : Stores database credentials (not in Python files but part of backend)
- **requirements.txt** : Project dependencies
- **.gitignore** : Specifies files and directories to be ignored by Git
- **start_app.bat** : Windows batch script to launch both backend and frontend servers simultaneously.
- **start_app.ps1** : PowerShell script to launch both backend and frontend servers simultaneously.

### Script Source Code (Reference)

If these files are missing, you can recreate them with the following code:

**start_app.bat**
```bat
@echo off
echo Starting Backend...
start "Blogify Backend" cmd /k "uvicorn BACKEND.APP.main:app --reload"

echo Starting Frontend...
cd frontend
start "Blogify Frontend" cmd /k "npm run dev"

echo Waiting for services to start...
timeout /t 5 >nul
start http://localhost:3000

echo Both services are starting in separate windows.
```

**start_app.ps1**
```powershell
# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "uvicorn BACKEND.APP.main:app --reload"

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Open Browser
Write-Host "Waiting for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "Both services are starting in separate windows." -ForegroundColor Cyan
```

---

##  Additional Notes

1. First create your virtual environment and activate it
2. Install required Python dependencies (FastAPI, Motor, Uvicorn, etc.)
3. Set up the backend folder structure and files
4. Create a .env file with MongoDB connection string
5. Run the FastAPI backend using: `uvicorn APP.main:app --reload`
6. Test all endpoints using Postman or Swagger UI
7. Connect to MongoDB Compass/Atlas to verify documents

---
