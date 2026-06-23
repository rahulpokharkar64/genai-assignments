# User Story to Tests

A full-stack app that converts Jira user stories into generated test cases using a Groq LLM backend. The frontend includes Jira connection support, and the backend proxies Jira API requests to avoid browser CORS issues.

## Project structure

- `frontend/` — React + Vite UI
- `backend/` — Express + TypeScript API
- `.env` — root environment variables for backend config

## Prerequisites

- Node.js 18+ installed
- npm 10+ installed
- Internet access for Jira and Groq API requests

## Setup

1. Open a terminal at the repository root.
2. Install dependencies:

```bash
npm install
```

This installs both root workspace dependencies and dependencies in `frontend/` and `backend/`.

## Development

Run the full stack in development mode from the repo root:

```bash
npm run dev
```

This starts both:

- `backend` on `http://localhost:8090`
- `frontend` on `http://localhost:5173`

If you want to run only one side:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Backend configuration

The backend reads environment variables from the root `.env` file.

### Required `.env` values

```env
PORT=8090
CORS_ORIGIN=http://localhost:5173
groq_API_BASE=https://api.groq.com/openai/v1
groq_API_KEY=<your-groq-api-key>
groq_MODEL=<your-groq-model>
```

- `PORT` — backend port (`8090` by default)
- `CORS_ORIGIN` — allowed frontend origin
- `groq_API_BASE` — Groq API base URL
- `groq_API_KEY` — Groq API key for LLM calls
- `groq_MODEL` — model identifier for Groq

## Frontend Jira connection

The frontend includes a Jira connection modal. Enter these values:

- Jira Base URL (example: `https://your-domain.atlassian.net`)
- Email address used for your Jira account
- Jira API token

The app sends these values to the backend proxy at `/api/jira/search`. The backend then calls Jira safely, avoiding browser CORS restrictions.

## Usage

1. Open `http://localhost:5173`
2. Click `Connect Jira`
3. Enter Jira Base URL, Email, API token
4. Click `Test Connection` or `Connect`
5. Select a Jira story from the list
6. Edit story title, description, or acceptance criteria as needed
7. Click `Generate` to create test cases

## `.env` details

The root `.env` file is used only by the backend.

- Do not commit `.env` to source control.
- Keep your `groq_API_KEY` secret.
- If the frontend needs custom API config, update `frontend/vite.config.ts` or add Vite environment values.

## Deployment notes

- Ensure the backend is reachable from the frontend.
- Use `npm run build` in both `frontend` and `backend` when deploying to production.
- For production, set `NODE_ENV=production` in the backend environment.
- If hosting separately, configure the frontend proxy or environment to call the backend API URL directly.
- Secure Jira API token storage; do not store tokens in the frontend or commit them.

## Additional notes

- The backend proxy route is located at `backend/src/routes/jira.ts`.
- frontend Jira calls are handled in `frontend/src/App.tsx`.
- The project uses a shared npm workspace and `concurrently` for dev mode.
- If you see CORS or network failures, confirm the backend is running and the frontend is using the correct proxy target.

## Commands

| Command | Description |
| --- | --- |
| `npm install` | Install all dependencies for root, frontend, backend |
| `npm run dev` | Start backend + frontend in development |
| `npm run typecheck` | Run TypeScript type checking for all workspaces |
| `cd backend && npm run dev` | Start only backend |
| `cd frontend && npm run dev` | Start only frontend |

## Required software

- Node.js
- npm
- A modern browser
- Jira cloud access with API token
- Groq API access for LLM generation
