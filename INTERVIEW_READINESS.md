# Portfolio — Interview Readiness Guide

> Use this to prep for technical and behavioral interviews where you present or discuss this portfolio project.

---

## Quick Elevator Pitch

> "I built a full-stack personal portfolio using React 18 and Node/Express. The frontend is a single-page app with a collapsible sidebar, smooth-scroll navigation, dark/light theming powered by CSS custom properties, and framer-motion animations. The backend is a lightweight Express server that serves the production React build as static files and exposes a REST API. The contact form is integrated with EmailJS so messages go directly to my inbox without a backend email service. I designed and implemented the entire project from scratch — architecture, UI/UX, CI-ready build pipeline, and git hygiene."

---

## Core Q&A

### Architecture & Design

**Q: What is the architecture of this project?**  
A: It's a monorepo with two layers. The backend is an Express server at the root level — it serves the production React build as static files and exposes REST API routes. The frontend is a CRA (Create React App) React 18 SPA inside the `client/` subfolder. In development, both run independently (Express on :8080, React dev server on :3000 with HMR). In production, Express alone serves everything on :8080.

**Q: Why use Express if the frontend handles everything?**  
A: Express is there for production serving (static files + SPA fallback route), environment-specific configuration via `.env`, and a ready API layer (`/api/v1/potfolio/*`) that can be extended later — for example, to add server-side email processing, authentication, or a database connection. The contact form currently uses EmailJS client-side, but the API stub is already wired.

**Q: How do you handle routing in an SPA with Express?**  
A: Express has a wildcard GET route (`app.get("*", ...)`) at the bottom that always returns `client/build/index.html`. React Router (or react-scroll in this case) handles the in-page navigation client-side. This prevents 404s on hard refresh.

**Q: Why react-scroll instead of React Router?**  
A: This portfolio is a single page — all sections live on one HTML page and users scroll between them. react-scroll provides anchor-based smooth scrolling with offset compensation for the fixed sidebar, which is exactly the UX I wanted. React Router would add URL-based navigation which is unnecessary overhead for a single-page document layout.

---

### Frontend

**Q: Walk me through the component tree.**  
A: The root is `App.js`. It renders a `MobileNav` (visible only on mobile), a `Layout` (fixed sidebar shell), and a `.main-content` div. The sidebar holds `Home` (profile panel) and `Menus` (navigation links). The main content has a hero section defined directly in App.js, followed by lazy-animated page sections: About, Educations, Works, Skills, Projects, Contact, and a Footer.

**Q: How does the dark/light theme work?**  
A: I use a React Context (`ThemeContext`) that stores a `"dark"` or `"light"` string. App.js conditionally adds the `light-mode` class to the root div. All colors are defined as CSS custom properties on `:root` (dark defaults). The `.light-mode` class overrides those variables. Switching theme is instant — no JavaScript DOM manipulation beyond toggling a class. The sidebar always stays dark regardless of theme (its variables are not overridden in `.light-mode`).

**Q: Why framer-motion instead of CSS animations?**  
A: framer-motion gives declarative, React-aware animations. `whileInView` with `viewport={{ once: true }}` means an element only animates once when it scrolls into view — you don't need `IntersectionObserver` boilerplate. `whileHover` on project cards provides instant interactive feedback. It also replaces `react-reveal` which was abandoned and incompatible with React 18.

**Q: How does the sidebar collapse work?**  
A: `Layout.js` holds an `expanded` boolean in local state. A toggle button swaps between `RiMenuFoldLine` and `RiMenuUnfoldLine` icons. The sidebar CSS class switches between `.sidebar--expanded` (240px width) and `.sidebar--collapsed` (72px). Both the profile panel (`Home.js`) and nav labels (`Menus.js`) receive `expanded` as a prop and conditionally render their text content. CSS transition on `width` provides the smooth animation.

**Q: How did you handle the React 18 upgrade?**  
A: The main breaking change was `react-reveal` being incompatible with React 18's concurrent rendering. I replaced it with framer-motion 11, which has full React 18 support. I also updated react-icons from v4 to v5, which required fixing renamed exports (e.g., `SiVisualstudiocode` → `SiVscodium`).

**Q: What is the CSS architecture?**  
A: I use a design-token approach with CSS custom properties defined in `index.css`. Variables cover colors, spacing, sidebar dimensions, shadows, and gradients. Component-level CSS files (e.g., `Layout.css`, `Projects.css`) reference these tokens. This makes theming and design changes a single-point update. No CSS preprocessor (Sass/Less) — vanilla CSS with custom properties is sufficient and keeps the build lighter.

