<h1 align="center"> Blogify </h1>

<p align="center"><i>Your space to write, express, and inspire.</i></p>

---

## 📝 Introduction

Blogify is a simple and user-friendly platform where anyone can share their thoughts, ideas, and stories. No complicated menus, no messy tools — just a clean and smooth space to write, edit, and publish blogs instantly.

Whether you're a student, developer, writer, or someone who simply loves expressing ideas, Blogify makes blogging feel natural and enjoyable. Create your own account, write what matters to you, explore posts from others, and build your digital voice — all in one place.

---

##  Features

- User signup & login  
- Create, edit & delete blogs  
- Clean and responsive UI  
- Explore blogs from others  
- Personal profile & dashboard
- View others user's profiles
- Real time notification
  
  ---
  ## Side Features
  - Edit profile details (name, email, password, bio, skills/tags, profile picture)
  - View all comments on a particular blog
  - Search posts using keywords from title or content
  - Search users by name or alphabet letters

---
How to test this application on your own system :

REQUIREMENTS

Before starting,make sure you have installed:

- Git
- Python 3.10+
- MongoDB(Local or MongoDB Atlas)
- npm 

---

- First of all, make sure you have Git installed in your system.
Open CMD and paste: git clone https://github.com/yuggoel/BLOGIFY.git.

> STEP 2 -Create Virtual Environment & Install Dependencies
>- python -m venv venv

>-Activate environment:
>- WINDOWS:
> venv\Scripts\activate
>- MAC/LINUX :
>  source venv/bin/activate
>  -Install dependencies : pip install -r requirements.txt

> STEP 3 -Setup MongoDB
> 
> BLOGIFY uses MongoDB as its database along with Motor (async MongoDB driver) in FastAPI.
> 
> 1 -  Install MongoDB Community Server
> 
> Download & install MongoDB (Community Edition):
> https://www.mongodb.com/try/download/community
> 
>During installation:
> 
> - Install MongoDB Server
>- Install MongoDB Tools
>
> 2- Start MongoDB Service
> 
> MongoDB usually starts automatically.
> 
>If not, start it manually:
>
>- WINDOWS : net start MongoDB
>
>- MACS:
>    1. brew tap mongodb/brew
>    2. brew install mongodb-community@6.0
>    3. brew services start mongodb/brew/mongodb-community@6.0
>
> - LINUX: sudo systemctl start mongod
>
> 3 -  Verify MongoDB is running
> run: mongo --version
>
> Or check service status: mongosh
>
> If you see a Mongo shell prompt (>) — you're good
>
> Exit with : exit
>
> 4  -Database creation :
> 
> You do not need to create the database manually.
>
> MongoDB will automatically create the blog_db database when the backend runs and data is  >inserted.
>
> 5 - Configure Environment Variables
>
> Create a .env file in the project root and add:
> MONGODB_URI=mongodb://localhost:27017
> 
> MONGODB_DB=blog_db
> 
>These values allow FastAPI to connect to your local MongoDB instance.
>
> 6 -Start MongoDB Server
>
> Make sure MongoDB service is running on your system.
>
> Windows (MongoDB Compass users):
>
> MongoDB usually starts automatically. If not, start the MongoDB service from Services Panel > or use PowerShell   :    net start MongoDB
>
> 7-Run the FastAPI Server
>
> Inside your backend folder, activate virtual environment and run:
>
> uvicorn main:app --reload
>
> Your API will be live at  :  http://127.0.0.1:8000
>
> Swagger Docs (API testing)  :  http://127.0.0.1:8000/docs
> 
> If you face any error, run: pip install --upgrade pip
>
> and reinstall requirements.

---

EXTERNAL SERVICES/LIBRARIES USED :

>  -Backend – Python FastAPI

- FastAPI (fastapi)
Backend web framework to build REST APIs. Handles routing, request validation, authentication & data processing.

- Uvicorn (uvicorn)
ASGI server used to run the FastAPI backend.

- Pydantic (pydantic)
Used for data validation and defining schema models for requests/responses.

- Motor / PyMongo (motor or pymongo)
MongoDB driver to interact with the database.
motor = async MongoDB client used with FastAPI.


> -DATABASE-MonogoDB
> 
- MongoDB
NoSQL database used to store users, posts, comments and other dynamic data for Blogify.

- MongoDB Compass / Atlas (if used)
  GUI or cloud MongoDB hosting platform for managing the database.
---

> - Concepts Used -
>   
>   BACKEND :

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
  
> -DATABSE (MongoDB)
>

 -  MongoDB — NoSQL Document Database

- ObjectId — MongoDB unique identifier

- Motor (Async MongoDB Driver) — async DB queries

- Update Document (update_one)

- Delete Document (delete_one)

- Database Dependency (get_database)

- MongoDB URI from .env file

---

## Python files created -

- main.py : Entry point of the FastAPI app; starts the server, loads settings, and registers all routes.

- database.py : Creates and manages the MongoDB connection using Motor and provides the async DB instance.

- models.py : Defines Pydantic schemas for validating request data and formatting API responses.

- config.py : Loads environment variables (like MongoDB URL) for secure and centralized configuration.

- routers/ : Directory that organizes API route files by feature.

- routers/posts.py : Contains API routes for creating, reading, updating, and deleting posts.

- routers/auth.py (if added) : Contains authentication routes like user registration and login.

- repositories/ : Directory that holds database logic separate from API code.

- repositories/post_repository.py : Handles MongoDB queries for posts (insert, find, update, delete).

- repositories/user_repository.py (if added) : Handles MongoDB queries for users (create, find, update).

---
## extra files 

- .env : Stores database credentials (not in Python files but part of backend)
-  pyproject.toml : Project dependencies & settings
  ---

##Please note :

- First of all, create your virtual environment and activate it.
Then install required Python dependencies (FastAPI, Motor, Uvicorn, Python-dotenv, Pydantic, etc).
- Create the backend folder structure and files
(main.py, config.py, db.py, models.py, routers/posts.py, repositories/posts.py).
- Create a .env file in the backend folder.
Add MongoDB connection string and env variables (DB name, host, etc).
- Update the config.py file to load environment variables securely using pydantic_settings.
- Update the db.py file to initialize MongoDB client using Motor (async MongoDB driver).
- Update routers/posts.py to define REST API routes for posts
(Create, Read, Update, Delete posts).
- Update repositories/posts.py to define MongoDB CRUD logic for posts.
- Update models.py to define Pydantic schemas for requests & responses
(PostCreate, PostUpdate, PostResponse).
- Run the FastAPI backend using:
uvicorn app.main:app --reload
- Test all endpoints using Postman / Thunder Client (CRUD operations).
- Once backend works, connect it to MongoDB Compass / Atlas and verify documents.



