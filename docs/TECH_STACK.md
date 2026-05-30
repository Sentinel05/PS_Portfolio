# Tech Stack Info — MERN Portfolio

---

## Current Stack

### Frontend — React (Client)

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | Core UI library |
| `react-dom` | ^18.3.1 | DOM rendering |
| `react-scripts` | 5.0.1 | CRA build toolchain (dev server, bundler, linter) |
| `react-router-dom` | ^6.x | Client-side routing: /, /portfolio/*, /admin/login, /admin |
| `react-scroll` | ^1.9.0 | Smooth scroll navigation (menu links → sections) |
| `react-vertical-timeline-component` | ^3.6.0 | Education and Work Experience timeline UI |
| `react-icons` | ^5.2.1 | Icon library used across all components |
| `framer-motion` | ^11.3.0 | Scroll-triggered animations on section headings |
| `typewriter-effect` | ^2.21.0 | Animated typewriter text on Home page |
| `@emailjs/browser` | ^4.3.3 | Installed but unused — email is now handled server-side via Resend |
| `web-vitals` | ^4.2.0 | Core Web Vitals performance measurement |

**Styling:** Plain CSS per component — no CSS framework (no Tailwind/Bootstrap). Theme managed via CSS custom properties through `ThemeContext.js`. Theme **auto-initialises based on time of day** (6 am–6 pm → light mode; 6 pm–6 am → dark mode) and can also be toggled manually via the sun/moon button in the sidebar.

---

### Backend — Node.js + Express (Server)

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.2 | HTTP server and REST API routing |
| `cors` | ^2.8.5 | Allows cross-origin requests from the React dev server |
| `dotenv` | ^16.3.1 | Loads `.env` variables (port, secrets) |
| `concurrently` | ^9.2.1 | Runs Express server and React dev server simultaneously with `npm run dev` |
| `mongoose` | ^9.6.2 | MongoDB ODM — schemas, models, and queries |
| `bcryptjs` | ^2.x | Password hashing for admin account (cost factor 12) |
| `jsonwebtoken` | ^9.x | Signs 8-hour JWT on admin login; verified by auth middleware on protected routes |
| `resend` | ^6.12.3 | Transactional email service — used by `sendEmailController` |
| `@google/generative-ai` | ^0.24.0 | Google Gemini SDK — direct embeddings (`gemini-embedding-2`) + chat (`gemini-2.5-flash`) |
| `@pinecone-database/pinecone` | ^7.2.0 | Pinecone vector DB client — upsert and query vectors |

**Current API base:** `/api/v1/ps-portfolio` — public GET endpoints + protected POST/PUT/DELETE CRUD + `POST /chat` (RAG chatbot) + `POST /visits` (guest log) + `GET /visits` (admin only). Admin auth routes mounted at `/api/v1/admin` (`POST /login`).

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
│   └── seed.js            # Wipes + repopulates all 6 collections (educations, works, projects, skills, certifications, and admin stays from env)
├── routes/
│   └── portfolioRoutes.js # API route definitions (includes /chat, /visits)
├── controllers/
│   ├── portfolioController.js  # Route handler logic (5 GET + sendEmail via Resend)
│   └── chatController.js       # RAG chatbot: embed → Pinecone query → Gemini LLM
│   └── adminController.js      # Admin login: bcrypt compare + JWT sign
│   └── crudController.js       # Generic POST/PUT/DELETE for all 5 portfolio collections
├── scripts/
│   ├── dev.bat            # Windows shortcut: npm run dev
│   ├── start.bat          # Windows shortcut: build + start
│   └── ingest.js          # One-time ingestion: MongoDB → Gemini embeddings → Pinecone
├── docs/                  # Project documentation
└── client/                # React app (CRA)
    └── src/
        ├── pages/         # One folder per page section
        ├── components/    # Layout, Menus, MobileNav, Chatbot
        ├── context/       # ThemeContext (auto time-based dark/light), AuthContext (JWT)
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
Pinecone finds top-8 most relevant portfolio chunks (score ≥ 0.45 filtered)
        ↓
gemini-2.5-flash generates answer from those chunks + system prompt + last 6 turns of history
        ↓
Answer displayed in chat widget (bottom-right floating figure, markdown rendered)
```

**Backend additions completed:**
- `POST /api/v1/ps-portfolio/chat` — accepts visitor message + history, runs the RAG pipeline, returns answer
- `scripts/ingest.js` — one-time ingestion script: fetches all 6 MongoDB collections + static bio/contact → embeds 13 chunks → upserts to Pinecone namespace `portfolio`

**Frontend additions completed:**
- `client/src/components/chatbot/Chatbot.js` — floating figure widget (bottom-right); idle state shows full-body figure with speech bubble “Need any help? 👋”, morphs into small avatar when chat opens; multi-turn history sent with each message; markdown rendering for bot responses
- `client/src/components/chatbot/Chatbot.css` — figure-float animation, glow-pulse ambient effect, spring transitions for figure↔avatar morph
- Mounted in `App.js` as `<Chatbot />`

**Pinecone index:** `ps-portfolio` — Dense, 768 dims, Cosine metric, Serverless (AWS us-east-1), namespace `portfolio`, **13 vectors**

---

## Roadmap Goals

### Goal 2 — Admin CMS (Edit website without touching code) ✅ Complete

**Phase 1 — Data layer: ✅ Complete**  
MongoDB Atlas (M0 free cluster) is connected via Mongoose. All portfolio content is served by live GET endpoints and fetched dynamically by each React page component.

**Phase 2 — Admin auth and dashboard: ✅ Complete**  
Full JWT-authenticated admin CMS is live. Visitors land on a Welcome page and choose Guest or Admin. Guests must enter their name (logged as a visit). Admins log in with credentials stored in MongoDB (synced from env vars on every server start).

| Tool | Free Tier | Status | Role |
|---|---|---|---|
| **MongoDB Atlas M0** | 512MB shared cluster — free forever | ✅ Active | Primary database — stores all portfolio content + admin account + visit log |
| **Mongoose** | Open source, free | ✅ Active | ODM for Node.js — schemas and queries |
| **jsonwebtoken (JWT)** | Open source, free | ✅ Active | Signs 8-hour tokens on admin login; auth middleware verifies on all write routes |
| **bcryptjs** | Open source, free | ✅ Active | Hashes admin password (cost 12) before storing in MongoDB |

**Active MongoDB collections (8 of 8):**
```
educations     — date, title, school, location, grade, order                       ✅
works          — date, title, company, location, desc, order                        ✅
projects       — imageKey, type, typeColor, tags, title, desc, link, order           ✅
skills         — name, iconName, category, order                                     ✅
certifications — title, issuer, date, link, order                                    ✅
admin          — username (unique), passwordHash                                      ✅
visits         — name, visitedAt                                                      ✅
```

**Admin portal features (all implemented):**
- Welcome landing page for all visitors (`/`) — Guest vs Admin role selection
- Guest flow: mandatory name capture → visit logged to `visits` collection → public portfolio
- Guest portfolio has a floating “← Home” button to return to the Welcome page
- Admin login at `/admin/login` — bcrypt compare + JWT sign (8h)
- JWT stored in `localStorage` under key `admin_token`; `AuthContext` exposes `login()`/`logout()`
- `ProtectedRoute` redirects unauthenticated visitors to `/`
- Admin portal at `/admin`: portfolio-style view with fixed topbar, collapsible sidebar, 6 content sections
- Each section: inline Add / Edit (pencil) / Delete (trash with confirm modal) per item
- Skills section groups cards by category (Languages, Frontend, Frameworks & Libraries, Databases, DevOps, Tools)
- Certifications section: full CRUD with title, issuer, date, link fields
- **Certifications public page**: auto-sorts by date (newest first) after fetching from the API
- **Analytics Dashboard** (`DashboardSection` in `AdminPortfolio.js`):
  - **5 visitor stat cards**: Total Visits, Unique Visitors, Last 7 Days, Returning visitors, First-time visitors
  - **Content count cards**: live counts for Projects, Skills, Certifications, Work entries, Educations
  - **Daily bar chart**: visits per day for the last 14 days (SVG, cyan→purple gradient)
  - **Monthly trend chart**: visits per month for the last 6 months (SVG, purple→pink)
  - **Top 5 returning visitors** panel with proportional bar indicators
  - **Peak visit hours chart**: SVG bar chart across hours 0–23 (green→cyan)
  - **Day-of-week chart**: SVG full-width, visits by day Mon–Sun (orange→pink)
  - **Visitor table**: filter by name, click-to-sort Name/Date, paginated 10 rows/page (Prev/Next)
- Admin credentials always synced from `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars on server start (`findOneAndUpdate` upsert)

---

## Full Stack Map (Current)

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend                     │
│  Routes: / (Welcome) | /portfolio/* (public)        │
│          /admin/login | /admin (protected)          │
│  + Chat Widget ✅ (Chatbot.js — bottom-right)       │
│  + Admin CMS ✅ (AdminPortfolio.js)                 │
│  + Visitor Dashboard ✅ (in AdminPortfolio)         │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / REST
┌────────────────────▼────────────────────────────────┐
│               Express Backend                       │
│  /api/v1/ps-portfolio/                              │
│  Public GET    → portfolio content (4 collections)  │
│  POST /sendEmail → Resend transactional email        │
│  POST /chat    → RAG pipeline ✅                    │
│  POST /visits  → log guest visit (public) ✅        │
│  GET  /visits  → visitor list (admin JWT) ✅        │
│  POST/PUT/DELETE /:col/:id → protected CRUD ✅      │
│  /api/v1/admin/login → bcrypt + JWT sign ✅         │
└──────┬──────────────────────┬────────────────────────┘
       │                      │
┌──────▼──────┐      ┌────────▼───────────────────────┐
│ MongoDB     │      │ RAG Pipeline (chatController)  │
│ Atlas M0    │      │  gemini-embedding-2 (768 dims)  │
│ 6 colls ✅  │      │  → Pinecone ps-portfolio index  │
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
| jsonwebtoken + bcryptjs | Open source | $0 |
| Resend | Free tier (100 emails/day) | $0 |
| **Total** | | **$0** |

> **Note:** Gemini's free tier has rate limits (requests per minute/day). For a personal portfolio with typical traffic these limits will never be hit. If the site scales significantly, Gemini's paid tier is pay-per-token and remains very cheap at low volume.
