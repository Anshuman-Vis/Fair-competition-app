@echo off
REM Fair Competition App - One-Click Windows Startup
REM This script starts both frontend and backend services

echo.
echo ========================================
echo 🚀 Fair Competition App Launcher
echo ========================================
echo.

REM Change to docker directory
cd /d "%~dp0docker"

REM Start Docker Compose
echo 🐳 Starting Docker containers...
echo.

docker-compose up --build

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo ❌ Docker Error
    echo ========================================
    echo.
    echo Docker is not available or an error occurred.
    echo.
    echo Fallback: Start services manually:
    echo.
    echo 1. Terminal 1 - Backend:
    echo    cd backend
    echo    pip install -r requirements.txt
    echo    python main.py
    echo.
    echo 2. Terminal 2 - Frontend:
    echo    cd frontend
    echo    npm install
    echo    npm run dev
    echo.
    pause
    exit /b 1
)
