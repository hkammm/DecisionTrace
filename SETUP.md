# Setup Guide for Full-Stack DecisionTrace

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2. Setup MongoDB

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name decisiontrace-mongo mongo:latest
```

**Option B: MongoDB Atlas**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free account
- Create a cluster
- Copy the connection string

### 3. Configure Environment Variables

**Frontend (.env)**
```bash
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env)**
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/decisiontrace
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development
GEMINI_API_KEY=your_api_key_here
```

### 4. Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Add to server/.env

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# App running on http://localhost:5173
```

### 6. Test the App

1. Open http://localhost:5173
2. Click "Register"
3. Create an account
4. Create your first decision
5. Log the outcome after the target date passes

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "createdAt": "date"
}
```

### Decisions Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "title": "string",
  "description": "string",
  "context": "Personal|Career|Business|Study|Other",
  "options": [
    {
      "id": "string",
      "name": "string",
      "pros": ["string"],
      "cons": ["string"]
    }
  ],
  "assumptions": [
    {
      "id": "string",
      "statement": "string",
      "wasCorrect": "boolean"
    }
  ],
  "confidenceLevel": "number (1-10)",
  "targetDecisionDate": "string (ISO date)",
  "createdAt": "date",
  "review": {
    "outcome": "Pending|Success|Partial Success|Failure",
    "whatWentWrong": "string",
    "lessonsLearned": "string",
    "reviewedAt": "string (ISO date)"
  }
}
```

## Production Deployment

### Using Docker Compose

```bash
# Set environment variables
export GEMINI_API_KEY=your_key

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Heroku

**Backend:**
```bash
cd server
heroku login
heroku create your-app-name
heroku addons:create mongolab:sandbox
heroku config:set JWT_SECRET=your_production_secret
heroku config:set GEMINI_API_KEY=your_key
git push heroku main
```

**Frontend:**
Update .env with deployed backend URL, then:
```bash
npm run build
# Deploy to Netlify/Vercel or Heroku
```

### Using AWS / Google Cloud

See detailed deployment guides in documentation.

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI connection string
- Try MongoDB Atlas instead of local

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Backend CORS middleware is configured
- Ensure VITE_API_URL matches backend URL
- Check browser DevTools Network tab

### JWT Token Invalid
```
401 Unauthorized: Invalid token
```
**Solution:**
- Clear browser localStorage
- Logout and login again
- Check JWT_SECRET is same in backend

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti :5000 | xargs kill -9
```

## API Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Decision
```bash
TOKEN=your_jwt_token
curl -X POST http://localhost:5000/api/decisions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Career Change",
    "description":"Switch to startup",
    "context":"Career",
    "options":[{"id":"1","name":"Option A","pros":[],"cons":[]}],
    "assumptions":[],
    "confidenceLevel":7,
    "targetDecisionDate":"2026-03-01"
  }'
```

## Performance Tips

1. **Database Indexing**: Add indexes on userId and targetDecisionDate
2. **Caching**: Implement Redis for user session caching
3. **API Optimization**: Add pagination to decisions list
4. **Frontend**: Code splitting with React.lazy()

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Add rate limiting to API
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for frontend domain
- [ ] Add request logging/monitoring
- [ ] Regular security updates

## Next Steps

1. Deploy backend to Heroku/AWS
2. Deploy frontend to Netlify/Vercel
3. Setup database monitoring
4. Configure CI/CD pipeline
5. Add analytics tracking
6. Implement backup strategy
