# How Our Email Batch Processor Works

Notes on the flow and pieces of the application.

---

## 1. Big Picture

We have **two separate Node processes** that must both be running:

| Process | Command | Role |
|--------|---------|------|
| **API server** | `npm run dev` | Receives uploads, saves to DB, pushes batch to Redis queue, serves UI and status. |
| **Worker** | `npm run worker` | Reads batch IDs from Redis queue, processes emails, updates DB and publishes progress. |

- **PostgreSQL (Prisma)** stores batches and emails and their status.
- **Redis** is used in two ways: a **queue** (list) for jobs, and **Pub/Sub** for live status updates to the UI.

---

## 2. End-to-End Flow

```
User uploads CSV
      ↓
API: parse CSV → create Batch + Emails in Postgres (status: pending)
      ↓
API: push batch ID to Redis queue (LPUSH)
      ↓
API: send first status to Redis Pub/Sub (optional, for UI)
      ↓
API: respond to user "Queued"
      ↓
Worker: blocked on Redis queue (BRPOP)
      ↓
Worker: gets batch ID from queue
      ↓
Worker: update Batch status → "processing"
      ↓
Worker: in a loop: fetch chunk of pending emails → "process" each → update Email to "processed", update Batch processedCount, publish progress via Pub/Sub
      ↓
Worker: when no pending emails left → update Batch to "completed", publish final status
```

So: **upload is fast** (just save + push to queue). **Heavy work** (updating each email) happens in the **worker**.

---

## 3. Redis: Two Different Uses

### 3.1 Redis as a Queue (List)

- **Key:** `email-queue` (from config).
- **API** adds work: `LPUSH email-queue <batchId>` (newest at the left).
- **Worker** takes work: `BRPOP email-queue 0` (blocks until something is there, then pops from the right → FIFO).
- So we use a **Redis list** as a simple queue: producer (API) pushes, consumer (worker) pops. No BullMQ, just Redis commands.

### 3.2 Redis Pub/Sub (Live Status)

- **Channels:** one per batch, e.g. `batch:status:<batchId>`.
- **Worker** (and sometimes API) **publishes** progress: `PUBLISH batch:status:<batchId> '{"status":"processing","processed":50,"total":200}'`.
- **API** has an SSE endpoint that **subscribes** to `batch:status:<batchId>` and forwards every message to the browser as Server-Sent Events.
- **UI** opens an `EventSource` to that SSE URL and updates the progress bar and status text in real time.

So: **Queue = who does the work**; **Pub/Sub = tell the UI how the work is going**.

---

## 4. Database (PostgreSQL + Prisma)

**Batch**

- `id`, `filename`, `totalEmails`, `processedCount`, `status` (pending | processing | completed | failed), `createdAt`, `completedAt`.

**Email**

- `id`, `batchId`, `email`, `status` (pending | processed | failed), `createdAt`.

- Upload creates one **Batch** and many **Email** rows (all `pending`).
- Worker updates **Batch** (status, `processedCount`, `completedAt`) and each **Email** (`pending` → `processed`).

---

## 5. API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Serves the UI (static files from `ui/`). |
| GET | `/api/health` | Health check. |
| POST | `/api/upload` | Accept CSV (field `file`), parse emails, create Batch + Emails, push batch ID to queue, return batch info. |
| GET | `/api/batches` | List recent batches (for "Recent Batches" in UI). |
| GET | `/api/batches/:id` | Get one batch by ID. |
| GET | `/api/batches/:id/stream` | SSE stream: subscribe to Redis channel for that batch and stream updates to the client. |

---

## 6. UI Flow

1. User selects a CSV (emails only) and clicks "Upload & Process".
2. `POST /api/upload` is called with the file; response includes `batchId` and `totalEmails`.
3. UI shows "Processing Status" and opens an EventSource to `GET /api/batches/:id/stream`.
4. Each SSE event is parsed and used to update: filename, status, progress (e.g. "50 / 200") and the progress bar.
5. "Recent Batches" is loaded via `GET /api/batches` and can be refreshed with the button.

If the **worker** is not running, batches stay in the queue and status stays "pending" until you start the worker.

---

## 7. File Map (Backend)

| File | Role |
|------|------|
| `src/index.js` | Express app: static UI, CORS, registers upload + batch routes, health. |
| `src/config.js` | Port, Redis URL, queue key name, batch size. |
| `src/db.js` | Prisma client (with Postgres adapter for Prisma 7). |
| `src/redis.js` | Two Redis connections: one for general use + publish, one for subscribing (SSE). |
| `src/queue.js` | `addBatchToQueue(batchId)` (LPUSH), `takeNextBatchFromQueue()` (BRPOP). |
| `src/worker.js` | Infinite loop: take batch ID from queue → process batch (update DB, publish status). |
| `src/routes/upload.js` | Parse CSV, create Batch + Emails, add to queue, publish initial status, respond. |
| `src/routes/batches.js` | List batches, get one batch, SSE stream (subscribe to Redis, forward to client). |

---

## 8. Summary

- **Express** handles HTTP and serves the UI.
- **Postgres + Prisma** store batches and emails and their status.
- **Redis list** is our queue: API pushes batch IDs, worker pops and processes.
- **Redis Pub/Sub** streams progress from worker to API, and API forwards it to the browser via SSE.
- **Two processes**: API (upload + status) and Worker (process queue and update status). Both must run for status to move from "pending" to "completed".
