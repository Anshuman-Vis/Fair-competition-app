# 🎯 Fair Competition - Online Proctored Exam Platform

A comprehensive web-based platform for conducting fair, monitored online exams with advanced proctoring features.

## Features

✅ **Student Management**
- User registration and authentication
- Roll number tracking
- Session monitoring

✅ **Quiz Module**
- Multiple choice questions
- Timed assessments
- Real-time scoring
- Progress tracking

✅ **Coding Challenges**
- Live code editor
- Multi-language support (Python, JavaScript, C++, Java)
- Code execution environment
- Test case validation

✅ **AI Proctoring**
- Tab switching detection
- Window focus monitoring
- Developer tools blocking
- Copy/paste prevention
- Fullscreen enforcement
- Violation logging
- Auto-disqualification on excessive violations

✅ **Security Features**
- JWT token-based authentication
- Rate limiting
- Session management
- Secure API endpoints
- Violation tracking and reporting

---

## 🚀 Quick Start (One-Click Launch)

### Option 1: Using Docker (Recommended)

**Windows Users:**
```bash
start.bat
```

**Mac/Linux Users:**
```bash
./start.sh
```

**PowerShell (Windows):**
```powershell
.\start.ps1
```

This will automatically:
- Build Docker images
- Start PostgreSQL database
- Start Redis cache
- Start backend server (port 5000)
- Start frontend server (port 3000)

### Option 2: Manual Setup (Without Docker)

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

Backend will be available at: **http://localhost:5000**

#### Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## 📝 Usage

### For Students

1. **Register Account**
   - Navigate to registration page
   - Enter full name, roll number, email, and password
   - Click "Create Account"

2. **Login**
   - Use your email and password
   - Access the dashboard

3. **Take Quiz**
   - Select a quiz from available options
   - Answer all questions
   - Submit quiz
   - View results

4. **Solve Coding Challenge**
   - Select a coding challenge
   - Write code in the editor
   - Run tests
   - Submit solution
   - View results

### Security During Exam

The app enforces several security measures:
- **Tab Switching Blocked**: Switching tabs triggers a violation
- **Copy/Paste Disabled**: Cannot copy or paste content
- **Developer Tools Blocked**: F12 and other dev tools are disabled
- **Fullscreen Required**: Must stay in fullscreen mode
- **Auto-Disqualification**: 3 violations = automatic disqualification

---

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Quiz Management
- `GET /api/quiz/all` - Get all available quizzes
- `GET /api/quiz/<id>/start` - Start a quiz
- `POST /api/quiz/<id>/submit` - Submit quiz answers
- `GET /api/quiz/last-result` - Get last quiz result

### Coding Challenges
- `POST /api/coding/execute` - execute code
- `POST /api/coding/run` - Run with test cases
- `POST /api/coding/submit` - Submit solution

### Proctoring
- `POST /api/proctor/log-violation` - Log a violation

---

## 🏗️ Project Structure

```
fair-competition-app/
├── backend/
│   ├── app/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth & rate limiting
│   │   ├── database/        # DB configuration
│   │   └── utils/           # Helpers
│   ├── main.py              # Entry point
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile           # Backend Docker image
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API client
│   │   └── utils/           # Helpers
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── Dockerfile           # Frontend Docker image
├── docker/
│   └── docker-compose.yml   # Service orchestration
├── start.bat                # Windows launcher
├── start.sh                 # Linux/Mac launcher
├── start.ps1                # PowerShell launcher
└── README.md                # This file
```

---

## 🔧 Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT tokens
- **ORM**: SQLAlchemy

### Frontend
- **Framework**: React 19
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v7

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Rate Limiting**: Flask-Limiter
- **Database Migration**: Flask-Migrate

---

## 🔐 Security Considerations

1. **Authentication**: Use strong passwords
2. **HTTPS**: Deploy with SSL/TLS in production
3. **Database**: Secure PostgreSQL with strong credentials
4. **Secrets**: Store API keys and secrets in environment variables
5. **Rate Limiting**: API requests are rate-limited to prevent abuse

---

## 📊 Environment Variables

### Backend (.env in `backend/` folder)
```
FLASK_ENV=development
DATABASE_URL=postgresql://admin:admin123@db:5432/fair_competition
REDIS_URL=redis://redis:6379
SECRET_KEY=your-secret-key-here
```

### Frontend (.env in `frontend/` folder)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=Fair Competition
```

---

## 🐛 Troubleshooting

### Docker Issues
```bash
# Clear all Docker containers and images
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

### Port Already in Use
- Backend (5000): Change in `main.py`
- Frontend (3000): Change in `frontend/vite.config.js`
- Database (5432): Change in `docker-compose.yml`

### Database Connection Error
```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

### Dependencies Not Installed
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

---

## 📱 Browser Compatibility

- **Chrome/Chromium** ✅ (Recommended)
- **Firefox** ✅
- **Safari** ✅
- **Edge** ✅

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Contact project maintainers

---

## 🎓 Educational Use

This platform is designed for educational institutions to conduct fair and secure online assessments. Use responsibly and ensure students are aware of the proctoring measures in place.

---

**Last Updated**: March 2026
