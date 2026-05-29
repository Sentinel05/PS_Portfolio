# Chatbot Setup — RAG AI Assistant

This document describes exactly what was built, how it works, and how to maintain it.

---

## Overview

A floating chat widget is embedded on the portfolio site. It uses **Retrieval-Augmented Generation (RAG)**: visitor questions are answered using portfolio content retrieved from a Pinecone vector database and passed as context to a Google Gemini LLM.

No LangChain is used. Both embedding and chat generation use the **`@google/generative-ai` SDK directly**.

---

## Architecture

```
Visitor types message
       │
       ▼
React Chatbot component (client) — floating figure / avatar dual-state widget
  POST /api/v1/ps-portfolio/chat  { message, history }
       │
       ▼
chatController.js (Express backend)
  1. Sanitise input (trim, max 500 chars)
  2. Embed query  →  gemini-embedding-2  →  768-dim vector
  3. Query Pinecone  →  namespace "portfolio", topK 8, filter score ≥ 0.45
  4. Build system prompt with retrieved context chunks
  5. Inject last 6 turns of conversation history into Gemini chat
  6. gemini-2.5-flash.startChat() → sendMessage()
  7. Return { success: true, answer }
       │
       ▼
React renders answer as markdown in chat panel
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Embedding model | `gemini-embedding-2` (Google AI Studio) | — |
| LLM | `gemini-2.5-flash` (Google AI Studio) | — |
| Google SDK | `@google/generative-ai` | `^0.24.0` |
| Vector DB | Pinecone (serverless, AWS us-east-1) | — |
| Pinecone client | `@pinecone-database/pinecone` | `^7.2.0` |
| Frontend framework | React 18 (CRA) | — |

---

## Pinecone Index

| Setting | Value |
|---|---|
| Index name | `ps-portfolio` |
| Dimensions | `768` |
| Metric | Cosine |
| Type | Dense |
| Cloud / Region | AWS `us-east-1` (Serverless) |
| Namespace used | `portfolio` |
| Vectors ingested | 13 |

---

## Environment Variables

All of these must be set in `.env` locally and in the Render dashboard under **Environment → Environment Variables**:

| Key | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `PINECONE_API_KEY` | Pinecone API key |
| `PINECONE_INDEX` | `ps-portfolio` |

---

## Files Added / Modified

### New Files

| File | Purpose |
|---|---|
| `controllers/chatController.js` | Express controller — RAG pipeline handler |
| `scripts/ingest.js` | One-time ingestion script — embeds portfolio data into Pinecone |
| `scripts/ingest.bat` | Windows batch shortcut for `npm run ingest` |
| `scripts/seed.bat` | Windows batch shortcut for `npm run seed` |
| `client/src/components/chatbot/Chatbot.js` | React chat widget component |
| `client/src/components/chatbot/Chatbot.css` | Styles for the chat widget |
| `client/src/assets/images/chatbot-avatar.png` | Avatar image used as figure / small trigger button and in message bubbles |

### Modified Files

| File | Change |
|---|---|
| `routes/portfolioRoutes.js` | Added `POST /chat` route → `chatController` |
| `client/src/App.js` | Imported and mounted `<Chatbot />` |
| `package.json` | Added `@google/generative-ai ^0.24.0`, `@pinecone-database/pinecone ^7.2.0`; added `"ingest": "node scripts/ingest.js"` and `"seed": "node data/seed.js"` scripts |

---

## Backend: chatController.js

**Location:** `controllers/chatController.js`

**Route:** `POST /api/v1/ps-portfolio/chat`

**Request body:** `{ "message": "string (max 500 chars)", "history": [ { "role": "user"|"bot", "text": "string" } ] }`

**Response:** `{ "success": true, "answer": "string" }`

### How it works

1. **Singleton init** — Pinecone client, embedding model, and chat model are initialised once on first request and reused (`initClients()`).
2. **Embed query** — The user message is embedded using `embeddingModel.embedContent()` with `outputDimensionality: 768`.
3. **Retrieve context** — The 768-dim vector is used to query Pinecone namespace `"portfolio"` (`topK: 8`). Matches with `score < 0.45` are filtered out. The `metadata.text` field from each remaining match is joined into a context string.
4. **Multi-turn history** — The last 6 turns from `req.body.history` are validated and injected into the Gemini chat as prior messages (role `"bot"` mapped to `"model"`).
5. **Build prompt** — A system prompt instructs the model to answer only from the provided context and conversation history. If the information is not in context, it directs the visitor to the Contact section.
6. **Generate answer** — `chatModel.startChat()` is called with the system prompt and prior history, then `sendMessage(userMessage)` returns the response.
7. **Input safety** — Input is trimmed and capped at 500 characters before any processing.

---

## Ingestion Script: scripts/ingest.js

**Run with:** `npm run ingest` (or `scripts\ingest.bat` on Windows)

**When to run:** Once initially, and again whenever MongoDB portfolio content changes.

### What it ingests

| ID prefix | Source | Count |
|---|---|---|
| `doc-0` | Static bio/about text | 1 |
| `doc-1` to `doc-N` | Each Education document | 3 |
| continuing | Each Work document | 3 |
| continuing | Each Project document | 3 |
| continuing | All Skills (one grouped chunk) | 1 |
| continuing | All Certifications (one grouped chunk) | 1 |
| last | Static contact/social links | 1 |
| **Total** | | **13 vectors** |

### Process

1. Connects to MongoDB via `MONGO_URI`.
2. Fetches all Education, Work, Project, Skill documents (sorted by `order`).
3. Builds plain-text chunks via `buildChunks()`.
4. Embeds each chunk using `gemini-embedding-2` with `outputDimensionality: 768`.
5. Upserts to Pinecone in batches of 5: `pineconeIndex.namespace("portfolio").upsert({ records })`.
   - Each record: `{ id, values (768-dim float array), metadata: { text, source, title } }`
6. Disconnects from MongoDB and exits.

### Critical API notes

- **Must use `{ records: [...] }` object** — passing a bare array to `.upsert()` throws `PineconeArgumentError: Must pass in at least 1 record`.
- **Embedding model must be `gemini-embedding-2`** — `text-embedding-004`, `embedding-001` return 404 on the free Google AI Studio key.
- **LLM must be `gemini-2.5-flash`** — `gemini-1.5-flash` returns 404 on the free key.

---

## Frontend: Chatbot.js + Chatbot.css

**Location:** `client/src/components/chatbot/`

**Mounted in:** `client/src/App.js` — rendered globally, appears on every page.

### Features

- Fixed position, bottom-right corner.
- Idle state: full-body figure (96px) with floating animation and ambient glow. Speech bubble “Need any help? 👋” auto-appears after 1.8s and re-appears 700ms after chat closes.
- On click: figure morphs (spring animation) into a small 68px avatar trigger; chat panel slides up.
- Panel header shows avatar, name (“Priyanshu’s AI”), and green online status dot.
- Message history rendered with separate styles for user and bot bubbles.
- Bot messages support **markdown rendering**: bold, inline code, bullet lists, line breaks.
- Bot messages include the avatar image.
- Animated three-dot typing indicator while waiting for a response.
- Last 6 turns of conversation history sent to backend for multi-turn context.
- Enter key sends the message (Shift+Enter does not).
- Input capped at 500 characters (mirrors backend limit).
- Auto-scrolls to the latest message.
- Input auto-focuses when the panel opens.
- Dark/light theme aware via CSS custom properties.
- Responsive: panel adjusts on screens narrower than 480px.

### Initial bot message

> "Hi! I'm Priyanshu's AI assistant. Ask me anything about his experience, projects, or skills!"

### API call

```js
fetch("/api/v1/ps-portfolio/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: text, history: historySnapshot }),
});
```

---

## npm Scripts

```json
"ingest": "node scripts/ingest.js",
"seed": "node data/seed.js"
```

Run locally:

```bash
npm run ingest
```

Or on Windows via the batch shortcut:

```bat
scripts\ingest.bat
```

---

## Deployment Notes (Render)

- **No ingestion step on Render.** The 12 vectors are already in Pinecone (cloud). The server queries them at runtime.
- **Build command:** `npm install && npm run build`
  - `npm run build` internally runs: `npm install --prefix client --legacy-peer-deps && npm run build --prefix client`
- **Start command:** `npm start`
- **Required env vars on Render:** `GEMINI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX` (plus `MONGO_URI`, `RESEND_API_KEY`, `GMAIL_USER`).

### Why LangChain is not used

LangChain packages were removed from `package.json` because:
- The code uses `@google/generative-ai` and `@pinecone-database/pinecone` SDKs directly — LangChain wrappers were never called.
- `@langchain/pinecone@1.0.3` declared a peer dependency on `@pinecone-database/pinecone@^5` but `^7.2.0` was installed, causing `ERESOLVE` build failures on Render.

---

## Re-ingestion Workflow

If portfolio content in MongoDB changes (new job, certification, project, etc.):

1. Update the MongoDB documents via the Admin CMS or re-run `npm run seed`.
2. Run `npm run ingest` locally (requires `.env` with all keys).
3. The old vectors in Pinecone are overwritten by the same `doc-0`, `doc-1`, ... IDs.
4. No redeployment needed — Pinecone is queried at runtime.
