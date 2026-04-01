# ⚡ Fair Competition - Quick Start Guide

Get up and running in 5 minutes!

## 🎯 Easiest Way: One-Click Launch

### Windows
```
1. Double-click: start.bat
2. Wait for services to start (~30 seconds)
3. Open: http://localhost:3000
4. Done! 🎉
```

### Mac/Linux
```bash
chmod +x start.sh
./start.sh
# Wait for services to start
# Open: http://localhost:3000
```

### PowerShell
```powershell
.\start.ps1
# Wait for services to start
# Open: http://localhost:3000
```

## 📝 First Time Setup

### 1. Register an Account
- Go to: http://localhost:3000/register
- Enter:
  - Email: any@email.com
  - Password: any password
  - Roll Number: any number
- Click "Create Account"

### 2. Login
- Click "Back to Login"
- Use your credentials
- Land on Dashboard

### 3. Take a Quiz
- Click any quiz card
- Enable fullscreen (proctoring starts)
- Answer 10 questions
- Click Submit
- View your results!

## 🔑 Key Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Student interface |
| Backend | http://localhost:5000 | API server |
| Database | localhost:5432 | PostgreSQL |
| Cache | localhost:6379 | Redis |

## 🚀 Manual Setup (If Docker Not Available)

### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
# Should show: "Running on http://localhost:5000"
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
# Should show: "http://localhost:3000"
```

## ✅ Verify Everything Works

1. **Check Backend**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status": "ok"}
   ```

2. **Check Frontend**
   - Open http://localhost:3000
   - Should see login page

3. **Test Proctoring**
   - Login
   - Click a quiz
   - Press F12 → Should be blocked
   - Try Ctrl+C → Should be blocked
   - Switch tabs → Should see violation

## 🔓 Stopping Services

### Docker Compose
```bash
# Graceful shutdown
docker-compose down

# Clear all data
docker-compose down -v
```

### Manual Setup
- Backend: Press Ctrl+C in backend terminal
- Frontend: Press Ctrl+C in frontend terminal

## 📱 Test Credentials

Pre-loaded examples (if seed data runs):
```
Email: student1@test.com
Password: password123

Email: student2@test.com
Password: password123
```

Or create your own account during registration.

## 🐛 Quick Fixes

### Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Services Not Starting
```bash
# Full reset
docker-compose down -v
docker-compose up --build
```

### Can't Connect to Backend
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If connection refused, rebuild
docker-compose up --build backend
```

## 🎓 What's Available

✅ Login/Registration
✅ 10+ Sample Quizzes
✅ Real-time Results
✅ Proctoring (4 violation types)
✅ Performance Dashboard
✅ Auto-disqualification (3+ violations)

## 📊 Test Flow

```
1. Register → 2. Login → 3. View Dashboard
    ↓
4. Click Quiz → 5. Enable Fullscreen
    ↓
6. Answer Questions → 7. Submit Quiz
    ↓
8. View Results → 9. Dashboard
    ↓
(Violations recorded if detected)
```

## 🎯 What to Try

1. **Normal Quiz**
   - Take quiz normally
   - Submit
   - Check results

2. **Test Violations**
   - Start quiz
   - Switch tab → Violation logged
   - Press F12 → Dev tools blocked
   - Try copy → Blocked
   - Exit fullscreen → Violation

3. **Auto-Disqualification**
   - Get 3 violations
   - Quiz auto-disqualifies
   - Check violation history

## 📚 Next Steps

1. Read README.md for full documentation
2. Check backend/app/routes/ for API details
3. Explore frontend/src/pages/ for UI components
4. Customize settings in environment files

## ❓ Need Help?

1. Check README.md (full docs)
2. Check docker-compose logs
3. Ensure ports 3000, 5000, 5432, 6379 are free
4. Ensure Docker is running (Windows/Mac)

## 🚀 You're Ready!

**Run one of these:**
```bash
start.bat              # Windows
./start.sh             # Mac/Linux
.\start.ps1            # PowerShell
```

Then open: http://localhost:3000

**That's it! Enjoy! 🎉**
