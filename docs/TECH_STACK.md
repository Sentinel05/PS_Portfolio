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

**Current API:** `/api/v1/potfolio` — five routes: `POST /sendEmail` (stub; real email handled client-side via EmailJS) and four live GET endpoints (`/educations`, `/works`, `/projects`, `/skills`) that query MongoDB Atlas and return JSON. Database is connected and active — all portfolio content is served dynamically from MongoDB.

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
│   └── portfolioRoutes.js # API route definitions
├── controllers/
│   └── portfolioController.js  # Route handler logic (4 GET + sendEmail stub)
├── scripts/
│   ├── dev.bat            # Windows shortcut: npm run dev
│   └── start.bat          # Windows shortcut: build + start
├── docs/                  # Project documentation
└── client/                # React app (CRA)
    └── src/
        ├── pages/         # One folder per page section
        ├── components/    # Layout, Menus, MobileNav
        ├── context/       # ThemeContext (light/dark)
        └── utils/         # SkillsList.js (iconRegistry map)
```

---

## Incoming Stack (Roadmap Goals)

### Goal 1 — Chatbot (Visitor Q&A)

The chatbot will use a **RAG (Retrieval-Augmented Generation)** pattern:  
portfolio content is embedded as vectors → stored in a vector database → at query time, the most relevant chunks are retrieved and fed to an LLM to generate an accurate, grounded answer.

| Tool | Free Tier | Role |
|---|---|---|
| **Pinecone** | 1 index, 100K vectors — free forever | Vector database: stores embeddings of your portfolio content for semantic search |
| **Google Gemini API** (via AI Studio) | Generous free tier (rate-limited) | Two jobs: (1) generate embeddings, (2) LLM that produces the chatbot's answer |
| **LangChain.js** | Open source, free | Orchestration layer: chains together the embedding step → Pinecone retrieval → Gemini response into a single pipeline |

**Flow:**
```
Visitor types question
        ↓
LangChain.js embeds the question (Gemini Embeddings)
        ↓
Pinecone finds the most relevant portfolio chunks
        ↓
Gemini LLM generates answer from those chunks
        ↓
Answer displayed in chat widget on the site
```

**New backend additions needed:**
- `POST /api/v1/chat` — accepts visitor message, runs the LangChain chain, returns answer
- A one-time ingestion script to embed and upsert portfolio content into Pinecone

---

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

## Full Stack Map (Current + Planned)

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend                     │
│  Pages: Home, About, Skills, Projects,              │
│         Education, Work, Contact                    │
│  + Admin Dashboard (Goal 2)                         │
│  + Chat Widget (Goal 1)                             │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / REST
┌────────────────────▼────────────────────────────────┐
│               Express Backend                       │
│  Public routes  → GET portfolio content             │
│  Protected routes → POST/PUT/DELETE (JWT guard)     │
│  Chat route     → POST /api/v1/chat (LangChain)     │
└──────┬──────────────────────┬────────────────────────┘
       │                      │
┌──────▼──────┐      ┌────────▼───────────────────────┐
│ MongoDB     │      │ LangChain.js Pipeline          │
│ Atlas M0    │      │  Gemini Embeddings             │
│ (CMS data)  │      │  → Pinecone (vector search)    │
│  Free       │      │  → Gemini LLM (answer)         │
└─────────────┘      │  All free tiers                │
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
