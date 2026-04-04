# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health/ || exit 1

# Start the application
CMD ["python", "main.py"]

  db:
    image: postgres:15
    container_name: fair_db
    restart: always
    environment:
      POSTGRES_DB: fair_competition
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - fair_network

  redis:
    image: redis:7
    container_name: fair_redis
    restart: always
    ports:
      - "6379:6379"
    networks:
      - fair_network

  nginx:
    image: nginx:latest
    container_name: fair_nginx
    restart: always
    ports:
      - "80:80"
    depends_on:
      - frontend
      - backend
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - fair_network

volumes:
  postgres_data:

networks:
  fair_network: