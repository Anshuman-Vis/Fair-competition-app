#!/bin/bash

# Fair Competition App - One-Click Startup Script
# This script starts both frontend and backend services

echo "🚀 Starting Fair Competition App..."
echo ""
echo "🐳 Building and starting Docker containers..."
echo ""

# Navigate to docker directory and start services
cd "$(dirname "$0")/docker" || exit

# Build and start services
docker-compose up --build

# If docker-compose fails, try the alternative
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Docker not available or error occurred."
    echo ""
    echo "If Docker is not installed, you can start services manually:"
    echo "1. Backend: cd backend && pip install -r requirements.txt && python main.py"
    echo "2. Frontend: cd frontend && npm install && npm run dev"
    exit 1
fi
