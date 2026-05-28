# Tech Stack Info — MERN Portfolio

---

## Current Stack

### Frontend — React (Client)

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | Core UI library |
| `react-dom` | ^18.3.1 | DOM rendering |
| `react-scripts` | 5.0.1 | CRA build toolchain (dev server, bundler, linter) |
| `react-scroll` | ^1.9.0 | Smooth scroll navigation (menu links → sections) |
| `react-scroll-to-top` | ^3.0.0 | Floating scroll-to-top button |
| `react-vertical-timeline-component` | ^3.6.0 | Education and Work Experience timeline UI |
| `react-icons` | ^5.2.1 | Icon library used across all components |
| `framer-motion` | ^11.3.0 | Scroll-triggered animations on section headings |
| `typewriter-effect` | ^2.21.0 | Animated typewriter text on Home page |
| `@emailjs/browser` | ^4.3.3 | Sends contact form emails directly from the browser without a backend mail server |
| `web-vitals` | ^4.2.0 | Core Web Vitals performance measurement |

**Styling:** Plain CSS per component — no CSS framework (no Tailwind/Bootstrap). Theme managed via CSS custom properties through `ThemeContext.js` (light/dark mode).

---

### Backend — Node.js + Express (Server)

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.2 | HTTP server and REST API routing |
| `cors` | ^2.8.5 | Allows cross-origin requests from the React dev server |
| `dotenv` | ^16.3.1 | Loads `.env` variables (port, secrets) |
| `concurrently` | ^9.2.1 | Runs Express server and React dev server simultaneously with `npm run dev` |
| `mongoose` | ^9.6.2 | MongoDB ODM — schemas, models, and queries |
| `resend` | ^6.12.3 | Transactional email service — used by `sendEmailController` |
| `@google/generative-ai` | (transitive) | Google Gemini SDK — direct embeddings + chat generation |
| `@pinecone-database/pinecone` | ^7.2.0 | Pinecone vector DB client — upsert and query vectors |
| `@langchain/core` | ^1.1.48 | LangChain core utilities |
| `@langchain/google-genai` | ^2.1.31 | LangChain Google Gemini integration (embeddings wrapper) |
| `@langchain/pinecone` | ^1.0.3 | LangChain Pinecone integration |
| `langchain` | ^1.4.2 | LangChain orchestration framework |

**Current API base:** `/api/v1/ps-portfolio` — six routes: `POST /sendEmail` (real email via Resend), four live GET endpoints (`/educations`, `/works`, `/projects`, `/skills`) querying MongoDB Atlas, and `POST /chat` powering the RAG chatbot.

**Entry point:** `server.js` — Express app; connects to MongoDB Atlas on startup via Mongoose, serves the React production build as static files, and exposes the REST API.

---

### Project Structure Summary

```
Portfolio/
├── server.js              # Express entry point
├── package.json           # Root — backend deps + all npm scripts
├── config/
│   └── db.js              # Mongoose connect(), Google DNS fix, exits on failure
├── models/
│   ├── Education.js       # Mongoose schema — education entries
│   ├── Work.js            # Mongoose schema — work history entries
│   ├── Project.js         # Mongoose schema — project entries
│   └── Skill.js           # Mongoose schema — skill entries
├── data/
│   └── seed.js            # Wipes + repopulates all 4 collections
├── routes/
│   └── portfolioRoutes.js # API route definitions (includes /chat)
├── controllers/
│   ├── portfolioController.js  # Route handler logic (4 GET + sendEmail via Resend)
│   └── chatController.js       # RAG chatbot: embed → Pinecone query → Gemini LLM
├── scripts/
│   ├── dev.bat            # Windows shortcut: npm run dev
│   ├── start.bat          # Windows shortcut: build + start
│   └── ingest.js          # One-time ingestion: MongoDB → Gemini embeddings → Pinecone
├── docs/                  # Project documentation
└── client/                # React app (CRA)
    └── src/
        ├── pages/         # One folder per page section
        ├── components/    # Layout, Menus, MobileNav, Chatbot
        ├── context/       # ThemeContext (light/dark)
        └── utils/         # SkillsList.js (iconRegistry map)
```

---

## Implemented Features

### Goal 1 — Chatbot (Visitor Q&A) ✅ Complete

The chatbot uses a **RAG (Retrieval-Augmented Generation)** pattern:  
portfolio content is embedded as vectors → stored in Pinecone → at query time, the most relevant chunks are retrieved and fed to Gemini to generate a grounded answer.

| Tool | Free Tier | Role | Status |
|---|---|---|---|
| **Pinecone** | 1 index, 100K vectors — free forever | Vector database: stores 12 embeddings of portfolio content for semantic search | ✅ Active |
| **Google Gemini API** (via AI Studio) | Generous free tier (rate-limited) | Two jobs: (1) `gemini-embedding-2` generates 768-dim embeddings, (2) `gemini-2.5-flash` LLM produces the chatbot answer | ✅ Active |
| **LangChain.js** | Open source, free | Supporting utilities; core RAG pipeline uses `@google/generative-ai` and `@pinecone-database/pinecone` SDKs directly | ✅ Active |

