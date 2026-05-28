# Portfolio — Project Exploration & Reference

> Living document: update when data, dependencies, or architecture changes.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [Frontend Deep-Dive](#5-frontend-deep-dive)
6. [Backend Deep-Dive](#6-backend-deep-dive)
7. [Design System](#7-design-system)
8. [Third-Party Integrations](#8-third-party-integrations)
9. [NPM Scripts Reference](#9-npm-scripts-reference)
10. [Environment Variables](#10-environment-variables)
11. [Git & Version Control Notes](#11-git--version-control-notes)
12. [Known Issues & Gotchas](#12-known-issues--gotchas)
13. [Personal Data in the Project](#13-personal-data-in-the-project)

---

## 1. Project Overview

A **MERN-inspired** personal portfolio for **Priyanshu Sarkar** (Software Engineer at OpenText).  
The app is a **single-page application (SPA)** with a fixed sidebar navigation, smooth scroll sections, dark/light theme toggle, and a contact form powered by EmailJS.

| Item | Value |
|---|---|
| Author | Priyanshu Sarkar |
| GitHub username | Sentinel05 |
| Current employer | OpenText, Bengaluru |
| Backend port | `8080` |
| Frontend dev port | `3000` |
| License | MIT |

---

## 2. Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| `express` | `^4.18.2` | HTTP server |
| `cors` | `^2.8.5` | Cross-origin requests |
| `dotenv` | `^16.3.1` | Environment variable loading |
| `concurrently` | `^9.2.1` | Run server + client together in dev |
| `mongoose` | `^9.6.2` | MongoDB ODM — schemas + queries |
| `resend` | `^6.12.3` | Transactional email (sendEmailController) |
| `@google/generative-ai` | `^0.24.0` | Gemini SDK — `gemini-embedding-2` embeddings + `gemini-2.5-flash` LLM |
| `@pinecone-database/pinecone` | `^7.2.0` | Pinecone vector DB client |

### Frontend (inside `client/`)
| Package | Version | Purpose |
|---|---|---|
| `react` | `^18.3.1` | UI library |
| `react-dom` | `^18.3.1` | DOM renderer |
| `react-scripts` | `5.0.1` | CRA build toolchain (webpack, babel) |
| `framer-motion` | `^11.3.0` | Animations (replaces legacy react-reveal) |
| `react-icons` | `^5.2.1` | Icon library (v5 — exports renamed) |
| `react-scroll` | `^1.9.0` | Smooth scroll `<Link>` component |
| `react-scroll-to-top` | `^3.0.0` | Back-to-top floating button |
| `react-vertical-timeline-component` | `^3.6.0` | Education & Work timelines |
| `typewriter-effect` | `^2.21.0` | Animated typewriter text |
| `@emailjs/browser` | `^4.3.3` | Contact form email sending |
| `web-vitals` | `^4.2.0` | Core Web Vitals reporting |

### CDN (loaded in `client/public/index.html`)
- **Bootstrap 5.3.3** — `bootstrap.bundle.min.js` (JS only; CSS is custom)
- **Google Fonts** — Inter (body) + Fira Code (monospace)

---

## 3. Repository Structure

```
Portfolio/
├── server.js                  # Express entry point
├── package.json               # Root — backend deps + all npm scripts
├── .env                       # (gitignored) PORT, MONGO_URI
├── .gitignore                 # Ignores: node_modules, .env, client/build
├── config/
│   └── db.js                  # Mongoose connect(), exits on failure
├── models/
│   ├── Education.js           # { date, title, school, location, grade, order }
│   ├── Work.js                # { date, title, company, location, desc, order }
│   ├── Project.js             # { imageKey, type, typeColor, tags, title, desc, link, order }
│   └── Skill.js               # { name, iconName, order }
├── data/
│   └── seed.js                # Wipes + repopulates all 4 collections
├── controllers/
│   ├── portfolioController.js # sendEmail (Resend) + 4 GET controllers
│   └── chatController.js      # RAG chatbot: embed → Pinecone query → Gemini LLM
├── routes/
│   └── portfolioRoutes.js     # POST /sendEmail + GET /educations /works /projects /skills + POST /chat
├── scripts/
│   ├── dev.bat                # Windows shortcut: npm run dev (pushd to root)
│   ├── start.bat              # Windows shortcut: npm run build + npm start
│   └── ingest.js              # One-time ingestion: MongoDB → gemini-embedding-2 → Pinecone
├── docs/
│   ├── PROJECT_EXPLORATION.md # ← this file
│   ├── INTERVIEW_READINESS.md # Interview Q&A reference
│   ├── TECH_STACK.md          # Full stack breakdown (current + planned)
│   └── MONGODB_SETUP.md       # Complete MongoDB Atlas setup guide
└── client/                    # CRA React app
    ├── package.json
    ├── .gitignore              # /build, /node_modules, .env.*
    ├── public/
    │   └── index.html             # Fonts + Bootstrap CDN links
    └── src/
        ├── index.js           # React root render
        ├── index.css          # Global CSS variables + resets
        ├── App.js             # Root component — hero section + page layout
        ├── App.css            # Hero-specific styles
        ├── context/
        │   └── ThemeContext.js  # Dark/light theme state (default: dark)
        ├── components/
        │   ├── layout/
        │   │   ├── Layout.js    # Fixed sidebar shell; passes expanded state
        │   │   └── Layout.css
        │   ├── menus/
        │   │   ├── Menus.js     # Sidebar nav links (react-scroll Links)
        │   │   └── Menus.css
        │   ├── mobileNav/
        │   │   ├── MobileNav.js # Hamburger nav for <768px
        │   │   └── MobileNav.css
        │   └── chatbot/
        │       ├── Chatbot.js   # Floating RAG chatbot widget (bottom-right avatar)
        │       └── Chatbot.css
        ├── pages/
        │   ├── home/            # Sidebar profile panel (photo, typewriter, theme toggle)
        │   ├── about/           # Glassmorphism card + tech tags
        │   ├── educations/      # VerticalTimeline — fetches /api/v1/ps-portfolio/educations
        │   ├── works/           # VerticalTimeline — fetches /api/v1/ps-portfolio/works
        │   ├── skills/          # CSS grid — fetches /api/v1/ps-portfolio/skills
        │   ├── projects/        # Card grid — fetches /api/v1/ps-portfolio/projects
        │   └── contact/         # Social links + contact form (email via Resend backend)
        └── utils/
            └── SkillsList.js    # iconRegistry: { iconName → React component }
```

---

## 4. Architecture & Data Flow

```
Browser
  │
  ├── Development mode (npm run dev)
  │     ├── React Dev Server :3000  ← webpack-dev-server, HMR, proxies /api → :8080
  │     └── Express :8080           ← API + MongoDB
  │
  └── Production mode (npm start)
        └── Express :8080
              ├── GET  /api/v1/ps-portfolio/educations  ← MongoDB → JSON
              ├── GET  /api/v1/ps-portfolio/works        ← MongoDB → JSON
              ├── GET  /api/v1/ps-portfolio/projects     ← MongoDB → JSON
              ├── GET  /api/v1/ps-portfolio/skills       ← MongoDB → JSON
              ├── POST /api/v1/ps-portfolio/sendEmail    ← Resend transactional email
              ├── POST /api/v1/ps-portfolio/chat         ← RAG chatbot (Gemini + Pinecone)
              └── GET  *  → serves client/build/index.html (SPA fallback)
```

**Email flow:**  
Contact form → Express `POST /api/v1/ps-portfolio/sendEmail` → Resend API → recipient's inbox.  
Real transactional email is handled server-side via the **Resend** SDK using `RESEND_API_KEY`.

**Theme flow:**  
`ThemeContext` stores `"dark"` | `"light"` in React state (default `"dark"`).  
`App.js` applies `className="app-root light-mode"` conditionally.  
All colors are CSS custom properties — switching theme class instantly re-renders the entire UI via CSS cascade.

---

## 5. Frontend Deep-Dive

### App.js — Root Component
- Reads theme from `ThemeContext`
- Renders: `MobileNav` → `Layout` (sidebar) → `.main-content`
- `.main-content` contains: Hero section → About → Educations → Works → Skills → Projects → Contact → Footer
- Hero section has framer-motion entrance animation, Typewriter roles, "Get in Touch" smooth-scroll, "Download CV" link
- `<Chatbot />` floating widget mounted after `<ScrollToTop />`

### Layout.js — Sidebar Shell
- Manages `expanded` boolean state (default: `true`)
- Toggle button uses `RiMenuFoldLine` / `RiMenuUnfoldLine` from react-icons
- Passes `expanded` to both `Home` (profile panel) and `Menus` (nav labels)
- CSS classes: `.sidebar`, `.sidebar--expanded` (240px), `.sidebar--collapsed` (72px)

### Menus.js — Navigation
```js
const navItems = [
  { to: "home", label: "Home", Icon: ... },
  { to: "about", label: "About", Icon: ... },
  { to: "education", label: "Education", Icon: ... },
  { to: "work", label: "Work", Icon: ... },
  { to: "skills", label: "Skills", Icon: ... },
  { to: "project", label: "Projects", Icon: ... },
  { to: "contact", label: "Contact", Icon: ... },
];
```
Uses `react-scroll <Link>` with `smooth`, `offset`, `duration` props.

### ThemeContext.js
```js
// Default theme
const [theme, setTheme] = useState("dark");
```
Exposes `[theme, setTheme]` via `useTheme()` hook.

### Skills — SkillsList.js
`iconRegistry` object that maps icon name strings to React icon components, e.g. `{ SiTypescript: SiTypescript, ... }`. Used by `Skills.js` to look up the correct icon after fetching skill data (which stores `iconName` strings) from MongoDB.

### Projects Data
| Project | Type | Stack | GitHub |
|---|---|---|---|
| Portfolio Website | Full-Stack | Node, Express, React, MongoDB | github.com/Sentinel05/PS_Portfolio |
| Tic Tac Toe | Back-End | C++, Backtracking, AI | github.com/Sentinel05/Tic-Tac-Toe |
| Supermarket Portal | Back-End | C++, File Management | github.com/Sentinel05/Supermarket-Portal |

### Animations Pattern
All page sections use framer-motion `whileInView` with `viewport={{ once: true }}`:
```js
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

---

## 6. Backend Deep-Dive

### server.js
```
Express app
  connectDB()                       # Mongoose connect to Atlas on startup
  cors()                            # Allow all origins
  express.json()                    # Parse JSON bodies
  express.static('./client/build')  # Serve React production build
  /api/v1/ps-portfolio/*            # API routes
  GET *                             # SPA fallback → index.html
  PORT = process.env.PORT || 8080
```

### portfolioController.js
- `sendEmailController` — sends real transactional email via **Resend** SDK using `RESEND_API_KEY` and `GMAIL_USER` env vars.
- `getEducationsController` — `Education.find().sort({ order: 1 })`
- `getWorksController` — `Work.find().sort({ order: 1 })`
- `getProjectsController` — `Project.find().sort({ order: 1 })`
- `getSkillsController` — `Skill.find().sort({ order: 1 })`

### chatController.js
RAG pipeline (singleton clients initialized once per server process):
1. Embeds visitor query with `gemini-embedding-2` (`outputDimensionality: 768`)
2. Queries Pinecone index `ps-portfolio` namespace `portfolio` for top-5 matches
3. Builds system prompt with retrieved context chunks
4. Sends to `gemini-2.5-flash` via `startChat()` → returns answer text

> **Model note:** `text-embedding-004` and `gemini-1.5-flash` return 404 on the free AI Studio key. Use `gemini-embedding-2` and `gemini-2.5-flash`.

### scripts/ingest.js
One-time ingestion (run with `npm run ingest`):
1. Connects to MongoDB Atlas, fetches all 4 collections
2. Builds 12 text chunks: 1 bio + 3 education + 3 work + 3 project + 1 skills + 1 contact
3. Embeds each chunk via `gemini-embedding-2` (`outputDimensionality: 768`)
4. Upserts to Pinecone with `{ records: [...] }` (note: not a bare array)

### portfolioRoutes.js
| Method | Path | Handler |
|---|---|---|
| POST | `/sendEmail` | `sendEmailController` |
| GET | `/educations` | `getEducationsController` |
| GET | `/works` | `getWorksController` |
| GET | `/projects` | `getProjectsController` |
| GET | `/skills` | `getSkillsController` |
| POST | `/chat` | `chatController` |

---

## 7. Design System

### CSS Custom Properties (index.css)

| Variable | Dark | Light | Usage |
|---|---|---|---|
| `--bg` | `#070d1a` | `#f1f5f9` | Page background |
| `--surface` | `#0f1e38` | `#ffffff` | Cards, panels |
| `--accent` | `#7c3aed` | `#7c3aed` | Primary purple |
| `--accent3` | `#06b6d4` | `#0284c7` | Cyan (work timeline) |
| `--text` | `#e2e8f0` | `#0f172a` | Body text |
| `--sidebar-bg` | `#060c18` | `#060c18` | Always dark sidebar |
| `--sidebar-width` | 240px | — | Expanded sidebar |
| `--sidebar-collapsed` | 72px | — | Collapsed sidebar |

### Utility Classes
| Class | Description |
|---|---|
| `.app-root` | Full-height flex container |
| `.main-content` | `margin-left: var(--sidebar-width)` — offset for sidebar |
| `.glass-card` | Glassmorphism card with backdrop-filter blur |
| `.section-heading` | Gradient text heading (purple → violet) |
| `.section-divider` | Accent-colored `<hr>` |
| `.footer` | Centered footer text |

### Typography
- Body: `Inter` (Google Fonts)
- Monospace / code: `Fira Code` (Google Fonts)

---

## 8. Third-Party Integrations

### EmailJS
> **EmailJS is no longer used for the contact form.** Email is now sent server-side via the **Resend** SDK (`RESEND_API_KEY` in `.env`). The `@emailjs/browser` package remains in `client/package.json` but is unused in the current codebase.

### Resend (Contact Email)
- Backend sends email via `POST /api/v1/ps-portfolio/sendEmail`
- Uses `RESEND_API_KEY` and `GMAIL_USER` from `.env`
- `from`: `"Portfolio Contact <onboarding@resend.dev>"`
- `reply_to`: visitor's email address

### Social Links (Contact.js)
| Platform | URL |
|---|---|
| LinkedIn | linkedin.com/in/priyanshu-sarkar-79464b242 |
| WhatsApp | api.whatsapp.com/send?phone=7904953079 |
| Gmail | psarkar.work05@gmail.com |
| GitHub | github.com/Sentinel05 |

---

## 9. NPM Scripts Reference

Run from the **root** (`e:\Coding\Portfolio`):

| Script | Command | Effect |
|---|---|---|
| `npm start` | `node server.js` | Production server on :8080 |
| `npm run dev` | `concurrently "npm run server" "npm run client"` | Dev: Express :8080 + React :3000 |
| `npm run build` | `npm install --prefix client --legacy-peer-deps && npm run build --prefix client` | Installs client deps then creates CRA production build → `client/build/` |
| `npm run server` | `node server.js` | Express only |
| `npm run client` | `npm start --prefix client` | React dev server only |
| `npm run ingest` | `node scripts/ingest.js` | One-time chatbot ingestion: MongoDB → Gemini embeddings → Pinecone |
| `npm run install-all` | Install root + client deps | Use `--legacy-peer-deps` for client |

### Windows Batch Files
| File | Equivalent |
|---|---|
| `scripts/dev.bat` | `npm run dev` (with Node PATH fallback, pushd to project root) |
| `scripts/start.bat` | `npm run build` then `npm start` |
| `scripts/ingest.bat` | `npm run ingest` (chatbot ingestion — run once after setup or after content changes) |

---

## 10. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Express server port (default `8080`) |
| `MONGO_URI` | **Yes** | MongoDB Atlas connection string |
| `RESEND_API_KEY` | **Yes** | Resend API key for transactional email |
| `GMAIL_USER` | **Yes** | Recipient email address for contact form messages |
| `GEMINI_API_KEY` | **Yes** | Google AI Studio API key (free tier) — used for embeddings + LLM |
| `PINECONE_API_KEY` | **Yes** | Pinecone API key |
| `PINECONE_INDEX` | **Yes** | Pinecone index name (e.g. `ps-portfolio`, 768 dims, cosine, serverless) |

Set in `.env` at the project root (gitignored). On Render, set via the **Environment** tab in the service dashboard — no changes to build/start commands are needed.

---

## 11. Git & Version Control Notes

- `.gitignore` (root) ignores: `node_modules/`, `.env`, `/client/node_modules/`, `/client/build/`
- `client/.gitignore` ignores: `/node_modules`, `/build`, `.env.*`, coverage, pnp files
- `client/build/` was previously committed; removed in commit `6998b6f` (chore: untrack client/build from version control)
- After cloning, `client/build/` will not exist — run `npm run build` before `npm start`

---

## 12. Known Issues & Gotchas

| Issue | Detail |
|---|---|
| react-icons v5 breaking changes | `SiVisualstudiocode` was renamed to `SiVscodium`; always check v5 migration guide |
| CRA install | `npm install --prefix client` requires `--legacy-peer-deps` to avoid peer dep conflicts |
| Node not in PATH (Windows) | Node installed at `C:\Program Files\nodejs\`; added to user PATH via PowerShell. Use `scripts/dev.bat` as fallback |
| Production build required for `npm start` | Express serves `client/build/` — if the folder doesn't exist, the frontend 404s |
| Email via Resend | Backend `sendEmailController` uses Resend SDK. Requires `RESEND_API_KEY` and `GMAIL_USER` in `.env`. The `@emailjs/browser` package is still installed client-side but no longer used. |
| Node.js DNS / c-ares (Windows) | `querySrv ECONNREFUSED` on MongoDB SRV lookup — Windows firewall blocks Node.js c-ares on port 53. Fix: `dns.setServers(["8.8.8.8", "8.8.4.4"])` added to `config/db.js` and `data/seed.js`. See [MONGODB_SETUP.md §9](MONGODB_SETUP.md#9-windows-dns--c-ares-issue-and-fix) |
| URI password special chars | `@` in Atlas password breaks URI parsing. Must URL-encode as `%40`. See [MONGODB_SETUP.md §7](MONGODB_SETUP.md#7-url-encoding-special-characters-in-passwords) |
| Gemini model names (API key specific) | `text-embedding-004` and `gemini-1.5-flash` return 404 on the free AI Studio tier. Use `gemini-embedding-2` (768 dims via `outputDimensionality`) and `gemini-2.5-flash` instead |
| Pinecone upsert call signature | `index.upsert()` takes `{ records: [...] }` object — NOT a bare array. Passing an array directly throws `PineconeArgumentError: Must pass in at least 1 record` |
| Chatbot ingestion must be re-run on content change | `npm run ingest` is a one-time script. If MongoDB data changes (new job, project, etc.), re-run it to refresh the Pinecone vectors |

---

## 13. Personal Data in the Project

| Data | Location | Type |
|---|---|---|
| Full name | App.js, About.js, Home.js | Display |
| Profile photo | `client/src/assets/images/cool-dp.jpg` | Image |
| About photo | `client/src/assets/images/Priyanshu.jpg` | Image |
| Chatbot avatar | `client/src/assets/images/chatbot-avatar.png` | Image |
| Resume PDF | `client/src/assets/documents/Priyanshu_Sarkar.pdf` | Document |
| WhatsApp number | Home.js, Contact.js | Link |
| Gmail address | Contact.js | Link |
| LinkedIn URL | Contact.js | Link |
| GitHub URL | Contact.js, Projects.js | Link |
| Work history | MongoDB `works` collection | Text data (via API) |
| Education history | MongoDB `educations` collection | Text data (via API) |
| Project screenshots | `client/src/assets/images/` | Images |
