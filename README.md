# PS Portfolio

A full-stack personal portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features a modern dark-theme UI with glassmorphism effects, framer-motion animations, and EmailJS-powered contact form.

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 18, framer-motion, react-icons, react-scroll, typewriter-effect |
| Backend  | Node.js, Express.js, Mongoose                   |
| Database | MongoDB Atlas (M0 free tier)                    |
| Styling  | CSS custom properties (dark/light theme), Bootstrap 5 (CDN) |
| Email    | EmailJS (`@emailjs/browser`)                    |
| Deploy   | Render                                          |

## Live Demo

[https://p-sarkar-portfolio.onrender.com](https://p-sarkar-portfolio.onrender.com)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm v8 or higher

---

## Quick Start (Windows)

If `npm` is not recognised in your terminal, just double-click one of these batch files — no PATH setup needed:

| File                | What it does                                        |
|---------------------|-----------------------------------------------------|
| `scripts/dev.bat`   | Starts both servers for development (recommended)   |
| `scripts/start.bat` | Builds the React app then starts the production server |

> **Prerequisite:** [Node.js](https://nodejs.org/) must be installed on the machine.

---

## Getting Started

> For full MongoDB Atlas setup details, known issues, and troubleshooting see [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md).

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies

Install all root and client dependencies in one command:

```bash
npm run install-all
```

Or install them separately:

```bash
# Root (Express server)
npm install

# React client
cd client
npm install --legacy-peer-deps
cd ..
```

> `--legacy-peer-deps` is required because some packages have not yet declared peer-dep compatibility with React 18.

---

## Running the App

### Development mode (server + client simultaneously)

Starts both the Express API server (port 8080) and the React dev server (port 3000) using `concurrently`:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. The React dev server proxies API calls to the Express server.

### Run servers individually

```bash
# Express server only (port 8080)
npm run server

# React dev server only (port 3000) — from the project root
npm run client
```

### Production mode

First build the React app, then start the Express server which serves the built files:

```bash
npm run build     # builds client/build/
npm start         # starts Express on port 8080
```

Then open [http://localhost:8080](http://localhost:8080).

---

## Project Structure

```
Portfolio/
├── server.js               # Express entry point
├── package.json            # Root scripts & server deps
├── .env                    # PORT + MONGO_URI (gitignored)
├── config/
│   └── db.js               # Mongoose connection
├── models/                 # Mongoose schemas
│   ├── Education.js
│   ├── Work.js
│   ├── Project.js
│   └── Skill.js
├── data/
│   └── seed.js             # One-time DB seeder
├── routes/
│   └── portfolioRoutes.js  # API routes
├── controllers/
│   └── portfolioController.js
├── scripts/                # Windows batch file shortcuts
│   ├── dev.bat
│   └── start.bat
├── docs/                   # Reference documentation
│   ├── INTERVIEW_READINESS.md
│   ├── PROJECT_EXPLORATION.md
│   └── TECH_STACK.md
└── client/                 # React app (Create React App)
    ├── package.json
    └── src/
        ├── App.js
        ├── index.css       # Global CSS variables & theming
        ├── components/
        │   ├── layout/     # Sidebar layout
        │   ├── menus/      # Sidebar navigation
        │   └── mobileNav/  # Mobile bottom nav
        ├── pages/
        │   ├── home/       # Sidebar profile panel
        │   ├── about/
        │   ├── educations/ # Fetches from /api/v1/potfolio/educations
        │   ├── works/      # Fetches from /api/v1/potfolio/works
        │   ├── skills/     # Fetches from /api/v1/potfolio/skills
        │   ├── projects/   # Fetches from /api/v1/potfolio/projects
        │   └── contact/    # EmailJS contact form
        ├── context/
        │   └── ThemeContext.js   # Dark/light theme
        └── utils/
            └── SkillsList.js     # Icon registry (iconName → component)
```

---

## Available Scripts

Run from the **project root**:

| Command                | Description                                               |
|------------------------|-----------------------------------------------------------|
| `npm run dev`          | Start both server and React dev client (development)      |
| `npm start`            | Start Express server only (production, serves built app)  |
| `npm run server`       | Start Express server only                                 |
| `npm run client`       | Start React dev server only                               |
| `npm run build`        | Build the React client for production                     |
| `npm run install-all`  | Install root and client dependencies                      |

Run from the **`client/` directory**:

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm start`          | Start React dev server (port 3000) |
| `npm run build`      | Build for production               |
| `npm test`           | Run React tests                    |

---

## Why can't I just run `npm start` from the root?

`npm start` at the root runs `node server.js` — the Express server — which serves the **pre-built** React app from `client/build/`. If `client/build/` doesn't exist yet (i.e., you haven't run `npm run build`), the app will show a blank page or 404.

For **development**, always use `npm run dev` from the root so both the backend and the React hot-reload server run together.

If `npm` is not found in your terminal (common on Windows when Node.js was installed manually), either:
- **Open a fresh terminal** after installing Node.js — the installer adds `npm` to PATH automatically.
- **Use the batch files** — double-click `dev.bat` or `start.bat` in the project root; they handle the PATH internally.

---

## Environment Variables

Create a `.env` file in the project root (already generated — fill in your values):

```env
PORT=8080
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

After setting `MONGO_URI`, seed the database once before starting the server:

```bash
node data/seed.js
```

> If you get a `querySrv ECONNREFUSED` error on Windows, see the [DNS fix in MONGODB_SETUP.md](docs/MONGODB_SETUP.md#9-windows-dns--c-ares-issue-and-fix).

---

## License

MIT


Note: Link may load up very slow since its hosted freely.
