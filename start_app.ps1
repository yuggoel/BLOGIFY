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