---

### Backend

**Q: What does the Express server actually do?**  
A: Three things: (1) serve static files from `client/build/` using `express.static`, (2) handle API routes under `/api/v1/potfolio/`, (3) fall back to `index.html` for any unmatched GET request so React's client-side navigation works. CORS is enabled globally for development flexibility.

**Q: How does the contact form work end-to-end?**  
A: The user fills in name, email, and message. On submit, `@emailjs/browser` sends the form data directly from the browser to EmailJS's cloud service using my service ID, template ID, and public key. EmailJS renders my email template and delivers it to my Gmail. There is no email data passing through my Express server — this keeps the backend stateless and avoids needing SMTP credentials on the server.

**Q: Are the EmailJS keys safe to expose in frontend code?**  
A: Yes — EmailJS's security model is designed for client-side use. The public key authenticates requests to your account but doesn't grant access to your inbox or settings. The risk (abuse/spam) is mitigated by EmailJS's built-in rate limiting and domain whitelisting on the dashboard.

---

### Build & DevOps

**Q: How do you run the project in development vs production?**  
A: Development: `npm run dev` runs Express and the React dev server concurrently using the `concurrently` package. The React dev server has hot module replacement (HMR). Production: `npm run build` creates an optimized static bundle in `client/build/`, then `npm start` runs Express which serves that bundle. On Windows, `dev.bat` and `start.bat` handle this with a fallback for the Node.js PATH.

**Q: Why is `client/build/` gitignored?**  
A: Build artifacts are generated output, not source code. Committing them bloats the repo, causes unnecessary merge conflicts, and gives a false impression of what the project actually contains. Anyone cloning the repo runs `npm run build` to regenerate it. CI/CD pipelines also build fresh artifacts — they never consume committed builds.

**Q: What is the install process for a new developer?**  
A:
```bash
git clone <repo>
cd Portfolio
npm install                                           # backend deps
npm install --prefix client --legacy-peer-deps        # frontend deps
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
A: All content (work history, education, projects, skills) is hardcoded as JavaScript arrays in the respective page component files. There is no database. This is intentional for a portfolio — the data rarely changes, and a database would add infrastructure complexity with no benefit.

**Q: How would you scale this to use a database?**  
A: I'd add MongoDB (or PostgreSQL) and move the data arrays into a database seeded via a migration script. Express already has the API layer (`/api/v1/potfolio/`) — I'd add GET routes that fetch from the database and return JSON. React components would use `useEffect` + `fetch` (or React Query) instead of hardcoded arrays.

---

## Behavioral / Situational

**Q: What was the most challenging part of building this?**  
A: The dependency upgrade. `react-reveal` was incompatible with React 18 — I had to evaluate alternatives, choose framer-motion, and rewrite every animation across 10+ components while keeping the UX consistent. react-icons v5 also had breaking renames that required tracking down each icon individually.

**Q: What design decisions are you proud of?**  
A: The CSS custom property system. By defining all design tokens in one place (`:root` in index.css), the entire dark/light theme switch is a single CSS class toggle — no JavaScript-driven style injection. It's performant, maintainable, and makes future redesigns a configuration change rather than a codebase-wide find-and-replace.

**Q: What would you improve if you had more time?**  
A: 
1. **Database-backed content** — store work/education/project data in MongoDB so updates don't require a code change.
2. **Authentication** — an admin panel to edit portfolio content without touching code.
3. **Unit tests** — add React Testing Library tests for core components.
4. **CI/CD pipeline** — GitHub Actions to auto-build and deploy to a cloud host on push to main.
5. **TypeScript** — migrate the frontend to TypeScript for type safety.
6. **Accessibility (a11y)** — audit and improve ARIA roles, keyboard navigation, contrast ratios.

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
| Number of skills listed | 20 |
| Number of projects listed | 3 |
| Work history entries | 3 (Intern → ASE → SE at OpenText) |
| Education entries | 3 (10th, 12th, B.E.) |

---

## Tech Buzzwords You Can Drop Naturally

- **SPA** (Single Page Application) with client-side routing
- **Design tokens** via CSS custom properties
- **Glassmorphism** UI (backdrop-filter blur on cards)
- **Monorepo** with co-located backend and frontend
- **Concurrent rendering** (React 18)
- **`whileInView` scroll-triggered animations** (framer-motion)
- **Static serving** with Express SPA fallback
- **EmailJS** client-side email without SMTP
- **CRA** (Create React App) with `react-scripts`
- **`concurrently`** for parallel dev processes
- **CSS cascade** for zero-JS theme switching
