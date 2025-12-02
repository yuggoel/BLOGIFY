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
