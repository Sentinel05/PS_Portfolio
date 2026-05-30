# Portfolio — Interview Readiness Guide

> Use this to prep for technical and behavioral interviews where you present or discuss this portfolio project.

---

## Quick Elevator Pitch

> "I built a full-stack MERN portfolio using React 18, Node/Express, and MongoDB Atlas. The frontend is a single-page app with a Welcome landing page for role selection (guest or admin), a collapsible sidebar, smooth-scroll navigation, auto-detecting dark/light theme powered by CSS custom properties (light 6am–6pm, dark otherwise with manual override), and framer-motion animations. The backend is an Express server connected to MongoDB Atlas — it serves all portfolio content via REST APIs, handles JWT-authenticated admin login, and supports a full CRUD Admin CMS for managing all portfolio content directly from a UI. The contact form sends emails server-side via the Resend API, and I also implemented a RAG-based AI chatbot (bottom-right floating widget) that uses Google Gemini embeddings and Pinecone vector search to answer visitor questions about my portfolio. The admin portal also includes a comprehensive analytics dashboard with visitor stats, content counts, interactive SVG bar charts (daily, monthly, day-of-week, peak hours), top returning visitors, and a filterable, sortable, paginated visitor log. I designed and implemented the entire project from scratch — architecture, UI/UX, data modeling, API layer, auth, Admin CMS, analytics dashboard, RAG pipeline, and git hygiene."

---

## Core Q&A

### Architecture & Design

**Q: What is the architecture of this project?**  
A: It's a monorepo with two layers. The backend is an Express server at the root level — it serves the production React build as static files and exposes REST API routes. The frontend is a CRA (Create React App) React 18 SPA inside the `client/` subfolder. In development, both run independently (Express on :8080, React dev server on :3000 with HMR). In production, Express alone serves everything on :8080.

**Q: Why use Express if the frontend handles everything?**  
A: Express is there for production serving (static files + SPA fallback route), environment-specific configuration via `.env`, MongoDB Atlas integration (all portfolio content is stored in and served from the database), server-side email sending via Resend, and the RAG chatbot pipeline (`POST /api/v1/ps-portfolio/chat`). It's also a ready API layer designed to be extended further — for example, to add authentication and a content management UI.

**Q: How do you handle routing in an SPA with Express?**  
A: Express has a wildcard GET route (`app.get("*", ...)`) at the bottom that always returns `client/build/index.html`. React Router (or react-scroll in this case) handles the in-page navigation client-side. This prevents 404s on hard refresh.

**Q: Why react-scroll instead of React Router?**  
A: This portfolio is a single page — all sections live on one HTML page and users scroll between them. react-scroll provides anchor-based smooth scrolling with offset compensation for the fixed sidebar, which is exactly the UX I wanted. React Router would add URL-based navigation which is unnecessary overhead for a single-page document layout.

---

### Frontend

**Q: Walk me through the component tree.**  
A: `index.js` wraps everything in `BrowserRouter → ThemeProvider → AuthProvider`. `App.js` uses React Router v6 `<Routes>` to map: `/` → `Welcome` (role selection landing), `/portfolio/*` → `Portfolio` (the SPA), `/admin/login` → `AdminLogin`, `/admin` → `ProtectedRoute(AdminPortfolio)`. The `Portfolio` component renders `MobileNav` (mobile only), `Layout` (fixed sidebar with `Home` profile panel + `Menus` nav), and `.main-content` with all the portfolio sections. A floating `← Home` button lets guests return to the Welcome page without reloading.

**Q: How does the dark/light theme work?**  
A: I use a React Context (`ThemeContext`) that stores a `"dark"` or `"light"` string. The theme **auto-initialises** based on the time of day: if it's 6 am to 6 pm, the initial theme is light; outside those hours it's dark. The user can still toggle manually via the sun/moon icon in the sidebar. `App.js` conditionally adds the `light-mode` class to the root div. All colors are defined as CSS custom properties on `:root` (dark defaults). The `.light-mode` class overrides those variables — including switching the sidebar to a white background with purple accents. Switching theme is instant: no JavaScript DOM manipulation beyond toggling a class.

