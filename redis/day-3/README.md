# Email Batch Processor

A simple utility to upload CSV files containing emails and process them in the background using **Express**, **PostgreSQL**, **Prisma**, **Redis** (a simple list-based queue + Pub/Sub for live status).

## What’s in the project

- **Backend** (`backend/`): Express API, Prisma + Postgres, Redis queue (list), Redis Pub/Sub for status.
- **UI** (`ui/`): Single-page UI to upload a CSV and see processing status in real time.

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** running locally (or a connection string)
- **Redis** running locally (default: `redis://localhost:6379`)

## Setup

### 1. Backend env

In `backend/` create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/email_processor?schema=public"
REDIS_URL="redis://localhost:6379"
PORT=4000
```

Replace `USER` and `PASSWORD` with your Postgres user and password. Create the database if needed:

```bash
createdb email_processor
```

### 2. Install and DB

Create `backend/.env` with at least `DATABASE_URL` and `REDIS_URL` (see step 1). Then:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
```

### 3. Run backend and worker

**Terminal 1 – API:**

```bash
cd backend
npm run dev
```

**Terminal 2 – Worker (processes the queue):**

```bash
cd backend
npm run worker
```

### 4. Open the UI

- Go to: **http://localhost:4000**
- Or open `ui/index.html` in a browser (if the API runs on port 4000 and CORS is allowed).

## Usage

1. **CSV format**: One email per line. One column is enough (e.g. a header `email` and then one email per row). Example: `sample-emails.csv` in the project root.
2. **Upload**: In the UI, choose your CSV and click “Upload & Process”.
3. **Status**: The current batch’s status and progress update in real time (via Redis Pub/Sub and Server-Sent Events).
4. **Recent batches**: The list shows recent batches and their status (pending / processing / completed / failed).

## Tech overview

| Part            | Role |
|-----------------|------|
| **Express**     | REST API: upload CSV, list batches, batch detail, SSE stream. |
| **Postgres + Prisma** | Store batches and emails, progress and status. |
| **Redis queue** | A Redis list: API pushes batch ID with `LPUSH`, worker waits with `BRPOP` and processes one batch at a time. |
| **Redis Pub/Sub** | Worker publishes progress; API subscribes and forwards over SSE so the UI updates live. |

## API (for reference)

- `POST /api/upload` – body: `multipart/form-data` with field `file` (CSV). Returns `batchId`, `filename`, `totalEmails`, `status`.
- `GET /api/batches` – list recent batches.
- `GET /api/batches/:id` – one batch by id.
- `GET /api/batches/:id/stream` – Server-Sent Events stream for live status (used by the UI).

## Sample CSV

- **Small test**: use `sample-emails.csv` in the repo (10 emails).
- **Large test (1000–2000 emails)**: run from project root:
  ```bash
  node scripts/generate-sample-csv.js 1500
  ```
  This creates `sample-emails-large.csv` with 1500 emails. You can pass any number, e.g. `2000`.
