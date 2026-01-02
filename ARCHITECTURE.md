# DecisionTrace Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                                │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      React App (Port 5173)                   │  │
│  │                                                               │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │  │
│  │  │  Components │  │   Services   │  │   State Management│   │  │
│  │  │             │  │              │  │                   │   │  │
│  │  │ - Dashboard │  │ - storage.ts │  │ - React Hooks    │   │  │
│  │  │ - Forms     │  │ - gemini.ts  │  │ - Context API    │   │  │
│  │  │ - Auth      │  │              │  │                   │   │  │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘   │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │        LocalStorage (JWT Token)                      │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↕
                      (HTTP Requests with JWT)
                                ↕
┌─────────────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER (Port 5000)                       │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  Routes & Endpoints                          │  │
│  │                                                               │  │
│  │  ┌─────────────────────┐  ┌──────────────────────────────┐  │  │
│  │  │   Auth Routes       │  │   Decision Routes            │  │  │
│  │  │                     │  │                              │  │  │
│  │  │ POST /register      │  │ GET /decisions               │  │  │
│  │  │ POST /login         │  │ POST /decisions              │  │  │
│  │  │ GET /me             │  │ PUT /decisions/:id           │  │  │
│  │  └─────────────────────┘  │ DELETE /decisions/:id        │  │  │
│  │                            │ POST /decisions/:id/review   │  │  │
│  │                            └──────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                ↓                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            Middleware & Business Logic                       │  │
│  │                                                               │  │
│  │  ┌────────────────┐  ┌─────────────────────┐                │  │
│  │  │ JWT Middleware │  │  Error Handling     │                │  │
│  │  │                │  │                     │                │  │
│  │  │ - Verify token │  │ - Validation        │                │  │
│  │  │ - Extract user │  │ - Error responses   │                │  │
│  │  │ - Attach to req│  │ - Status codes      │                │  │
│  │  └────────────────┘  └─────────────────────┘                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                ↓                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Database Models & Schemas                       │  │
│  │                                                               │  │
│  │  ┌──────────────────┐  ┌────────────────────┐              │  │
│  │  │   User Model     │  │  Decision Model    │              │  │
│  │  │                  │  │                    │              │  │
│  │  │ - id             │  │ - id               │              │  │
│  │  │ - email          │  │ - userId (ref)     │              │  │
│  │  │ - password (hash)│  │ - title            │              │  │
│  │  │ - name           │  │ - context          │              │  │
│  │  │ - createdAt      │  │ - options          │              │  │
│  │  │                  │  │ - assumptions      │              │  │
│  │  │                  │  │ - review (optional)│              │  │
│  │  │                  │  │ - createdAt        │              │  │
│  │  └──────────────────┘  └────────────────────┘              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                ↓                                     │
└─────────────────────────────────────────────────────────────────────┘
                                ↕
                        (Mongoose Driver)
                                ↕
┌─────────────────────────────────────────────────────────────────────┐
│                   MongoDB Database                                   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Collections                               │  │
│  │                                                               │  │
│  │  ┌──────────────────────┐  ┌──────────────────────────────┐ │  │
│  │  │   users              │  │   decisions                  │ │  │
│  │  │   ┌────────────────┐ │  │   ┌──────────────────────┐  │ │  │
│  │  │   │ _id: ObjectId  │ │  │   │ _id: ObjectId        │  │ │  │
│  │  │   │ email: string  │ │  │   │ userId: ObjectId*    │  │ │  │
│  │  │   │ password: hash │ │  │   │ title: string        │  │ │  │
│  │  │   │ name: string   │ │  │   │ context: enum        │  │ │  │
│  │  │   │ createdAt: ts  │ │  │   │ options: array       │  │ │  │
│  │  │   │                │ │  │   │ assumptions: array   │  │ │  │
│  │  │   │ (indexed)      │ │  │   │ review: object       │  │ │  │
│  │  │   └────────────────┘ │  │   │ createdAt: ts        │  │ │  │
│  │  │   ~1MB per doc       │  │   │ (~5KB per doc)       │  │ │  │
│  │  └──────────────────────┘  │   │ (indexed by userId)  │  │ │  │
│  │                            │   └──────────────────────┘  │ │  │
│  │                            └──────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Capacity: Free tier 512MB (enough for ~100k decisions)             │
│  Backup: Daily automated (MongoDB Atlas)                            │
│  Scalability: Horizontal scaling ready                              │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────┐
│ Browser │
└────┬────┘
     │
     ├─→ [Register] → API POST /auth/register
     │                  ↓
     │            Hash password → Save User
     │                  ↓
     │            Generate JWT Token
     │                  ↓
     │            Return token + user info
     │
     ├─→ [Login] → API POST /auth/login
     │              ↓
     │         Verify password
     │              ↓
     │         Generate JWT Token
     │              ↓
     │         Return token + user info
     │
     ├─→ [Store JWT] → LocalStorage
     │
     ├─→ [Create Decision] → API POST /decisions
     │                         + Bearer {token}
     │                          ↓
     │                   Verify JWT middleware
     │                          ↓
     │                   Extract userId from token
     │                          ↓
     │                   Save decision with userId
     │                          ↓
     │                   Return created decision
     │
     ├─→ [Get Decisions] → API GET /decisions
     │                       + Bearer {token}
     │                        ↓
     │                 Verify JWT middleware
     │                        ↓
     │                 Extract userId from token
     │                        ↓
     │                 Query DB: find by userId
     │                        ↓
     │                 Return only user's decisions
     │
     └─→ [Logout] → Clear JWT from LocalStorage