**Q: Why framer-motion instead of CSS animations?**  
A: framer-motion gives declarative, React-aware animations. `whileInView` with `viewport={{ once: true }}` means an element only animates once when it scrolls into view — you don't need `IntersectionObserver` boilerplate. `whileHover` on project cards provides instant interactive feedback. It also replaces `react-reveal` which was abandoned and incompatible with React 18.

**Q: How does the sidebar collapse work?**  
A: `Layout.js` holds an `expanded` boolean in local state. A toggle button swaps between `RiMenuFoldLine` and `RiMenuUnfoldLine` icons. The sidebar CSS class switches between `.sidebar--expanded` (240px width) and `.sidebar--collapsed` (72px). Both the profile panel (`Home.js`) and nav labels (`Menus.js`) receive `expanded` as a prop and conditionally render their text content. CSS transition on `width` provides the smooth animation.

**Q: How did you handle the React 18 upgrade?**  
A: The main breaking change was `react-reveal` being incompatible with React 18's concurrent rendering. I replaced it with framer-motion 11, which has full React 18 support. I also updated react-icons from v4 to v5, which required fixing renamed exports (e.g., `SiVisualstudiocode` → `SiVscodium`).

**Q: What is the CSS architecture?**  
A: I use a design-token approach with CSS custom properties defined in `index.css`. Variables cover colors, spacing, sidebar dimensions, shadows, and gradients. Component-level CSS files (e.g., `Layout.css`, `Projects.css`) reference these tokens. This makes theming and design changes a single-point update. In light mode, the sidebar switches to a white background with purple accents — the full `.light-mode` override is applied consistently across sidebar, nav, hero section, and buttons. No CSS preprocessor (Sass/Less) — vanilla CSS with custom properties is sufficient and keeps the build lighter.

---

### Backend

**Q: What does the Express server actually do?**  
A: Five things: (1) on startup, it upserts admin credentials from env vars into MongoDB so the login always reflects the current `.env`; (2) connects to MongoDB Atlas via Mongoose and serves portfolio content through public GET endpoints; (3) serves the `client/build/` static bundle in production via `express.static`; (4) exposes all API routes under `/api/v1/` — public endpoints for portfolio data, email, chatbot, and visit logging, plus JWT-protected CRUD routes and an admin login endpoint with bcrypt verification; (5) falls back to `index.html` for any unmatched GET so React Router navigation works on refresh. CORS is enabled globally for development flexibility.

**Q: How does the contact form work end-to-end?**  
A: The user fills in name, email, and message. On submit, the form data is sent to `POST /api/v1/ps-portfolio/sendEmail` on the Express backend. The controller uses the **Resend** SDK to send a transactional email to my Gmail. The visitor's email is set as `reply_to` so I can reply directly. No email data is exposed in the client — only the Resend API key lives in `.env` on the server.

**Q: Are the email credentials safe?**  
A: The Resend API key and recipient address are stored in `.env` (gitignored) and only exist on the server. They are never sent to or exposed in the browser. This is more secure than the previous EmailJS approach where credentials lived in client-side code.

---

### Build & DevOps

**Q: How do you run the project in development vs production?**  
A: Development: `npm run dev` runs Express and the React dev server concurrently using the `concurrently` package. The React dev server has hot module replacement (HMR) and proxies `/api` calls to Express on :8080. Production: `npm run build` creates an optimized static bundle in `client/build/`, then `npm start` runs Express which serves that bundle. On Windows, `dev.bat` and `start.bat` handle this with a fallback for the Node.js PATH. The chatbot ingestion (`npm run ingest`) is a one-time setup step — re-run it whenever MongoDB content changes.