**Actual embedding model used:** `gemini-embedding-2` with `outputDimensionality: 768`  
**Actual LLM used:** `gemini-2.5-flash`  
> Note: `text-embedding-004` and `gemini-1.5-flash` are not available on the AI Studio free tier key — `gemini-embedding-2` and `gemini-2.5-flash` are the correct models.

**Flow (implemented):**
```
Visitor types question
        ↓
@google/generative-ai embeds the question (gemini-embedding-2, 768 dims)
        ↓
Pinecone finds top-5 most relevant portfolio chunks
        ↓
gemini-2.5-flash generates answer from those chunks + system prompt
        ↓
Answer displayed in chat widget (bottom-right floating avatar)
```

**Backend additions completed:**
- `POST /api/v1/ps-portfolio/chat` — accepts visitor message, runs the RAG pipeline, returns answer
- `scripts/ingest.js` — one-time ingestion script: fetches all 4 MongoDB collections + static bio/contact → embeds 12 chunks → upserts to Pinecone namespace `portfolio`

**Frontend additions completed:**
- `client/src/components/chatbot/Chatbot.js` — floating widget with robot avatar (bottom-right), slide-up chat panel, typing indicator, enter-to-send
- `client/src/components/chatbot/Chatbot.css` — dark/light theme aware, pulsing online dot, typing bounce animation
- Mounted in `App.js` as `<Chatbot />`

**Pinecone index:** `ps-portfolio` — Dense, 768 dims, Cosine metric, Serverless (AWS us-east-1), namespace `portfolio`

---

## Roadmap Goals

### Goal 2 — Admin CMS (Edit website without touching code)

**Phase 1 — Data layer: ✅ Complete**  
MongoDB Atlas (M0 free cluster) is connected via Mongoose. All portfolio content is served by live GET endpoints and fetched dynamically by each React page component. The seed script (`data/seed.js`) populates all four collections with initial data.

**Phase 2 — Admin auth and dashboard: ⬜ Remaining**  
An admin UI to log in and update content through a UI, saved to MongoDB via protected REST APIs.

| Tool | Free Tier | Status | Role |
|---|---|---|---|
| **MongoDB Atlas M0** | 512MB shared cluster — free forever | ✅ Active | Primary database — stores all portfolio content |
| **Mongoose** | Open source, free | ✅ Active | ODM for Node.js — schemas and queries |
| **jsonwebtoken (JWT)** | Open source, free | ⬜ Planned | Signs tokens on admin login; protects write/delete routes |
| **bcryptjs** | Open source, free | ⬜ Planned | Hashes admin password before storing in MongoDB |

**Active MongoDB collections (4 of 6):**
```
education        — date, title, school, location, grade, order        ✅
works            — date, title, company, location, desc, order         ✅
projects         — imageKey, type, typeColor, tags, title, desc, link, order  ✅
skills           — name, iconName, order                              ✅
contact_messages — name, email, message, timestamp                    ⬜ planned
admin            — username, hashed password                          ⬜ planned
```

**Remaining backend additions:**
- `POST/PUT/DELETE /api/v1/<collection>` — protected write routes (JWT middleware)
- `POST /api/v1/admin/login` — validates credentials, returns JWT

**Remaining frontend additions:**
- Admin login page (protected route, not in the public nav)
- Admin dashboard with forms to add/edit/delete each content section

---

## Full Stack Map (Current)

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend                     │
│  Pages: Home, About, Skills, Projects,              │
│         Education, Work, Contact                    │
│  + Chat Widget ✅ (Chatbot.js — bottom-right)       │
│  + Admin Dashboard (Goal 2 — planned)               │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / REST
┌────────────────────▼────────────────────────────────┐
│               Express Backend                       │
│  /api/v1/ps-portfolio/                              │
│  Public routes  → GET portfolio content             │
│  Chat route     → POST /chat (RAG pipeline) ✅      │
│  Protected routes → POST/PUT/DELETE (JWT — planned) │
└──────┬──────────────────────┬────────────────────────┘
       │                      │
┌──────▼──────┐      ┌────────▼───────────────────────┐
│ MongoDB     │      │ RAG Pipeline (chatController)  │
│ Atlas M0    │      │  gemini-embedding-2 (768 dims)  │
│ (CMS data)  │      │  → Pinecone ps-portfolio index  │
│  Free ✅    │      │  → gemini-2.5-flash (answer)    │
└─────────────┘      │  All free tiers ✅              │
                     └────────────────────────────────┘
```

---

## Cost Summary

| Service | Plan Used | Monthly Cost |
|---|---|---|
| MongoDB Atlas | M0 Free Shared | $0 |
| Pinecone | Free (1 index, 100K vectors) | $0 |
| Google Gemini API | Free tier (AI Studio) | $0 |
| LangChain.js | Open source | $0 |
| jsonwebtoken + bcryptjs | Open source | $0 |
| **Total** | | **$0** |

> **Note:** Gemini's free tier has rate limits (requests per minute/day). For a personal portfolio with typical traffic these limits will never be hit. If the site scales significantly, Gemini's paid tier is pay-per-token and remains very cheap at low volume.
