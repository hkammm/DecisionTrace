
# DecisionTrace

DecisionTrace is a modern decision-journaling app designed to help individuals and teams capture, review, and learn from their choices. It tracks assumptions, measures confidence versus outcomes, and helps you close the feedback loop with actionable lessons. Optional AI-powered insights are available for deeper analysis.


## Overview

- **What it is:** A lightweight, full-stack web app for recording decisions, assumptions, options, review dates, and outcomes.
- **Why use it:** Identify recurring mistakes, track how assumptions match reality, measure confidence calibration, and generate lessons to improve future decisions.


## Quick Start

**Prerequisites:**
- Node.js (v16 or newer)
- MongoDB (local or remote)

**Setup:**
1. Install dependencies (from project root):
   ```bash
   npm install
   ```
2. Start the frontend (Vite):
   ```bash
   npm run dev
   ```
3. Build and start the backend:
   ```powershell
   cd server
   npm run build
   node dist/server.js
   ```
4. Configure environment variables in a `.env` file at the project root:
   - `VITE_API_URL` – API base URL (e.g. `http://localhost:5000/api`)
   - `VITE_API_KEY` – (optional) API key for AI-powered analysis

Example `.env`:
```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_API_KEY=your_api_key_here
```

Open the app at: http://localhost:3000


## Core Workflow

1. Register or log in.
2. Log a decision: enter title, context, options, assumptions, confidence, and a review date.
3. When the review date arrives, the app highlights decisions due for review.
4. Complete a review: record the outcome, mark which assumptions were correct, and summarize your lesson.
5. After several reviews, optionally run AI-powered analysis to discover patterns and biases (if enabled).


## Key Features & Benefits

- **Assumption tracking:** Record and later validate your assumptions.
- **Outcome vs. confidence:** See if your confidence matches actual results.
- **Lessons learned:** Capture concise, actionable lessons to improve future decisions.
- **AI-powered analysis (optional):** Get automated insights and pattern recognition (requires API key).
- **Persistent storage:** Secure, multi-device access via MongoDB and Node.js backend.


## Troubleshooting

- **API errors:** If you see a 500 error on `/api/decisions/undefined/review`, check that the backend returns a valid `id` (mapped from MongoDB `_id`). Refresh the frontend and rebuild the backend after code changes:
   ```powershell
   cd server
   npx tsc
   node dist/server.js
   ```
- **AI analysis issues:** If using AI features, ensure your API key is valid and set in `.env` as `VITE_API_KEY`. Refresh the browser after updating.
- **Authentication issues:** For `/me` endpoint errors (401/500), restart the backend and verify your JWT is present in localStorage.
- **Stale server code:** If changes aren't reflected, stop all Node.js processes and restart:
   ```powershell
   Stop-Process -Name node -Force
   cd server
   npx tsc
   node dist/server.js
   ```


## Privacy & Security

- Never commit `.env` files with secrets to version control.
- Use secret management tools for production (Docker secrets, cloud env vars).
- Run the backend behind HTTPS and a reverse proxy (e.g., Nginx). Restrict CORS to trusted origins.
- Rotate API keys regularly.


## Real-world Use Cases

- **Product teams:** Track feature decisions and learn from outcomes.
- **Managers:** Record hiring or promotion decisions to reduce bias.
- **Solo professionals:** Improve personal, career, and financial decisions by tracking assumptions and results.
- **Researchers/coaches:** Analyze decision patterns across users (with consent).


## Next Steps & Recommendations

- Add CSV export for audits.
- Implement scheduled reminders for reviews (email or push notifications).
- Add role-based access controls for team dashboards.
- Containerize with Docker and use a process manager (PM2) or Docker Compose for production.


## Need help or want to contribute?

Open an issue or pull request for feature requests, bug reports, or improvements. For deployment, export, or reminder features, see the roadmap above or reach out for guidance.

---

<div align="center">
<img width="800" alt="DecisionTrace Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
