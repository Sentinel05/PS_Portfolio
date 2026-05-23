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
├── .env                       # (gitignored) PORT, secrets
├── .gitignore                 # Ignores: node_modules, .env, client/build
├── dev.bat                    # Windows shortcut: npm run dev
├── start.bat                  # Windows shortcut: npm run build + npm start
├── README.md                  # User-facing setup guide
├── PROJECT_EXPLORATION.md     # ← this file
├── INTERVIEW_READINESS.md     # Interview Q&A reference
│
├── controllers/
│   └── portfolioController.js # sendEmailController (placeholder — real email via EmailJS)
├── routes/
│   └── portfolioRoutes.js     # POST /api/v1/potfolio/sendEmail
│
└── client/                    # CRA React app
    ├── package.json
    ├── .gitignore              # /build, /node_modules, .env.*
    ├── public/
    │   └── index.html         # Fonts + Bootstrap CDN links
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
        │   └── mobileNav/
        │       ├── MobileNav.js # Hamburger nav for <768px
        │       └── MobileNav.css
        ├── pages/
        │   ├── home/            # Sidebar profile panel (photo, typewriter, theme toggle)
        │   ├── about/           # Glassmorphism card + tech tags
        │   ├── educations/      # VerticalTimeline — academic history
        │   ├── works/           # VerticalTimeline — work history
        │   ├── skills/          # CSS grid of skill icons
        │   ├── projects/        # Card grid with badges and GitHub links
        │   └── contact/         # Social links + EmailJS contact form
        └── utils/
            └── SkillsList.js    # Exported array of { _id, name, icon } objects
```

---

## 4. Architecture & Data Flow

```
Browser
  │
  ├── Development mode (npm run dev)
  │     ├── React Dev Server :3000  ← webpack-dev-server, HMR
  │     └── Express :8080           ← API only
  │
  └── Production mode (npm start)
        └── Express :8080
              ├── GET  /api/v1/potfolio/sendEmail  ← placeholder API
              └── GET  *  → serves client/build/index.html (SPA fallback)
```

**Email flow:**  
Contact form → `@emailjs/browser` → EmailJS cloud → recipient's inbox.  
The Express API endpoint (`/sendEmail`) is a **placeholder stub** — it returns 200 but does not send email. All real email sending happens client-side via EmailJS SDK.

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
20 skills total including: TypeScript, JavaScript, C++, HTML, CSS, C, Java, Python, Angular, React, SQL, Jest, Postman, RESTful APIs, VS Code, Jupyter, Turbo C++, SDN, Wi-Fi, Networking.

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
  cors()                        # Allow all origins
  express.json()                # Parse JSON bodies
  express.static('./client/build')   # Serve React production build
  /api/v1/potfolio/*            # API routes (note: typo "potfolio" in URL)
  GET *                         # SPA fallback → index.html
  PORT = process.env.PORT || 8080
```
> **Note:** The API base path has a typo — `potfolio` (missing 'r'). Do not fix without updating all consumers.

### portfolioController.js
Currently a **stub** — `sendEmailController` always returns `200 { success: true }`.  
Real email is handled entirely client-side by `@emailjs/browser`.

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
- **Service ID:** `service_6evilyb`
- **Template ID:** `template_c64o3se`
- **Public Key:** `XPlopKMKr2oWOtoHd`
- Contact form fields: `from_name`, `to_name`, `from_email`, `message`
- These are **public** credentials (safe to expose client-side per EmailJS model)

### Social Links (Contact.js)
| Platform | URL |
|---|---|
| LinkedIn | linkedin.com/in/priyanshu-sarkar-79464b242 |
| WhatsApp | api.whatsapp.com/send?phone=7904953079 |
| Gmail | ps30.official@gmail.com |
| GitHub | github.com/Sentinel05 |

---

## 9. NPM Scripts Reference

Run from the **root** (`e:\Coding\Portfolio`):

| Script | Command | Effect |
|---|---|---|
| `npm start` | `node server.js` | Production server on :8080 |
| `npm run dev` | `concurrently "npm run server" "npm run client"` | Dev: Express :8080 + React :3000 |
| `npm run build` | `npm run build --prefix client` | CRA production build → `client/build/` |
| `npm run server` | `node server.js` | Express only |
| `npm run client` | `npm start --prefix client` | React dev server only |
| `npm run install-all` | Install root + client deps | Use `--legacy-peer-deps` for client |

### Windows Batch Files
| File | Equivalent |
|---|---|
| `dev.bat` | `npm run dev` (with Node PATH fallback) |
| `start.bat` | `npm run build` then `npm start` |

---

## 10. Environment Variables

Create a `.env` file in the root:

```
PORT=8080
```

No other required variables for base operation. EmailJS credentials are hardcoded client-side (safe per EmailJS design).

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
| API URL typo | Route is `/api/v1/potfolio/sendEmail` (missing 'r') — intentional legacy |
| react-icons v5 breaking changes | `SiVisualstudiocode` was renamed to `SiVscodium`; always check v5 migration guide |
| CRA install | `npm install --prefix client` requires `--legacy-peer-deps` to avoid peer dep conflicts |
| Node not in PATH (Windows) | Node installed at `C:\Program Files\nodejs\`; added to user PATH via PowerShell. Use `dev.bat` as fallback |
| Production build required for `npm start` | Express serves `client/build/` — if the folder doesn't exist, the frontend 404s |
| EmailJS stub | Backend `/sendEmail` endpoint is a stub; do not rely on it for actual email |

---

## 13. Personal Data in the Project

| Data | Location | Type |
|---|---|---|
| Full name | App.js, About.js, Home.js | Display |
| Profile photo | `client/src/assets/images/cool-dp.jpg` | Image |
| About photo | `client/src/assets/images/Priyanshu.jpg` | Image |
| Resume PDF | `client/src/assets/documents/Priyanshu_Sarkar.pdf` | Document |
| WhatsApp number | Home.js, Contact.js | Link |
| Gmail address | Contact.js | Link |
| LinkedIn URL | Contact.js | Link |
| GitHub URL | Contact.js, Projects.js | Link |
| Work history | Works.js | Text data |
| Education history | Educations.js | Text data |
| Project screenshots | `client/src/assets/images/` | Images |
