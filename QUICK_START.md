# ⚡ Quick Start Guide - Fair Competition App

Get started with Fair Competition in 5 minutes!

## 🎯 One-Click Launch (Easiest)

### Windows
Double-click `start.bat` in the root folder

### Mac/Linux
Run in terminal:
```bash
chmod +x start.sh
./start.sh
```

### PowerShell
```powershell
.\start.ps1
```

That's it! The app will open on:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 🔧 Manual Setup (If Docker Not Available)

### Step 1: Start Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

✅ Backend runs on `http://localhost:5000`

### Step 2: Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend runs on `http://localhost:3000`

---

## 📝 First Login

After the app launches:

### Method 1: Create New Account
1. Go to http://localhost:3000/register
2. Enter your details:
   - Full Name: "John Doe"
   - Roll Number: "12345"
   - Email: "john@example.com"
   - Password: "password123"
3. Click "Create Account"
4. Back to login page, log in with your email/password

### Method 2: Database Seeding (Optional)
Pre-populate test data:
```bash
cd backend
python seed_data.py
# Then use: user@test.com / password123
```

---

## ✅ Verify Everything Works

Visit these URLs:

| URL | Expected |
|-----|----------|
| http://localhost:3000 | Login page |
| http://localhost:3000/register | Registration page |
| http://localhost:3000/dashboard | Dashboard (after login) |
| http://localhost:5000/api/auth/me | User data (with valid token) |

---

## 🐛 Common Issues

### Port 3000 Already in Use
```bash
# Frontend: Edit frontend/vite.config.js line 5
# Change: port: 3000
# To: port: 3001
```

### Port 5000 Already in Use
```bash
# Backend: Edit backend/main.py line 28
# Change: port=port
# To: port=8000
```

### npm install fails
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database errors
```bash
# Restart with fresh database
docker-compose down -v
docker-compose up --build
```

---

## 📱 Test the App

### As a Student:
1. Register an account
2. Login
3. Select a quiz from dashboard
4. Answer questions (while monitoring watches for violations!)
5. Submit and see results

### Security Features in Action:
- Try switching tabs → Violation recorded
- Try opening dev tools (F12) → Blocked
- Try copying text → Blocked
- Exit fullscreen → Violation recorded

---

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check backend folder for API details
- Explore frontend components for customization
- Review security.py in backend/app/utils for anti-cheat logic

---

## 🎓 Demo Credentials (if seeded)

```
Email: user@test.com
Password: password123
Roll: 001
```

---

**That's it! You're ready to go.** 🚀

For more help, see README.md or check docker-compose logs.