```

## Deployment Architecture

```
LOCAL DEVELOPMENT
┌─────────────────────────────────────────┐
│                                          │
│  Frontend (5173)  ←→  Backend (5000)   │
│                            ↓            │
│                      MongoDB (27017)    │
│                                          │
└─────────────────────────────────────────┘


PRODUCTION DEPLOYMENT (Option 1: Docker Compose)
┌──────────────────────────────────────────────────────┐
│                  Docker Host                          │
│                                                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Frontend   │  │  Backend     │  │  MongoDB     │ │
│  │  Container  │←→│  Container   │←→│  Container   │ │
│  │  (5173)     │  │  (5000)      │  │  (27017)     │ │
│  └─────────────┘  └──────────────┘  └──────────────┘ │
│                                                        │
│  Network: docker-compose-network                     │
└──────────────────────────────────────────────────────┘


PRODUCTION DEPLOYMENT (Option 2: Cloud Services)
┌───────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │  Vercel/Netlify  │      │    Heroku        │           │
│  │  (Frontend)      │      │   (Backend)      │           │
│  │  Static Build    │      │  Node.js Server  │           │
│  │  CDN Deploy      │      │  Auto-scale      │           │
│  └────────┬─────────┘      └────────┬─────────┘           │
│           │                         │                     │
│           └────────────────┬────────┘                     │
│                            ↓                              │
│                  ┌──────────────────────┐                │
│                  │  MongoDB Atlas       │                │
│                  │  (Cloud Database)    │                │
│                  │  Auto-backup         │                │
│                  │  High Availability   │                │
│                  └──────────────────────┘                │
│                                                             │
└───────────────────────────────────────────────────────────┘
```

## Technology Stack

```
FRONTEND
  ├── React 19 (UI Framework)
  ├── TypeScript (Type Safety)
  ├── Vite (Build Tool)
  ├── Recharts (Visualizations)
  └── Tailwind CSS (Styling)

BACKEND
  ├── Node.js 18+ (Runtime)
  ├── Express.js (Web Framework)
  ├── TypeScript (Type Safety)
  ├── bcryptjs (Password Hashing)
  ├── jsonwebtoken (JWT)
  ├── Mongoose (ODM)
  └── CORS (Cross-Origin Support)

DATABASE
  ├── MongoDB (NoSQL Database)
  └── MongoDB Atlas (Cloud)

EXTERNAL APIs
  ├── Google Gemini (AI Insights)
  └── JWT (Authentication)

DEPLOYMENT
  ├── Docker (Containerization)
  ├── Docker Compose (Orchestration)
  ├── Heroku/AWS/GCP (Cloud Hosting)
  └── Vercel/Netlify (Frontend Hosting)
```

## Security Architecture

```
┌──────────────────────────────────────────┐
│           Client-Side Security           │
│                                          │
│  ├─ HTTPS (TLS/SSL)                    │
│  ├─ Secure Token Storage               │
│  ├─ XSS Prevention (React escaping)    │
│  └─ CSRF Token (if needed)             │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│          Network Security (JWT)          │
│                                          │
│  ├─ Bearer Token in Header              │
│  ├─ Token Expiration (7 days)           │
│  └─ Secure Transport                    │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│        Server-Side Security              │
│                                          │
│  ├─ JWT Verification Middleware         │
│  ├─ Password Hashing (bcryptjs)         │
│  ├─ Input Validation                    │
│  ├─ Rate Limiting                       │
│  └─ CORS Configuration                  │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│        Database Security                 │
│                                          │
│  ├─ User Isolation by userId            │
│  ├─ Encrypted Passwords                 │
│  ├─ Indexed Queries for Performance     │
│  ├─ MongoDB Authentication              │
│  └─ Regular Backups                     │
└──────────────────────────────────────────┘
```

## Scaling Capabilities

```
Current Architecture: Horizontal Scalable

┌─────────────────────────────────────┐
│  Load Balancer (Nginx/AWS ELB)      │
└──────────┬──────────────────────────┘
           │
    ┌──────┼──────┬──────┬──────┐
    ↓      ↓      ↓      ↓      ↓
  [BE-1] [BE-2] [BE-3] [BE-4] [BE-N]
  (5000) (5001) (5002) (5003)
    │      │      │      │      │
    └──────┼──────┴──────┴──────┘
           ↓
    ┌─────────────────┐
    │   MongoDB Atlas │  (Shared Database)
    │  (Replication)  │
    └─────────────────┘

Session Affinity: Via JWT (stateless)
Database Connections: Connection pooling
Cache Layer: Can add Redis for sessions
```
