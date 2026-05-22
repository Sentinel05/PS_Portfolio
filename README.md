# PS Portfolio

A full-stack personal portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features a modern dark-theme UI with glassmorphism effects, framer-motion animations, and EmailJS-powered contact form.

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 18, framer-motion, react-icons, react-scroll, typewriter-effect |
| Backend  | Node.js, Express.js                             |
| Styling  | CSS custom properties (dark/light theme), Bootstrap 5 (CDN) |
| Email    | EmailJS (`@emailjs/browser`)                    |
| Deploy   | Render                                          |

> MongoDB is planned but not yet implemented.

## Live Demo

[https://p-sarkar-portfolio.onrender.com](https://p-sarkar-portfolio.onrender.com)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm v8 or higher

---

## Getting Started

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
├── routes/
│   └── portfolioRoutes.js  # API routes
├── controllers/
│   └── portfolioController.js
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
        │   ├── educations/
        │   ├── works/
        │   ├── skills/
        │   ├── projects/
        │   └── contact/    # EmailJS contact form
        ├── context/
        │   └── ThemeContext.js   # Dark/light theme
        └── utils/
            └── SkillsList.js     # Skills data & icons
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

---

## Environment Variables

Create a `.env` file in the project root if you need to customise the port:

```env
PORT=8080
```

---

## License

MIT


Note: Link may load up very slow since its hosted freely.
