# Portfolio — React Client

The frontend for [Priyanshu Sarkar's portfolio](https://github.com/Sentinel05/PS_Portfolio). Built with Create React App (React 18.3.1).

> **Note:** This folder is the `client/` subfolder of the monorepo. All `npm run` commands for the full stack (dev, build, start) should be run from the **root** of the monorepo, not here.

---

## Overview

| Item | Value |
|---|---|
| Framework | Create React App (CRA) — `react-scripts 5.0.1` |
| React version | 18.3.1 |
| Dev port | `3000` |
| API proxy | All `/api/` requests forwarded to `http://localhost:8080` |
| Production build output | `client/build/` (served by Express) |

---

## Key Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Welcome` | Landing page — Guest (name capture) or Admin role selection |
| `/portfolio/*` | `Portfolio` | Public portfolio SPA with sidebar nav |
| `/admin/login` | `AdminLogin` | Admin login form |
| `/admin` | `AdminPortfolio` | JWT-protected Admin CMS (CRUD + visitor dashboard) |

---

## Available Scripts

Run these from **inside the `client/` folder**:

### `npm start`
Starts the React development server on port `3000`.  
API calls to `/api/*` are proxied to `http://localhost:8080` via the `proxy` field in `package.json`.

### `npm run build`
Creates an optimised production build in `client/build/`.  
Express serves this folder in production.

### `npm test`
Runs tests with Jest + React Testing Library in interactive watch mode.

---

## Dev Setup (from monorepo root)

```bash
# Install client dependencies
npm install --prefix client --legacy-peer-deps

# Start both Express + React dev server
npm run dev
```

> `--legacy-peer-deps` is required because `react-scripts 5.0.1` has peer dependency conflicts with the latest `@testing-library` packages.

---

## Environment

The client uses no `.env` — all secrets live in the root `.env` on the server side.  
The API proxy (`"proxy": "http://localhost:8080"` in `package.json`) handles all backend calls in development.

---

## Structure

```
client/src/
├── index.js          # React root: BrowserRouter → ThemeProvider → AuthProvider
├── App.js            # Routes + Portfolio component
├── context/
│   ├── ThemeContext.js   # Dark/light theme state
│   └── AuthContext.js    # JWT auth state (localStorage: admin_token)
├── components/
│   ├── layout/       # Fixed sidebar shell
│   ├── menus/        # Sidebar nav links (react-scroll); includes Certifications nav item
│   ├── mobileNav/    # Hamburger nav (< 768px)
│   ├── chatbot/      # Floating RAG chatbot widget (figure ↔ avatar dual-state, multi-turn history, markdown)
│   ├── visitorMap/   # SVG choropleth world map (react-simple-maps, indigo→cyan by visit intensity)
│   └── ProtectedRoute.js
├── pages/
│   ├── welcome/      # Landing page (role selection + guest name capture)
│   ├── home/         # Sidebar profile panel
│   ├── about/
│   ├── educations/
│   ├── works/
│   ├── skills/       # Grouped by category (Languages, Frontend, Frameworks & Libraries, Databases, DevOps, Tools)
│   ├── certifications/ # Certificate cards with external link; color-coded by issuer
│   ├── projects/
│   ├── contact/
│   ├── notFound/     # Custom 404 page (gradient heading + Back to Home button)
│   └── admin/        # AdminLogin (→ POST /api/v1/ps-portfolio/admin/login) + AdminPortfolio (CRUD, analytics, Re-Ingest button)
└── utils/
    └── SkillsList.js  # iconName → React icon component registry
```

