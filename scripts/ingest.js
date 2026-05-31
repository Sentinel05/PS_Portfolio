/**
 * Ingestion script — embeds portfolio content and upserts into Pinecone.
 * Run once (or whenever portfolio content changes): npm run ingest
 *
 * Required .env variables:
 *   MONGO_URI        — MongoDB Atlas connection string
 *   GEMINI_API_KEY   — Google AI Studio API key
 *   PINECONE_API_KEY — Pinecone API key
 *   PINECONE_INDEX   — Name of your Pinecone index (768 dimensions, cosine metric)
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pinecone } = require("@pinecone-database/pinecone");

// Fix DNS on some Windows setups
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const Education = require("../models/Education");
const Work = require("../models/Work");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Certification = require("../models/Certification");

/**
 * Build plain text chunks from all portfolio collections + static bio.
 * Returns array of { text, source, title } objects.
 */
const buildChunks = (educations, works, projects, skills, certifications) => {
  const chunks = [];

  // ── Static bio / about ──────────────────────────────────────────────────────
  chunks.push({
    text:
      "Priyanshu Sarkar is a Software Engineer at OpenText based in Bengaluru, India. " +
      "He develops and enhances integrational features for Data Protector — enabling " +
      "enterprises to protect critical environments like SAP HANA, VMware, Documentum, " +
      "and Windows Defender via Malware Scan. He is passionate about clean code, " +
      "enterprise reliability, and impactful solutions. His core technologies include " +
      "TypeScript, C++, Angular, React, Node.js, Spring Boot, Docker, Kubernetes, and REST APIs.",
    source: "about",
    title: "About Priyanshu",
  });

  // ── Education ───────────────────────────────────────────────────────────────
  educations.forEach((edu) => {
    chunks.push({
      text: `Education: ${edu.title} at ${edu.school}, ${edu.location} (${edu.date}). Grade/Score: ${edu.grade}.`,
      source: "education",
      title: edu.title,
    });
  });

  // ── Work experience ──────────────────────────────────────────────────────────
  works.forEach((work) => {
    chunks.push({
      text: `Work Experience: ${work.title} at ${work.company}, ${work.location} (${work.date}). ${work.desc}`,
      source: "work",
      title: `${work.title} at ${work.company}`,
    });
  });

  // ── Projects ────────────────────────────────────────────────────────────────
  projects.forEach((project) => {
    chunks.push({
      text: `Project: ${project.title} (${project.type}). Technologies: ${project.tags.join(", ")}. ${project.desc} Repository: ${project.link}`,
      source: "project",
      title: project.title,
    });
  });

  // ── Project deep-dives ────────────────────────────────────────────────────

  // Supermarket Portal — overview & features
  chunks.push({
    text:
      "Supermarket Portal is a console-based supermarket management system written in C++ by Priyanshu Sarkar. " +
      "It is a single-file application (Supermarket.cpp) that supports two user roles: Administrator and Customer. " +
      "Product data is persisted in a plain-text flat-file database called Database.txt, stored one product per line " +
      "in space-separated format: <pcode> <pname> <price> <discount%>. " +
      "Edit and delete operations use a temporary file (Database1.txt) which replaces Database.txt after the operation completes. " +
      "The project can be compiled with g++ (g++ Supermarket.cpp -o Supermarket) and run on Linux, macOS, or Windows. " +
      "Repository: https://github.com/Sentinel05/Supermarket-Portal",
    source: "project",
    title: "Supermarket Portal — Overview",
  });

  // Supermarket Portal — architecture & code design
  chunks.push({
    text:
      "Supermarket Portal is implemented as a single C++ class named 'market'. " +
      "Data members of the class: pcode (int, unique product identifier), pname (string, product name), " +
      "price (float, price per unit), dis (float, discount percentage, e.g. 10 means 10%). " +
      "Methods: menu() — main entry point, prompts user to select Administrator or Customer; " +
      "admin() — Administrator sub-menu; buyer() — Customer sub-menu; " +
      "add() — adds a new product to the database with duplicate product code check; " +
      "edit() — modifies an existing product by product code; " +
      "rem() — deletes a product by product code; " +
      "list() — displays all products (code, name, price); " +
      "recipt() — lets a customer build a cart and prints a full receipt with discounts applied. " +
      "Up to 100 unique products can be added to a single customer order (array limit in recipt()). " +
      "Duplicate product codes within the same order are detected and rejected.",
    source: "project",
    title: "Supermarket Portal — Architecture",
  });

  // Supermarket Portal — user roles & features
  chunks.push({
    text:
      "Supermarket Portal has two user roles — Administrator and Customer. " +
      "Administrator: login is required with hardcoded credentials (email: sarkar@gmail.com, password: 301205). " +
      "Once authenticated, the administrator can: (1) Add a product — enter product code, name, price, and discount; " +
      "(2) Modify a product — look up by product code and update all fields; " +
      "(3) Delete a product — remove a product by product code; (4) Back — return to the main menu. " +
      "Customer: no login required. The customer can: (1) Buy a product — view the product list, " +
      "add items to the cart by product code and quantity, then receive a full receipt; (2) Back — return to the main menu. " +
      "The receipt prints a table with: Product No, Product Name, Quantity, Unit Price, Total Amount, Amount after Discount. " +
      "The final Total Amount (sum of all discounted amounts) is displayed at the bottom. " +
      "There is no persistent session; the application loops back to the main menu after each action.",
    source: "project",
    title: "Supermarket Portal — User Roles and Features",
  });

  // Tic Tac Toe — overview & gameplay
  chunks.push({
    text:
      "Tic-Tac-Toe is a terminal-based game written in C++ by Priyanshu Sarkar where a human player competes " +
      "against an unbeatable CPU opponent. It is a single-file application (TicTacToe.cpp). " +
      "The CPU uses the Minimax algorithm to calculate the optimal move at every turn, making it impossible for the CPU to lose — " +
      "the best outcome a human player can achieve is a draw. " +
      "How to play: on launch, choose whether to go first (y) or let the CPU go first (n). " +
      "Board cells are numbered 1–9 (1-2-3 top row, 4-5-6 middle row, 7-8-9 bottom row). " +
      "The human plays X, the CPU plays O, and empty cells are shown as *. " +
      "On your turn, enter the number of the cell to place your mark. " +
      "Input validation rejects occupied cells and out-of-range inputs. " +
      "After each game, the player is prompted to play again or quit (replay support without restarting the program). " +
      "Compiled with: g++ TicTacToe.cpp -o TicTacToe. " +
      "Repository: https://github.com/Sentinel05/Tic-Tac-Toe",
    source: "project",
    title: "Tic-Tac-Toe — Overview and Gameplay",
  });

  // Tic Tac Toe — algorithm & code design
  chunks.push({
    text:
      "The Tic-Tac-Toe CPU opponent uses the Minimax algorithm with recursive backtracking to evaluate every possible " +
      "future game state and choose the move with the highest guaranteed score. " +
      "Scoring: a CPU win scores +10, a human win scores -10, and a draw scores 0. " +
      "The CPU always maximises its score and the human always minimises it. " +
      "Because all game states are explored, the CPU never makes a suboptimal move. " +
      "Key functions: initialise() — sets up an empty board filled with *; " +
      "showBoard() — prints the current board state; " +
      "showInstructions() — displays the cell-numbering guide; " +
      "gameOver() — checks rows, columns, and diagonals for a win condition; " +
      "minimax() — recursively scores all possible moves; " +
      "bestMove() — finds the optimal cell for the CPU to play; " +
      "playTicTacToe() — main game loop; " +
      "declareWinner() — announces the result.",
    source: "project",
    title: "Tic-Tac-Toe — Minimax Algorithm and Code Design",
  });

  // ── Skills (single grouped chunk) ────────────────────────────────────────
  const skillNames = skills.map((s) => s.name).join(", ");
  chunks.push({
    text: `Priyanshu's technical skills and tools include: ${skillNames}.`,
    source: "skills",
    title: "Skills",
  });

  // ── Certifications ────────────────────────────────────────────────────────
  if (certifications.length > 0) {
    const certList = certifications
      .map((c) => `"${c.title}" from ${c.issuer} (${c.date})`)
      .join("; ");
    chunks.push({
      text: `Priyanshu has earned the following certifications: ${certList}.`,
      source: "certifications",
      title: "Certifications",
    });
  }

  // ── Contact / social links ───────────────────────────────────────────────────
  chunks.push({
    text:
      "Priyanshu Sarkar can be contacted via LinkedIn (https://www.linkedin.com/in/priyanshu-sarkar-79464b242), " +
      "GitHub (https://github.com/Sentinel05), Gmail (psarkar.work05@gmail.com), " +
      "or WhatsApp (+91 7904953079). The portfolio website also has a Contact section with a message form.",
    source: "contact",
    title: "Contact",
  });

  // ── Portfolio website / app overview ─────────────────────────────────────────
  chunks.push({
    text:
      "This is Priyanshu Sarkar's personal portfolio website, built as a full-stack MERN application " +
      "(MongoDB, Express.js, React, Node.js). The site is divided into the following sections: " +
      "(1) Welcome — a landing page where visitors can enter their name before entering the portfolio. " +
      "(2) Home / Hero — a banner introducing Priyanshu with a typewriter effect cycling through his roles: " +
      "Software Engineer, Full-Stack Developer, Problem Solver, and Open-Source Enthusiast. " +
      "(3) About — a summary of Priyanshu's background, personality, and professional mission. " +
      "(4) Education — his academic history including degrees, schools, locations, dates, and grades. " +
      "(5) Work Experience — a timeline of his professional roles, companies, responsibilities, and achievements. " +
      "(6) Skills — a categorised showcase of his technical skills grouped into Languages, Frontend, " +
      "Frameworks & Libraries, Databases, DevOps, and Tools. " +
      "(7) Certifications — a list of professional certifications with issuer, date, and verification links. " +
      "(8) Projects — cards for each personal or side project with tech stack tags, description, and GitHub link. " +
      "(9) Contact — a message form that lets visitors send a message directly to Priyanshu, " +
      "along with his LinkedIn, GitHub, Gmail, and WhatsApp links. " +
      "The site also features a CV / resume download button (PDF), a dark/light theme toggle, " +
      "a responsive mobile navigation menu, and this AI assistant chatbot (Priyanshu's AI Assistant) " +
      "that answers questions about Priyanshu using RAG (Retrieval-Augmented Generation) with Pinecone vector search and Google Gemini. " +
      "Navigation on desktop is handled by a fixed sidebar; on mobile, a hamburger menu slides in from the right.",
    source: "app",
    title: "Portfolio Website Overview",
  });

  // ── Tech stack — backend ──────────────────────────────────────────────────
  chunks.push({
    text:
      "The portfolio backend is a Node.js + Express server. Key packages and their roles: " +
      "express ^4.18.2 (HTTP server and REST API routing); " +
      "mongoose ^9.6.2 (MongoDB ODM — schemas, models, queries); " +
      "bcryptjs ^2.x (admin password hashing, cost factor 12); " +
      "jsonwebtoken ^9.x (signs 8-hour JWT tokens on admin login, verified by auth middleware on protected routes); " +
      "resend ^6.12.3 (transactional email — used by sendEmailController); " +
      "@google/generative-ai ^0.24.0 (Google Gemini SDK — gemini-embedding-2 for embeddings, gemini-2.5-flash for chat LLM); " +
      "@pinecone-database/pinecone ^7.2.0 (Pinecone vector DB client — upsert and query vectors); " +
      "cors ^2.8.5 (cross-origin requests from React dev server); " +
      "dotenv ^16.3.1 (loads .env variables); " +
      "concurrently ^9.2.1 (runs Express + React dev servers simultaneously with npm run dev). " +
      "The Express server listens on port 8080 (configurable via PORT env var). " +
      "In production it serves the React build as static files from client/build/ and falls back to index.html for all non-API routes (SPA fallback).",
    source: "architecture",
    title: "Backend Tech Stack",
  });

  // ── Tech stack — frontend ─────────────────────────────────────────────────
  chunks.push({
    text:
      "The portfolio frontend is a React 18 app bootstrapped with Create React App (CRA). Key packages: " +
      "react ^18.3.1 and react-dom ^18.3.1 (UI library and DOM renderer); " +
      "react-router-dom ^6.x (client-side routing: / for Welcome, /portfolio/* for the public portfolio, /admin/login for admin login, /admin for the protected admin portal); " +
      "react-scroll ^1.9.0 (smooth-scroll navigation links in the sidebar menu); " +
      "react-vertical-timeline-component ^3.6.0 (Education and Work Experience timeline UI); " +
      "react-icons ^5.2.1 (icon library used across all components); " +
      "framer-motion ^11.3.0 (scroll-triggered animations on section headings and hero); " +
      "typewriter-effect ^2.21.0 (animated typewriter text on the Hero section). " +
      "Styling uses plain CSS per component with no CSS framework (no Tailwind/Bootstrap). " +
      "Bootstrap 5.3.3 JS bundle and Google Fonts (Inter + Fira Code) are loaded via CDN in public/index.html. " +
      "The React dev server runs on port 3000 and proxies /api requests to Express on port 8080.",
    source: "architecture",
    title: "Frontend Tech Stack",
  });

  // ── Architecture & data flow ──────────────────────────────────────────────
  chunks.push({
    text:
      "Architecture and data flow of the portfolio: " +
      "In development mode (npm run dev), concurrently starts both the React dev server on :3000 and the Express server on :8080. " +
      "The React dev server proxies all /api requests to Express. " +
      "In production (npm start), Express serves the React production build as static files and handles all API calls. " +
      "The frontend fetches portfolio content (educations, works, projects, skills, certifications) via GET REST API calls to the Express backend, which queries MongoDB Atlas. " +
      "The contact form posts to POST /api/v1/ps-portfolio/sendEmail, which triggers a real transactional email via the Resend SDK. " +
      "The AI chatbot widget posts visitor messages to POST /api/v1/ps-portfolio/chat, which runs the RAG pipeline (embed → Pinecone → Gemini LLM) and returns the answer. " +
      "Guest visits are logged to MongoDB via POST /api/v1/ps-portfolio/visits. " +
      "Admin CRUD operations (create/update/delete portfolio items) are protected by JWT Bearer token middleware. " +
      "Admin login is at POST /api/v1/admin/login — bcrypt compares the password hash and returns an 8-hour JWT.",
    source: "architecture",
    title: "Architecture and Data Flow",
  });

  // ── API endpoints ─────────────────────────────────────────────────────────
  chunks.push({
    text:
      "All public REST API endpoints are under the base path /api/v1/ps-portfolio/. " +
      "Public GET endpoints (no authentication required): " +
      "GET /educations — returns all education entries sorted by order; " +
      "GET /works — returns all work experience entries sorted by order; " +
      "GET /projects — returns all project entries sorted by order; " +
      "GET /skills — returns all skill entries sorted by order; " +
      "GET /certifications — returns all certification entries sorted by order. " +
      "Public POST endpoints (no authentication required): " +
      "POST /sendEmail — sends a contact form email via Resend; " +
      "POST /chat — RAG chatbot (accepts { message, history }, returns { success, answer }); " +
      "POST /visits — logs a guest visit (stores visitor name + timestamp). " +
      "JWT-protected endpoints (require Authorization: Bearer <token> header): " +
      "GET /visits — returns the full visitor log (admin only); " +
      "POST /:col — creates a new item in the specified collection; " +
      "PUT /:col/:id — updates an item by ID in the specified collection; " +
      "DELETE /:col/:id — deletes an item by ID. " +
      "Admin auth route (separate base path /api/v1/ps-portfolio/admin/): " +
      "POST /login — verifies admin credentials with bcrypt and returns an 8-hour JWT.",
    source: "architecture",
    title: "API Endpoints",
  });

  // ── MongoDB collections / data models ─────────────────────────────────────
  chunks.push({
    text:
      "The portfolio uses MongoDB Atlas (M0 free tier, 512MB, AWS Mumbai region) as its database. " +
      "Database name: portfolio. There are 7 collections: " +
      "educations — fields: date, title, school, location, grade, order; " +
      "works — fields: date, title, company, location, desc, order; " +
      "projects — fields: imageKey, type, typeColor, tags (array), title, desc, link, order; " +
      "skills — fields: name, iconName, category, order; " +
      "certifications — fields: title, issuer, date, link, order; " +
      "admin — fields: username (unique), passwordHash (bcrypt, cost 12) — admin credentials are always synced from ADMIN_USERNAME/ADMIN_PASSWORD env vars on every server start via findOneAndUpdate upsert; " +
      "visits — fields: name, visitedAt — records every guest who enters the portfolio via the Welcome page. " +
      "All sortable collections have an 'order' field used to control display order. " +
      "The Mongoose connection is established in config/db.js; DNS is forced to Google (8.8.8.8) to fix SRV lookup issues on Windows.",
    source: "architecture",
    title: "MongoDB Collections and Data Models",
  });

  // ── RAG chatbot architecture ──────────────────────────────────────────────
  chunks.push({
    text:
      "The AI chatbot ('Priyanshu's AI Assistant') uses a RAG (Retrieval-Augmented Generation) pipeline with no LangChain dependency. " +
      "Visitor question flow: " +
      "(1) The React Chatbot.js widget POSTs { message, history } to /api/v1/ps-portfolio/chat. " +
      "(2) chatController.js sanitises the input (trim, max 500 chars) then calls gemini-embedding-2 to embed the query into a 768-dimensional vector. " +
      "(3) The vector is used to query the Pinecone index 'ps-portfolio' in namespace 'portfolio' (topK: 8, cosine similarity, score threshold 0.45). " +
      "(4) Retrieved chunk texts are joined into a context string. " +
      "(5) A system prompt is built instructing the model to answer only from the context and redirect off-topic questions to the Contact section. " +
      "(6) Up to 6 prior conversation turns from req.body.history are injected into the Gemini chat history. " +
      "(7) gemini-2.5-flash generates the answer via startChat() + sendMessage(). " +
      "(8) The answer is returned as { success: true, answer } and rendered as markdown in the chat widget. " +
      "Pinecone index settings: name 'ps-portfolio', 768 dimensions, cosine metric, serverless on AWS us-east-1, namespace 'portfolio'. " +
      "The ingestion script (scripts/ingest.js, run with npm run ingest) fetches all MongoDB collections, builds text chunks, embeds them with gemini-embedding-2, and upserts to Pinecone. " +
      "Singleton pattern: Pinecone client, embedding model, and chat model are initialised once on first request and reused across all subsequent requests.",
    source: "architecture",
    title: "RAG Chatbot Architecture",
  });

  // ── Admin CMS & authentication ────────────────────────────────────────────
  chunks.push({
    text:
      "The portfolio includes a fully-functional Admin CMS protected by JWT authentication. " +
      "Welcome page (route /): all visitors land here and choose either Guest or Admin. " +
      "Guest flow: visitor enters their name, which is logged to the visits MongoDB collection, then they access the public portfolio at /portfolio/*. " +
      "Admin flow: redirected to /admin/login — login form POSTs credentials to /api/v1/admin/login, bcrypt compares the password hash, and a signed 8-hour JWT is returned. " +
      "The JWT is stored in localStorage under the key 'admin_token'. AuthContext exposes login() and logout() hooks. " +
      "ProtectedRoute component redirects unauthenticated users to / if no JWT is present. " +
      "Admin portal (route /admin, component AdminPortfolio.js): portfolio-style view with fixed topbar, collapsible sidebar, and 6 CRUD sections (Educations, Works, Projects, Skills, Certifications, Admin Dashboard). " +
      "Each section supports inline Add, Edit (pencil icon), and Delete (trash icon with confirm modal) per item. " +
      "The Analytics Dashboard shows: 5 visitor stat cards (Total, Unique, Last 7 Days, Returning, First-time), content count cards, daily bar chart (last 14 days), monthly trend chart (last 6 months), top 5 returning visitors, peak visit hours chart (0-23), day-of-week chart (Mon–Sun), and a paginated visitor table (10 rows/page) with name filter and click-to-sort.",
    source: "architecture",
    title: "Admin CMS and Authentication",
  });

  // ── Design system & theming ───────────────────────────────────────────────
  chunks.push({
    text:
      "The portfolio design system uses CSS custom properties defined in client/src/index.css. " +
      "Theme is managed by ThemeContext.js — it auto-initialises based on time of day: 6am–6pm → light mode, 6pm–6am → dark mode. The user can also toggle manually via the sun/moon icon in the sidebar. " +
      "Switching the theme class on the root element instantly re-renders the entire UI via CSS cascade. " +
      "Key CSS custom properties: --bg (page background: dark #070d1a / light #f1f5f9), --surface (cards/panels: dark #0f1e38 / light #ffffff), --accent (primary purple #7c3aed), --accent3 (cyan: dark #06b6d4 / light #0284c7), --text (body text: dark #e2e8f0 / light #0f172a), --sidebar-bg (dark #060c18 / light #ffffff). " +
      "Sidebar widths: expanded 240px (--sidebar-width), collapsed 72px (--sidebar-collapsed). " +
      "Utility classes include: .glass-card (glassmorphism with backdrop-filter blur), .section-heading (gradient purple→violet text), .section-divider (accent-coloured hr), .footer (centred footer text). " +
      "Typography: Inter (body) and Fira Code (monospace/code), both loaded from Google Fonts CDN. " +
      "All animations use framer-motion with whileInView and viewport={{ once: true }} for scroll-triggered reveal. " +
      "The chatbot widget uses a figure-float keyframe animation and glow-pulse ambient effect when idle.",
    source: "architecture",
    title: "Design System and Theming",
  });

  // ── Third-party integrations ──────────────────────────────────────────────
  chunks.push({
    text:
      "Third-party service integrations used in the portfolio: " +
      "Resend (contact email): the Contact form sends a real transactional email server-side via the Resend SDK (RESEND_API_KEY env var). The 'from' address is 'Portfolio Contact <onboarding@resend.dev>' and the reply-to is set to the visitor's email. Free tier allows 100 emails/day. " +
      "Google Gemini API (via AI Studio): two models are used — gemini-embedding-2 for generating 768-dimensional text embeddings, and gemini-2.5-flash as the LLM for generating chatbot answers. Both are available on the free AI Studio tier (rate-limited). Note: text-embedding-004 and gemini-1.5-flash are not available on the free AI Studio key. " +
      "Pinecone (vector database): serverless index 'ps-portfolio' on AWS us-east-1, 768 dimensions, cosine metric, free tier (1 index, 100K vectors). Stores portfolio content as embedded vectors for semantic search. " +
      "MongoDB Atlas (database): M0 free shared cluster on AWS Mumbai (ap-south-1), 512MB. Connection uses an SRV URI with retryWrites=true and w=majority. Network access is open to 0.0.0.0/0 (required because Render free tier does not provide a static outbound IP). " +
      "All services used are on free tiers; total monthly cost is $0.",
    source: "architecture",
    title: "Third-Party Integrations",
  });

  // ── NPM scripts & developer workflow ─────────────────────────────────────
  chunks.push({
    text:
      "NPM scripts available (run from the root Portfolio/ directory): " +
      "'npm start' — runs the production Express server on port 8080; " +
      "'npm run dev' — concurrently starts Express on :8080 and the React dev server on :3000 (with HMR); " +
      "'npm run build' — installs client dependencies and builds the React CRA production bundle to client/build/; " +
      "'npm run seed' — wipes and repopulates all 6 MongoDB collections with default seed data from data/seed.js; " +
      "'npm run ingest' — runs the one-time chatbot ingestion script (scripts/ingest.js): connects to MongoDB, builds text chunks from all portfolio data, embeds them with gemini-embedding-2, and upserts them to Pinecone; " +
      "Windows batch shortcuts in scripts/: dev.bat (npm run dev), start.bat (build + start), ingest.bat (npm run ingest). " +
      "The ingest script must be re-run whenever portfolio content in MongoDB is changed, to keep the Pinecone vector index up to date.",
    source: "architecture",
    title: "NPM Scripts and Developer Workflow",
  });

  return chunks;
};

