# Fair Competition App - PowerShell Launcher

Write-Host ""
Write-Host "Starting Fair Competition App with PowerShell..." -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
$dockerTest = & docker --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Docker found: $dockerTest" -ForegroundColor Green

# Change to docker directory
Set-Location docker
Write-Host "Starting services with Docker Compose..." -ForegroundColor Cyan
docker-compose up --build

