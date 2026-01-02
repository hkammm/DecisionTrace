# DecisionTrace Full-Stack - Quick Reference Guide

## 🎯 What You Have

A complete full-stack decision-tracking application with:
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT-based user auth with password hashing
- **Database**: MongoDB with user-specific data isolation
- **Deployment**: Docker-ready for cloud deployment

## 🚀 Commands Cheat Sheet

### Installation
```bash
# Install all dependencies
npm install
cd server && npm install && cd ..
```

### Development
```bash
# Terminal 1: Backend (port 5000)
cd server && npm run dev

# Terminal 2: Frontend (port 5173)
npm run dev
```

### Production
```bash
# Build frontend
npm run build

# Build backend (Docker)
docker build -t decisiontrace-backend ./server

# Run with Docker Compose
docker-compose up -d
```

### Cleanup
```bash
# Stop Docker services
docker-compose down

# Remove node_modules
rm -rf node_modules server/node_modules

# Clean MongoDB
docker stop decisiontrace-mongo
docker rm decisiontrace-mongo
```

---

## 🔑 Key Endpoints

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/auth/me` | Get current user |

### Decisions
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/decisions` | List all user decisions |
| POST | `/api/decisions` | Create new decision |
| PUT | `/api/decisions/:id` | Update decision |
| DELETE | `/api/decisions/:id` | Delete decision |
| POST | `/api/decisions/:id/review` | Add review/outcome |

---

## 🔐 How Auth Works

1. **Register**: User → Register Form → Password Hashed → Saved to DB → Token Generated
2. **Login**: User → Login Form → Password Verified → Token Generated → Token Stored
3. **API Calls**: Frontend → Token in Header → Backend Verifies → Returns Data
4. **Logout**: Clear Token from Storage

---

## 📁 Important Files

### Frontend
- `App.tsx` - Main app with auth flow
- `services/storage.ts` - API service layer
- `components/AuthModal.tsx` - Login/register UI

### Backend
- `server/src/server.ts` - Express app entry point
- `server/src/routes/auth.ts` - Authentication endpoints
- `server/src/routes/decisions.ts` - Decision endpoints
- `server/src/models/User.ts` - User schema
- `server/src/models/Decision.ts` - Decision schema

### Config
- `.env` - Frontend config
- `server/.env` - Backend config
- `docker-compose.yml` - Docker setup

---

## 🔧 Configuration Checklist

- [ ] MongoDB running or MongoDB Atlas URL configured
- [ ] `VITE_API_URL` set in `.env` (default: `http://localhost:5000/api`)
- [ ] `MONGODB_URI` set in `server/.env`
- [ ] `JWT_SECRET` set in `server/.env` (production: use strong random string)
- [ ] `GEMINI_API_KEY` set in `server/.env`
- [ ] Node.js 18+ installed
- [ ] Port 5000 and 5173 available

---

## 🐛 Common Issues & Fixes

### "Cannot POST /api/decisions"
**Cause**: Backend not running
**Fix**: Ensure backend is running with `cd server && npm run dev`

### "401 Unauthorized"
**Cause**: Invalid or missing JWT token
**Fix**: Login again, check token is being sent in Authorization header

### "MongoServerError: connect ECONNREFUSED"
**Cause**: MongoDB not running
**Fix**: Start MongoDB with `docker run -d -p 27017:27017 mongo:latest`

### "CORS Error in console"
**Cause**: Frontend URL doesn't match backend expectations
**Fix**: Verify `VITE_API_URL` matches backend address

### "Port 5000 already in use"
**Cause**: Another process using the port
**Fix**: Kill the process or use different port with `PORT=5001 npm run dev`

---

## 📊 Data Flow Diagram

```
User Browser
    ↓
Frontend (React)
    ↓
API Calls with JWT Token
    ↓
Backend (Express)
    ↓
Auth Middleware (Verify JWT)
    ↓
Route Handler
    ↓
Database (MongoDB)
    ↓
Response with Data
```

---

## 🏗️ Project Structure Overview

```
Root (Frontend)
├── components/        # React components
├── services/         # API & business logic
├── types.ts          # TypeScript types
├── App.tsx           # Main app
├── index.tsx         # Entry point
└── package.json      # Frontend config

Server
├── src/
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, CORS, etc
│   └── server.ts     # Express app
├── package.json      # Backend config
└── Dockerfile        # Container config
```

---

## 📚 Documentation Map

| Document | Content |
|----------|---------|
| `IMPLEMENTATION_SUMMARY.md` | Overview of what was added |
| `SETUP.md` | Detailed setup instructions |
| `FULL_STACK_README.md` | Complete documentation |
| `CHECKLIST.md` | Feature checklist & progress |
| `This File` | Quick reference guide |

---

## 🎓 Learning Resources

### Understanding the App
1. Read `IMPLEMENTATION_SUMMARY.md` first
2. Run locally following `SETUP.md`
3. Test API endpoints using cURL examples
4. Read full details in `FULL_STACK_README.md`

### Making Changes
1. Frontend changes: Edit `App.tsx` or components
2. Backend changes: Edit files in `server/src/`
3. Database changes: Modify schemas in `server/src/models/`
4. Both require restart to take effect

### Deploying
1. Choose hosting platform (Heroku/AWS/GCP)
2. Follow deployment section in `FULL_STACK_README.md`
3. Set environment variables in cloud console
4. Deploy using Docker or platform-specific tools

---

## 🚨 Security Reminders

**Development** ✓
- Use default values for JWT_SECRET
- Use local MongoDB
- Allow CORS from any origin

**Production** ⚠️
- Change JWT_SECRET to random 32+ character string
- Use MongoDB Atlas or managed database
- Restrict CORS to frontend domain only
- Use HTTPS/TLS for all connections
- Add rate limiting
- Enable request logging
- Regular security updates

---

## 💰 Cost Estimates (First Year)

| Service | Free Tier | Recommended |
|---------|-----------|-------------|
| MongoDB | 512MB | Atlas Free (0.5GB) |
| Backend Hosting | N/A | Heroku ($7/month) |
| Frontend Hosting | ✓ Vercel/Netlify | Netlify Free |
| API Calls | Gemini: 60 calls/min | Depends on usage |
| **Total** | **Free** | **~$84/year** |

---

## 🎯 Next Steps

1. **Today**: Get it running locally
2. **This Week**: Deploy backend to cloud
3. **Next Week**: Deploy frontend to cloud
4. **Later**: Add features like email verification, sharing, etc.

---

## 📞 Need Help?

1. Check the relevant documentation file
2. Search troubleshooting section in SETUP.md
3. Review error message in browser console
4. Check backend logs: `docker-compose logs -f backend`
5. Test API endpoints manually with cURL

---

**You're all set! Your full-stack app is ready to go.** 🚀