**Q: Why is `client/build/` gitignored?**  
A: Build artifacts are generated output, not source code. Committing them bloats the repo, causes unnecessary merge conflicts, and gives a false impression of what the project actually contains. Anyone cloning the repo runs `npm run build` to regenerate it. CI/CD pipelines also build fresh artifacts — they never consume committed builds.

**Q: What is the install process for a new developer?**  
A:
```bash
git clone <repo>
cd Portfolio
npm install                                           # backend deps
npm install --prefix client --legacy-peer-deps        # frontend deps
# Add MONGO_URI, RESEND_API_KEY, GMAIL_USER, GEMINI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX to .env
npm run ingest                                        # one-time chatbot ingestion
npm run dev                                           # start both servers
```
The `--legacy-peer-deps` flag is needed because `react-scripts 5.0.1` has strict peer dep requirements that conflict with the latest `@testing-library` packages.

**Q: How is concurrently used?**  
A: `concurrently` runs multiple npm scripts in parallel in a single terminal with prefixed, color-coded output. The root `package.json` defines:
```json
"dev": "concurrently \"npm run server\" \"npm run client\""
```

---

### Data & Content

**Q: Where is the portfolio data stored?**
A: All content (work history, education, projects, skills, certifications) is stored in **MongoDB Atlas** (free M0 cluster). Each collection has a Mongoose schema. The Express backend exposes public GET endpoints (`/api/v1/ps-portfolio/educations`, `/works`, `/projects`, `/skills`, `/certifications`) that query MongoDB sorted by an `order` field. React page components use `useEffect` + `fetch` to load this data on mount instead of hardcoding arrays. The certifications page additionally sorts results by date (newest first) on the client side after fetching.

**Q: How does the chatbot work?**
A: It uses a RAG (Retrieval-Augmented Generation) pattern. At setup time, `npm run ingest` fetches all MongoDB collections plus static bio/contact text, embeds each chunk using `gemini-embedding-2` (768-dimensional vectors), and upserts them into a Pinecone serverless index (13 vectors total). At query time, `POST /api/v1/ps-portfolio/chat` embeds the visitor's question, runs a top-8 similarity search in Pinecone, filters out low-confidence matches (score < 0.45), retrieves the most relevant portfolio chunks, injects the last 6 turns of conversation history, builds a grounded system prompt, and sends it to `gemini-2.5-flash` to generate the final answer. The answer is displayed in a floating chat widget — a full-body figure with a speech bubble in idle state that morphs into a small avatar when the chat opens. Bot responses support **bold**, `inline code`, and bullet-list markdown.

**Q: How would you scale this further?**
A: The core CMS is in place. The chatbot already has multi-turn history (last 6 turns), score filtering, and markdown rendering. Next steps: automate re-ingestion via a webhook whenever admin content changes. On the infrastructure side: a CI/CD pipeline (GitHub Actions → Render) for zero-touch deploys, and TypeScript migration on the frontend for type safety. At scale, the MongoDB Atlas free tier would need upgrading, and I’d add request-rate limiting and caching (Redis) on the API layer.

**Q: Why not keep the data hardcoded?**
A: Hardcoded data couples content to code — every update requires a code change, a build, and a redeploy. With MongoDB-backed APIs, content changes are a database write. This is the foundation for the planned admin CMS where I can update the portfolio from a UI without touching source code.

---

## Behavioral / Situational

**Q: What was the most challenging part of building this?**  
A: The dependency upgrade. `react-reveal` was incompatible with React 18 — I had to evaluate alternatives, choose framer-motion, and rewrite every animation across 10+ components while keeping the UX consistent. react-icons v5 also had breaking renames that required tracking down each icon individually.

