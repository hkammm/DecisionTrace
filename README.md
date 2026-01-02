# DecisionTrace

> DecisionTrace helps you capture decisions, track assumptions, measure confidence vs. outcomes, and close the loop with concise lessons and optional AI analysis.

## Overview

- What it is: a lightweight decision-journaling app for individuals and teams that records choices, assumptions, options, target dates, and outcomes.
- Problems it solves: surfaces recurring mistakes, tracks assumptions vs. reality, measures confidence calibration, and creates actionable lessons to avoid repeat errors.

## Quick Start

Prerequisites:
- Node.js (16+)
- MongoDB running locally or a connection string

Install dependencies (root):

```bash
npm install
```

Start the frontend (Vite dev server):

```bash
npm run dev
```

Build and start the backend:

```powershell
cd server
npm run build
node dist/server.js
```

Environment variables (.env):

- `VITE_API_URL` – API base URL, e.g. `http://localhost:5000/api`
- `VITE_API_KEY` – (optional) Gemini API key for AI insights

Example `.env` (project root):

```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_API_KEY=your_gemini_api_key_here
```

Open the app at: http://localhost:3000

## Core Workflow

1. Register or log in.
2. Log a decision: title, context, options, assumptions, confidence, and target review date.
3. Wait until the target date. The app surfaces decisions due for review under "Pending Reviews".
4. Complete a review: record actual outcome, mark assumption correctness, and write a short lesson.
5. After 3+ reviews, optionally run AI analysis (Gemini) to surface patterns and biases.

## Key Features & Benefits

- Assumption tracking: record assumptions and whether they were correct.
- Outcome vs. confidence analysis: see if confidence aligns with success.
- Lessons learned: compact, memorable lessons to avoid repeating mistakes.
- AI analysis (optional): uses Gemini to identify patterns, biases, and reflection prompts (requires API key).
- Server-backed storage: persistent, multi-device use via MongoDB and Express backend.

## Troubleshooting

- 500 on `/api/decisions/undefined/review`: frontend sent `undefined` id. Ensure the backend returns `id` (mapped from MongoDB `_id`) and refresh the frontend. Rebuild backend after edits:

```powershell
cd server
npx tsc
node dist/server.js
```

- Gemini API 400 (invalid key): add a valid key to `.env` as `VITE_API_KEY` and refresh the browser. Obtain a key at Google AI Studio.

- Auth `/me` issues (401/500): restart backend and verify JWT is present in localStorage. Restart backend:

```powershell
cd server
npm run build
node dist/server.js
```

- Stale server code after edits: kill node processes and restart (PowerShell):

```powershell
Stop-Process -Name node -Force
cd server
npx tsc
node dist/server.js
```

## Privacy & Security

- Never commit `.env` with production secrets to source control. Use your host's secret management (Docker secrets, cloud env vars).
- Run the production server behind HTTPS and a reverse proxy (Nginx) and restrict CORS to trusted origins.
- Rotate API keys periodically.

## Real-world Use Cases

- Product teams: track feature decisions and learn from launch outcomes.
- Managers: record hiring or promotion decisions to reduce bias.
- Solo professionals: improve career and financial decisions by tracking assumptions and outcomes.
- Researchers/coaches: analyze decision patterns across users (with consent).

## Next Steps & Recommendations

- Add CSV export for audits.
- Implement scheduled reminders for reviews (email or push notifications).
- Add role-based access controls for team dashboards.
- Containerize with Docker and run with a process manager (PM2) or Docker Compose for production.

## Want help?

I can: create a `README.md` (this file), add export/reminder features, or prepare a Docker Compose deployment. Tell me which you'd like next.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1vtMGFOYnOrMPwpI-PGQ3rB29J8RkLCGd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
