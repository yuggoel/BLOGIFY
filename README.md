# Blogify

<p align="center"><i>Your space to write, express, and inspire.</i></p>

---

## 📝 Introduction

Blogify is a simple and user-friendly platform where anyone can share their thoughts, ideas, and stories. No complicated menus, no messy tools — just a clean and smooth space to write, edit, and publish blogs instantly.

Whether you're a student, developer, writer, or someone who simply loves expressing ideas, Blogify makes blogging feel natural and enjoyable. Create your own account, write what matters to you, explore posts from others, and build your digital voice — all in one place.

---

## 🚀 Features

### Core Features
- User signup & login  
- Create, edit & delete blogs  
- Clean and responsive UI  
- Explore blogs from others  
- Personal profile & dashboard
- View other users' profiles
- Real-time notifications

### Additional Features
- Edit profile details (name, email, password, bio, skills/tags, profile picture)
- View all comments on a particular blog
- Search posts using keywords from title or content
- Search users by name or alphabet letters

---

## 🛠️ Tech Stack

### Backend
- **Python FastAPI** - High-performance web framework
- **MongoDB** - NoSQL database for storing users, posts, and comments
- **Motor** - Async MongoDB driver for FastAPI
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server for running the application

---

## 📋 Prerequisites

Before starting, make sure you have installed:

- Git
- Python 3.10+
- MongoDB (Local or MongoDB Atlas)

---

## ⚙️ Installation

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

#### Install MongoDB
Download & install MongoDB (Community Edition):
https://www.mongodb.com/try/download/community

#### Start MongoDB Service
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community@6.0

# Linux
sudo systemctl start mongod
```

#### Configure Environment Variables
Create a `.env` file in the project root and add:
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=blog_db
```

### 4. Run the Backend Server
```bash
cd BACKEND
uvicorn APP.main:app --reload
```

Your API will be live at: http://127.0.0.1:8000

Swagger Docs (API testing): http://127.0.0.1:8000/docs

---

## 🔧 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/{id}` - Get a specific post
- `PUT /api/posts/{id}` - Update a post
- `DELETE /api/posts/{id}` - Delete a post

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get a specific user
- `PUT /api/users/{id}` - Update user profile
- `DELETE /api/users/{id}` - Delete user account

---

## 📚 EXTERNAL SERVICES/LIBRARIES USED

### Backend – Python FastAPI

- **FastAPI (fastapi)** - Backend web framework to build REST APIs. Handles routing, request validation, authentication & data processing.
- **Uvicorn (uvicorn)** - ASGI server used to run the FastAPI backend.
- **Pydantic (pydantic)** - Used for data validation and defining schema models for requests/responses.
- **Motor / PyMongo (motor or pymongo)** - MongoDB driver to interact with the database.
  - motor = async MongoDB client used with FastAPI.

### DATABASE - MongoDB

- **MongoDB** - NoSQL database used to store users, posts, comments and other dynamic data for Blogify.
- **MongoDB Compass / Atlas (if used)** - GUI or cloud MongoDB hosting platform for managing the database.

---

## 💡 Concepts Used

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

## 📄 Python files created

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

## 📎 Extra files

- **.env** : Stores database credentials (not in Python files but part of backend)
- **requirements.txt** : Project dependencies
- **.gitignore** : Specifies files and directories to be ignored by Git

---

## 📝 Additional Notes

1. First create your virtual environment and activate it
2. Install required Python dependencies (FastAPI, Motor, Uvicorn, etc.)
3. Set up the backend folder structure and files
4. Create a .env file with MongoDB connection string
5. Run the FastAPI backend using: `uvicorn APP.main:app --reload`
6. Test all endpoints using Postman or Swagger UI
7. Connect to MongoDB Compass/Atlas to verify documents

---