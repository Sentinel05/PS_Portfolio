# Tech Stack Info — MERN Portfolio

---

## Current Stack

### Frontend — React (Client)

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | Core UI library |
| `react-dom` | ^18.3.1 | DOM rendering |
| `react-scripts` | 5.0.1 | CRA build toolchain (dev server, bundler, linter) |
| `react-router-dom` (via App.js) | — | Client-side routing between sections |
| `react-scroll` | ^1.9.0 | Smooth scroll navigation (menu links → sections) |
| `react-scroll-to-top` | ^3.0.0 | Floating scroll-to-top button |
| `react-vertical-timeline-component` | ^3.6.0 | Education and Work Experience timeline UI |
| `react-icons` | ^5.2.1 | Icon library used across all components |
| `framer-motion` | ^11.3.0 | Scroll-triggered animations on section headings |
| `typewriter-effect` | ^2.21.0 | Animated typewriter text on Home page |
| `@emailjs/browser` | ^4.3.3 | Sends contact form emails directly from the browser without a backend mail server |

**Styling:** Plain CSS per component — no CSS framework (no Tailwind/Bootstrap). Theme managed via CSS custom properties through `ThemeContext.js` (light/dark mode).

---

### Backend — Node.js + Express (Server)

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.2 | HTTP server and REST API routing |
| `cors` | ^2.8.5 | Allows cross-origin requests from the React dev server |
| `dotenv` | ^16.3.1 | Loads `.env` variables (port, secrets) |
| `concurrently` | ^9.2.1 | Runs Express server and React dev server simultaneously with `npm run dev` |

**Current API:** `/api/v1/potfolio` (single route — contact form stub). No database connection yet. All portfolio data (education, work, projects, skills) is hard-coded in the React components.

**Entry point:** `server.js` — Express app; serves the React production build as static files in production.

---

### Project Structure Summary

```
Portfolio/
├── server.js              # Express entry point
├── routes/
│   └── portfolioRoutes.js # API route definitions
├── controllers/
│   └── portfolioController.js  # Route handler logic
└── client/                # React app (CRA)
    └── src/
        ├── pages/         # One folder per page section
        ├── components/    # Layout, Menus, MobileNav
        ├── context/       # ThemeContext (light/dark)
        └── utils/         # SkillsList.js (icon + label data)
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

Replaces all hard-coded data in React components with data fetched from MongoDB.  
An admin UI lets you log in and update content which is saved to MongoDB via REST APIs.

| Tool | Free Tier | Role |
|---|---|---|
| **MongoDB Atlas M0** | 512MB shared cluster — free forever | Primary database: stores all portfolio content (education, work, projects, skills, contact messages) |
| **Mongoose** | Open source, free | ODM for Node.js — defines schemas and talks to Atlas |
| **jsonwebtoken (JWT)** | Open source, free | Issues signed tokens on admin login; protects write/delete API routes |
| **bcryptjs** | Open source, free | Hashes the admin password before storing it in MongoDB |

**MongoDB Collections:**
```
education       — degree, school, location, grade, date
works           — title, company, location, description, date
projects        — title, description, tech stack, links
skills          — name, icon, category
contact_messages — name, email, message, timestamp
admin           — username, hashed password
```

**New backend additions needed:**
- `GET /api/v1/<collection>` — public read routes (React fetches data on load instead of using hard-coded arrays)
- `POST/PUT/DELETE /api/v1/<collection>` — protected write routes (JWT middleware guards these)
- `POST /api/v1/admin/login` — validates credentials, returns JWT

**New frontend additions needed:**
- Admin login page (protected route, not in the public nav)
- Admin dashboard with forms to add/edit/delete each content section
- Replace hard-coded data arrays in each page component with `useEffect` + `fetch` calls to the read APIs

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
