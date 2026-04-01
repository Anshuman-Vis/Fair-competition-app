@echo off
REM Fair Competition App - Windows Launcher
echo.
echo Starting Fair Competition App for Windows...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Start Docker Compose
cd docker
echo Starting services with Docker Compose...
docker-compose up --build

pause
