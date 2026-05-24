# MongoDB Atlas Setup — Complete Reference

> This document records every step taken to integrate MongoDB Atlas into this project, including the reasoning behind each decision and all issues encountered with their fixes. Use this as the canonical reference for anyone setting up the database from scratch.

---

## Table of Contents

1. [Why MongoDB Atlas](#1-why-mongodb-atlas)
2. [Creating the Cluster](#2-creating-the-cluster)
3. [Network Access — Why 0.0.0.0/0](#3-network-access--why-0000)
4. [Database User](#4-database-user)
5. [Getting the Connection String](#5-getting-the-connection-string)
6. [Constructing the Full URI](#6-constructing-the-full-uri)
7. [URL-Encoding Special Characters in Passwords](#7-url-encoding-special-characters-in-passwords)
8. [Pasting into .env](#8-pasting-into-env)
9. [Windows DNS / c-ares Issue and Fix](#9-windows-dns--c-ares-issue-and-fix)
10. [Running the Seed Script](#10-running-the-seed-script)
11. [Render Deployment — Environment Variable](#11-render-deployment--environment-variable)
12. [Data Model — Collections and Schemas](#12-data-model--collections-and-schemas)
13. [API Endpoints](#13-api-endpoints)
14. [Troubleshooting Reference](#14-troubleshooting-reference)

---

## 1. Why MongoDB Atlas

**Why MongoDB over PostgreSQL / SQLite?**

This is a MERN stack project (MongoDB, Express, React, Node). MongoDB is the natural fit because:
- Portfolio content (education, work, projects, skills) is **document-shaped**, not relational. There are no JOINs needed.
- **Flexible schema** — adding a new content type (e.g. certifications, blog posts) is a new collection, not a schema migration.
- **Mongoose ODM** integrates seamlessly with Node.js/Express.
- Roadmap items (chatbot RAG with Atlas Vector Search, admin CMS) are all MongoDB-native features.

**Why Atlas specifically?**

- **M0 free tier** — 512MB storage, free forever. More than sufficient for a portfolio.
- **Fully managed** — no server to maintain, automatic backups, built-in monitoring.
- **Accessible from anywhere** — works both locally (dev) and from Render (production) with a single connection string.

**Why not run MongoDB locally?**

A local MongoDB instance only works on your machine. Atlas is cloud-hosted, so the same `MONGO_URI` works in development, on Render, and for any contributor who clones the repo.

---

## 2. Creating the Cluster

**Steps taken:**

1. Visited **cloud.mongodb.com** → signed up → landed on the Overview page.
2. Clicked **Create** → selected **M0 Free** tier.
3. Configuration:
   - **Name:** `ps-portfolio` (changed from default `Cluster0` for clarity)
   - **Provider:** AWS
   - **Region:** Mumbai `ap-south-1`
   - **"Preload sample dataset":** unchecked — sample data wastes the 512MB quota with irrelevant data
4. Clicked **Create Deployment**.

**Why AWS / Mumbai?**

AWS Mumbai (`ap-south-1`) is the closest available Atlas region to India. Lower geographic distance = lower latency for both development (local machine) and production (Render server if also in an Asia region). AWS is the most stable option and has the most Atlas free-tier regions available.

**Provisioning time:** ~2–3 minutes after clicking Create Deployment.

---

## 3. Network Access — Why 0.0.0.0/0

After cluster creation, Atlas prompted for an IP Access List entry.

**What was set:** `0.0.0.0/0` with comment `For render to access it.`

**Why not use a specific IP?**

- **Local development:** Your machine's IP changes whenever you reconnect to a different network (home, office, mobile hotspot). Adding a specific IP means re-whitelisting every time you change networks.
- **Render (free tier):** Render does not provide a static outbound IP on free plans. The IP of your deployed server changes on every restart and redeploy. There is no way to pin it without upgrading to a paid Render plan.
- **Security:** `0.0.0.0/0` allows connections from any IP, but Atlas connections still require valid **username + password** (in the connection string). The IP whitelist is an additional layer, not the primary security mechanism. For a portfolio project, this trade-off is standard and acceptable.

**Where to set it:**

Atlas dashboard → **Network Access** (left sidebar under Security) → **+ Add IP Address** → type `0.0.0.0/0` → **Confirm**.

---

## 4. Database User

Atlas auto-created a database user during the connection setup wizard.

| Field | Value |
|---|---|
| Username | `sentinel_user` |
| Password | Set during wizard (contains special characters — see §7) |
| Role | `readWriteAnyDatabase` (Atlas default for new users) |

**Why a dedicated database user?**

This user's credentials are what authenticate the connection. They are embedded in the `MONGO_URI` in `.env` (which is gitignored). The Atlas account itself (email + password) is never exposed to the application.

**If you need to create a new user later:**

Atlas dashboard → **Database Access** → **+ Add New Database User** → set username, auto-generate password, select role `Atlas admin` or `readWriteAnyDatabase`.

---

## 5. Getting the Connection String

**Path in Atlas UI:**

Cluster overview → **Connect** button → **Drivers** → Driver: `Node.js`, Version: `6.7 or later`.

**Why "Drivers" and not Compass / Shell / MongoDB for VS Code?**

- **Compass** gives a GUI connection string for the MongoDB Compass desktop app — not for code.
- **Shell** gives a `mongosh` CLI string — not for Node.js applications.
- **MongoDB for VS Code** is for the IDE extension — not for runtime code.
- **Drivers** gives the `mongodb+srv://...` URI format consumed directly by the `mongoose.connect()` call in `config/db.js`.

**What Atlas shows:**

```
mongodb+srv://<username>:<password>@ps-portfolio.uc612bi.mongodb.net/?appName=ps-portfolio
```

This is an **SRV connection string**. The `+srv` tells the MongoDB driver to perform a DNS SRV lookup to discover the actual replica set hostnames, rather than hardcoding them. This is the recommended format for Atlas.

---

## 6. Constructing the Full URI

The string Atlas provides is not ready to use as-is. Two additions are required:

**Add the database name** before the `?`:

```
...mongodb.net/portfolio?...
```

Without a database name, Mongoose connects to the `test` database by default. Specifying `portfolio` ensures all collections are created under that database.

**Add `retryWrites=true&w=majority`** to the query string:

```
...?retryWrites=true&w=majority&appName=ps-portfolio
```

- `retryWrites=true` — automatically retries write operations that fail due to a transient network error. Essential for reliability.
- `w=majority` — write concern: the write is only acknowledged after it has been replicated to a majority of replica set members. Prevents data loss on failover.

**Full constructed URI (template):**

```
mongodb+srv://<username>:<password>@ps-portfolio.uc612bi.mongodb.net/portfolio?retryWrites=true&w=majority&appName=ps-portfolio
```

---

## 7. URL-Encoding Special Characters in Passwords

**Problem encountered:**

The database password contained the `@` character (e.g. `PW@mongodb2398`). The raw URI looked like:

```
mongodb+srv://sentinel_user:PW@mongodb2398@ps-portfolio.uc612bi.mongodb.net/...
```

The MongoDB URI parser reads the string left to right and stops at the **first** `@` to separate credentials from the hostname. So it parsed:

- Username: `sentinel_user`
- Password: `PW`
- Hostname: `mongodb2398` ← **wrong** — this is part of the password, not the host

This caused the error:
```
querySrv ECONNREFUSED _mongodb._tcp.mongodb2398
```

**Fix:**

URL-encode `@` as `%40` in the password portion only:

```
mongodb+srv://sentinel_user:PW%40mongodb2398@ps-portfolio.uc612bi.mongodb.net/portfolio?...
```

Now the parser sees exactly one `@` (separating credentials from host) and treats `PW%40mongodb2398` as the full password, decoding `%40` back to `@` internally.

**General rule:** Any special character in a URI password must be percent-encoded:

| Character | Encoded |
|---|---|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `#` | `%23` |
| `?` | `%3F` |
| `&` | `%26` |
| `=` | `%3D` |
| `+` | `%2B` |
| ` ` (space) | `%20` |

---

## 8. Pasting into .env

The `.env` file lives at the **project root** (same level as `server.js`). It is listed in `.gitignore` and will never be committed to version control.

**File contents:**

```env
PORT=8080
MONGO_URI=mongodb+srv://sentinel_user:PW%40mongodb2398@ps-portfolio.uc612bi.mongodb.net/portfolio?retryWrites=true&w=majority&appName=ps-portfolio
```

**How `server.js` loads it:**

```js
const dotenv = require("dotenv");
dotenv.config();  // loads .env into process.env
```

**How `config/db.js` uses it:**

```js
await mongoose.connect(process.env.MONGO_URI);
```

`dotenv.config()` runs before `connectDB()` in `server.js`, so `process.env.MONGO_URI` is available when mongoose tries to connect.

---

## 9. Windows DNS / c-ares Issue and Fix

**Problem encountered:**

After correctly setting the URI, the seed script and the Express server both failed with:

```
querySrv ECONNREFUSED _mongodb._tcp.ps-portfolio.uc612bi.mongodb.net
```

**Root cause:**

Node.js uses a C library called **c-ares** for DNS resolution — it does not use the Windows DNS client service. c-ares queries DNS servers directly over UDP/TCP on port 53. On some Windows machines, a local firewall rule, antivirus, or network policy blocks outbound DNS (port 53) from non-browser processes like Node.js.

PowerShell's `Resolve-DnsName` works because it routes through the Windows DNS client service (which runs as a system service and is typically whitelisted). Node.js bypasses that service entirely.

**Evidence:** Running `Resolve-DnsName -Name "_mongodb._tcp.ps-portfolio.uc612bi.mongodb.net" -Type SRV` in PowerShell returned the correct SRV records:

```
NameTarget                              Port
ac-fuo49wd-shard-00-00.uc612bi.mongodb.net  27017
ac-fuo49wd-shard-00-01.uc612bi.mongodb.net  27017
ac-fuo49wd-shard-00-02.uc612bi.mongodb.net  27017
```

This confirmed the Atlas cluster was up and the SRV records existed — the problem was purely in Node.js's DNS resolver.

**Fix applied:**

At the top of both `config/db.js` (server) and `data/seed.js` (seed script), added:

```js
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
```

`dns.setServers()` overrides the DNS servers c-ares uses for this Node.js process. Google's public DNS servers (`8.8.8.8` and `8.8.4.4`) are reachable over port 53 from virtually any network and fully support SRV record queries.

This fix is **local-only** — on Render (Linux, cloud), c-ares resolves SRV records without issue. The fix does not affect production behaviour.

**Files modified:**

- [config/db.js](../config/db.js) — `dns.setServers` added before `mongoose.connect()`
- [data/seed.js](../data/seed.js) — `dns.setServers` added before `mongoose.connect()`

---

## 10. Running the Seed Script

The seed script (`data/seed.js`) populates all 4 collections with the initial portfolio data that was previously hardcoded in the React components.

**Run once from the project root:**

```bash
node data/seed.js
```

**What it does (in order):**

1. Loads `.env` via `dotenv.config()`
2. Sets Google DNS via `dns.setServers()`
3. Connects to MongoDB Atlas via `mongoose.connect(process.env.MONGO_URI)`
4. Deletes all documents from `educations`, `works`, `projects`, `skills` (`deleteMany({})`)
5. Inserts seed data into all 4 collections (`insertMany(...)`)
6. Disconnects and exits with code `0`

**Expected output:**

```
Connected to MongoDB
Cleared existing data
Seed data inserted successfully
Disconnected from MongoDB
```

**Re-running the seed** is safe — `deleteMany` clears existing data first, so there are no duplicates.

**When to re-run:** Only if you reset the database or need to restore the initial data. Once the admin CMS is built, content will be updated via the API, not the seed script.

---

## 11. Render Deployment — Environment Variable

The `.env` file is gitignored and never deployed. On Render, environment variables must be set manually via the dashboard.

**Steps:**

1. Render dashboard → select your web service → **Environment** tab.
2. Click **Add Environment Variable**.
3. Add:
   - Key: `MONGO_URI`
   - Value: the full connection string (same as in `.env`)
4. Click **Save Changes** — Render will redeploy automatically.

**No changes to build/start commands:**

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Start command | `node server.js` |

These remain unchanged. The `MONGO_URI` env var is picked up by `dotenv` at runtime.

**Note on `PORT`:** Render injects its own `PORT` env var automatically. The `process.env.PORT || 8080` fallback in `server.js` handles both Render and local correctly — do not set `PORT` manually on Render.

---

## 12. Data Model — Collections and Schemas

All schemas are defined in the `models/` directory using Mongoose.

### `educations` — [models/Education.js](../models/Education.js)

| Field | Type | Required | Notes |
|---|---|---|---|
| `date` | String | Yes | e.g. `"2019 – 2023"` |
| `title` | String | Yes | Degree/qualification name |
| `school` | String | Yes | Institution name |
| `location` | String | Yes | City, Country |
| `grade` | String | Yes | CGPA or percentage |
| `order` | Number | No | Sort order (ascending = top of timeline) |

### `works` — [models/Work.js](../models/Work.js)

| Field | Type | Required | Notes |
|---|---|---|---|
| `date` | String | Yes | e.g. `"Jan 2026 – Present"` |
| `title` | String | Yes | Job title |
| `company` | String | Yes | Employer name |
| `location` | String | Yes | City, Country |
| `desc` | String | Yes | Role description |
| `order` | Number | No | Sort order |

### `projects` — [models/Project.js](../models/Project.js)

| Field | Type | Required | Notes |
|---|---|---|---|
| `imageKey` | String | Yes | Maps to a local image import in `Projects.js` (e.g. `"Portfolio"`) |
| `type` | String | Yes | e.g. `"Full-Stack"`, `"Back-End"` |
| `typeColor` | String | Yes | Hex color for the type badge |
| `tags` | [String] | No | Tech stack tags |
| `title` | String | Yes | Project name |
| `desc` | String | Yes | Short description |
| `link` | String | Yes | GitHub URL |
| `order` | Number | No | Sort order |

> **Note on `imageKey`:** Project images are local assets in `client/src/assets/images/`. The DB stores a key string (e.g. `"Portfolio"`). `Projects.js` has a local `imageMap` object that maps keys to imported images. When adding a new project with a new image, the image must be added to `assets/images/` and the `imageMap` in `Projects.js` must be updated.

### `skills` — [models/Skill.js](../models/Skill.js)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Display name (e.g. `"TypeScript"`) |
| `iconName` | String | Yes | Key in `iconRegistry` (e.g. `"SiTypescript"`) |
| `order` | Number | No | Sort order |

> **Note on `iconName`:** React icon components cannot be stored in a database. The DB stores a string key. `SkillsList.js` exports `iconRegistry` — a flat object mapping key strings to React icon components. When adding a new skill, the icon must first be imported and added to `iconRegistry` in `SkillsList.js`, then the `iconName` string can be used in the DB.

### `order` field — sorting strategy

All collections have an `order` field (Number, default 0). All GET controllers sort by `{ order: 1 }` (ascending). Lower `order` = appears first on the UI. The seed data uses `order: 1` for the newest/most prominent item so timelines display newest-first.

---

## 13. API Endpoints

All endpoints are mounted under `/api/v1/potfolio/` (note: intentional legacy typo — fixing it would break existing consumers).

| Method | Path | Handler | Auth |
|---|---|---|---|
| GET | `/api/v1/potfolio/educations` | `getEducationsController` | None (public) |
| GET | `/api/v1/potfolio/works` | `getWorksController` | None (public) |
| GET | `/api/v1/potfolio/projects` | `getProjectsController` | None (public) |
| GET | `/api/v1/potfolio/skills` | `getSkillsController` | None (public) |
| POST | `/api/v1/potfolio/sendEmail` | `sendEmailController` | None (stub) |

**Response format (all GET endpoints):**

```json
{
  "success": true,
  "data": [ ... ]
}
```

**How React consumes them:**

Each page component uses `useEffect` + `fetch`:

```js
useEffect(() => {
  fetch("/api/v1/potfolio/educations")
    .then(res => res.json())
    .then(json => { if (json.success) setEducations(json.data); })
    .catch(err => console.error("Failed to fetch educations:", err));
}, []);
```

The CRA proxy (`"proxy": "http://localhost:8080"` in `client/package.json`) forwards `/api/...` requests to the Express server in development. In production, Express serves both the static files and the API from the same port, so no proxy is needed.

---

## 14. Troubleshooting Reference

| Error | Cause | Fix |
|---|---|---|
| `querySrv ECONNREFUSED _mongodb._tcp.mongodb2398` | `@` in password not URL-encoded; URI parser misidentifies hostname | Replace `@` in password with `%40` |
| `querySrv ECONNREFUSED _mongodb._tcp.ps-portfolio...` | Node.js c-ares DNS resolver blocked on port 53 (Windows firewall/policy) | Add `dns.setServers(["8.8.8.8", "8.8.4.4"])` in `config/db.js` and `data/seed.js` |
| `MongoServerError: bad auth` | Wrong username or password in URI | Verify credentials in Atlas → Database Access |
| `MongoNetworkTimeoutError` | IP not whitelisted in Atlas | Atlas → Network Access → set to `0.0.0.0/0` |
| Data not appearing on site | Seed not run | Run `node data/seed.js` from project root |
| Site works locally but not on Render | `MONGO_URI` not set on Render | Render dashboard → Environment → add `MONGO_URI` |
| Collections exist but are empty | Seed ran before cluster was ready | Re-run `node data/seed.js` |
