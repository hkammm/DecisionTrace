# DecisionTrace - Full Stack Application

A comprehensive decision-tracking application with AI insights using React + TypeScript frontend and Node.js/MongoDB backend.

## Architecture

- **Frontend**: React 19 + TypeScript + Vite (located in root)
- **Backend**: Express.js + MongoDB + JWT Authentication (located in `server/` folder)
- **Database**: MongoDB
- **AI Integration**: Google Gemini API

## Project Structure

```
decisiontrace/
├── index.tsx                    # Frontend entry point
├── App.tsx                      # Main app component
├── types.ts                     # Shared TypeScript types
├── services/
│   ├── storage.ts             # Backend API service
│   └── gemini.ts              # AI service
├── components/                  # React components
│   ├── Dashboard.tsx
│   ├── DecisionCard.tsx
│   ├── DecisionForm.tsx
│   ├── Layout.tsx
│   ├── ReviewModal.tsx
│   └── AuthModal.tsx           # NEW: Auth UI
├── server/                      # Backend (NEW)
│   ├── src/
│   │   ├── server.ts           # Express app
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Decision.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── decisions.ts
│   │   └── middleware/
│   │       └── auth.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── .env                        # Frontend config
```

## Features

- **User Authentication**: Register/Login with JWT tokens
- **Decision Management**: Create, read, update, delete decisions
- **Decision Reviews**: Log outcomes and lessons learned
- **AI Insights**: Analyze decision patterns using Gemini API
- **Data Persistence**: MongoDB backend with secure authentication

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Run dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
# MONGODB_URI=your_mongo_connection_string
# JWT_SECRET=your_secret_key
# GEMINI_API_KEY=your_gemini_api_key

# Run dev server
npm run dev
```

Backend runs on `http://localhost:5000`

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add to server/.env as MONGODB_URI

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Decisions
- `GET /api/decisions` - List all user decisions
- `POST /api/decisions` - Create new decision
- `PUT /api/decisions/:id` - Update decision
- `DELETE /api/decisions/:id` - Delete decision
- `POST /api/decisions/:id/review` - Add review to decision

## Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Heroku Deployment

```bash
# Backend
cd server
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongo_url
heroku config:set JWT_SECRET=your_secret
heroku config:set GEMINI_API_KEY=your_key
git push heroku main

# Frontend (update API URL in .env)
npm run build
# Deploy to Netlify/Vercel
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/decisiontrace
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
```

## Development Workflow

### Run both frontend and backend simultaneously

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

Access the app at `http://localhost:5173`

## Key Changes from Original

1. **Authentication System**: Users must register and login before accessing the app
2. **Database Storage**: All decisions stored in MongoDB instead of localStorage
3. **API Service**: Frontend communicates with backend API
4. **Token Management**: JWT tokens for secure API requests
5. **User Isolation**: Each user only sees their own decisions
6. **Scalability**: Backend can handle multiple concurrent users

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- User-specific data isolation
- Input validation on both frontend and backend
- CORS enabled for cross-origin requests

## Troubleshooting

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running
- Check MONGODB_URI in server/.env
- Verify connection string format

**"API request failed"**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Verify JWT token is being sent with requests

**"Login always fails"**
- Verify backend is running
- Check browser console for errors
- Ensure .env variables are set correctly

## Future Enhancements

- [ ] Social sharing of decision insights
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Decision prediction ML model
- [ ] Email notifications
- [ ] Integration with calendar/task apps

## License

MIT