/**
 * Embed a single text using the Google Generative AI SDK directly.
 * Uses gemini-embedding-2 with outputDimensionality=768 to match the Pinecone index.
 */
const embedText = async (embeddingModel, text) => {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
    outputDimensionality: 768,
  });
  return result.embedding.values;
};

/**
 * Core ingestion pipeline — assumes Mongoose is already connected.
 * Safe to call from within the Express server (no connect/disconnect/process.exit).
 * Returns { chunksIngested: number }
 */
const runIngestPipeline = async () => {
  const [educations, works, projects, skills, certifications] = await Promise.all([
    Education.find().sort({ order: 1 }),
    Work.find().sort({ order: 1 }),
    Project.find().sort({ order: 1 }),
    Skill.find().sort({ order: 1 }),
    Certification.find().sort({ order: 1 }),
  ]);
  console.log(
    `[Ingest] Fetched: ${educations.length} educations, ${works.length} works, ${projects.length} projects, ${skills.length} skills, ${certifications.length} certifications`
  );

  const chunks = buildChunks(educations, works, projects, skills, certifications);
  console.log(`[Ingest] Built ${chunks.length} chunks for embedding`);

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

  const BATCH_SIZE = 5;
  let totalUpserted = 0;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const records = [];
    for (let j = 0; j < batch.length; j++) {
      const values = await embedText(embeddingModel, batch[j].text);
      records.push({
        id: `doc-${i + j}`,
        values,
        metadata: {
          text: batch[j].text,
          source: batch[j].source,
          title: batch[j].title,
        },
      });
    }
    await pineconeIndex.namespace("portfolio").upsert({ records });
    totalUpserted += records.length;
    console.log(`[Ingest]   Upserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${records.length} vectors (total: ${totalUpserted})`);
  }

  console.log(`[Ingest] ✅ Complete — ${totalUpserted} vectors upserted into Pinecone.`);
  return { chunksIngested: totalUpserted };
};

module.exports = { runIngestPipeline };

// ── Standalone runner (npm run ingest) ──────────────────────────────────────
if (require.main === module) {
  (async () => {
    try {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
      await runIngestPipeline();
      await mongoose.disconnect();
      process.exit(0);
    } catch (error) {
      console.error("Ingestion error:", error);
      process.exit(1);
    }
  })();
}