**Q: What design decisions are you proud of?**  
A: Two in particular. First, the CSS custom property system. By defining all design tokens in one place (`:root` in index.css), the entire dark/light theme switch is a single CSS class toggle — no JavaScript-driven style injection. It's performant, maintainable, and makes future redesigns a configuration change rather than a codebase-wide find-and-replace. Second, the analytics dashboard. Rather than just showing a raw visitor table, I built a full SVG chart suite (daily, monthly, day-of-week, peak hours) using only React state and SVG primitives — no third-party chart library. This keeps the bundle lean while delivering interactive, gradient-styled visuals.

**Q: What would you improve if you had more time?**  
A: 
1. **Unit tests** — add React Testing Library tests for core components and Jest tests for controllers.
2. **CI/CD pipeline** — GitHub Actions to auto-build and deploy to Render on push to main.
3. **TypeScript** — migrate the frontend to TypeScript for type safety.
4. **Accessibility (a11y)** — audit and improve ARIA roles, keyboard navigation, contrast ratios.
5. **Automated re-ingestion** — trigger `npm run ingest` via webhook whenever admin CMS content changes, keeping Pinecone vectors always in sync.

**Q: How did you approach the responsive design?**  
A: The sidebar is fixed and always visible on desktop (≥768px). On mobile, it's hidden and replaced by `MobileNav` — a hamburger menu that overlays the page. CSS media queries at the `768px` breakpoint handle the switch. The main content sections use CSS Grid (`auto-fill minmax`) for the skills and project cards, so they naturally reflow at any viewport width.

---

## Key Numbers to Remember

| Metric | Value |
|---|---|
| React version | 18.3.1 |
| framer-motion version | 11.3.0 |
| react-icons version | 5.2.1 |
| Backend port | 8080 |
| Dev frontend port | 3000 |
| Sidebar expanded width | 240px |
| Sidebar collapsed width | 72px |
| Light mode hours | 6 am – 6 pm (auto-detected on load) |
| Sidebar in light mode | White background (`#ffffff`) with purple accents |
| Number of skills listed | 29 (grouped into 6 categories: Languages, Frontend, Frameworks & Libraries, Databases, DevOps, Tools) |
| Number of certifications listed | 6 (sorted newest-first on the public page) |
| Number of projects listed | 3 |
| Work history entries | 3 (Intern at Micro Focus → ASE at OpenText → SE at OpenText) |
| Education entries | 3 (10th, 12th, B.E.) |
| MongoDB collections | 7 (educations, works, projects, skills, certifications, admin, visits) |
| Admin dashboard charts | 4 SVG charts: daily (14d), monthly (6mo), peak hours (0–23h), day-of-week |
| Visitor table pagination | 10 rows/page, filter by name, sort by name or date |
| Pinecone vectors | 13 (1 bio + 3 edu + 3 work + 3 project + 1 skills + 1 certs + 1 contact) |

---

## Tech Buzzwords You Can Drop Naturally

- **SPA** (Single Page Application) with client-side routing
- **Design tokens** via CSS custom properties
- **Glassmorphism** UI (backdrop-filter blur on cards)
- **Monorepo** with co-located backend and frontend
- **Concurrent rendering** (React 18)
- **`whileInView` scroll-triggered animations** (framer-motion)
- **Static serving** with Express SPA fallback
- **JWT** (JSON Web Token) — 8-hour signed tokens for stateless auth
- **bcryptjs** — password hashing with cost factor 12
- **Protected routes** — `ProtectedRoute` component redirects to `/` without a valid JWT
- **Admin CMS** — inline add/edit/delete UI for all MongoDB collections
- **Visitor analytics** — visit log + dashboard with unique visitor and 7-day stats
- **CRA** (Create React App) with `react-scripts`
- **`concurrently`** for parallel dev processes
- **CSS cascade** for zero-JS theme switching
- **Mongoose ODM** with MongoDB Atlas M0
- **RAG** (Retrieval-Augmented Generation) — chatbot with Gemini embeddings + Pinecone vector search
- **Seed script** for initial DB population
- **CRA proxy** for dev-mode API forwarding
- **Resend** transactional email API (server-side, no client credentials exposed)
