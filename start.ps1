# Fair Competition App - PowerShell Startup Script
# Run this script to start both frontend and backend services

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Fair Competition App Launcher" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to docker directory
Push-Location (Join-Path $PSScriptRoot "docker")

# Start Docker Compose
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Yellow
Write-Host ""

docker-compose up --build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ Docker Error" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    
    Write-Host "Docker is not available or an error occurred." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Fallback: Start services manually:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Terminal 1 - Backend:" -ForegroundColor Cyan
    Write-Host "   cd backend"
    Write-Host "   pip install -r requirements.txt"
    Write-Host "   python main.py"
    Write-Host ""
    Write-Host "2. Terminal 2 - Frontend:" -ForegroundColor Cyan
    Write-Host "   cd frontend"
    Write-Host "   npm install"
    Write-Host "   npm run dev"
    Write-Host ""
    
    Pop-Location
    exit 1
}

Pop-Location
