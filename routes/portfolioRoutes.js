const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  sendEmailController,
  getEducationsController,
  getWorksController,
  getProjectsController,
  getSkillsController,
  getCertificationsController,
} = require("../controllers/portfolioController");
const { chatController } = require("../controllers/chatController");
const { createItem, updateItem, deleteItem } = require("../controllers/crudController");
const authMiddleware = require("../middleware/auth");
const Visit = require("../models/Visit");

//router object
const router = express.Router();

// Rate limiters
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 10,                   // 10 messages per minute per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many messages. Please wait a moment before trying again." },
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5,                    // 5 emails per hour per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many contact requests. Please try again later." },
});

// Public routes
router.post("/sendEmail", emailLimiter, sendEmailController);
router.get("/educations", getEducationsController);
router.get("/works", getWorksController);
router.get("/projects", getProjectsController);
router.get("/skills", getSkillsController);
router.get("/certifications", getCertificationsController);
router.post("/chat", chatLimiter, chatController);

// Guest visit tracking — public log, protected read
const geoLookup = (ip) =>
  new Promise((resolve) => {
    // ip-api.com free tier: no key required, HTTP only, 45 req/min limit
    // Use "fields" param to fetch only what we need
    const url = `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`;
    // ip-api requires plain HTTP; use node's http module via a simple fetch-like wrapper
    const http = require("http");
    http.get(url, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end", () => {
        try {
          const json = JSON.parse(raw);
          if (json.status === "success") {
            resolve({ country: json.country || "", city: json.city || "", countryCode: json.countryCode || "" });
          } else {
            resolve({ country: "", city: "", countryCode: "" });
          }
        } catch {
          resolve({ country: "", city: "", countryCode: "" });
        }
      });
    }).on("error", () => resolve({ country: "", city: "", countryCode: "" }));
  });

router.post("/visits", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ success: false, message: "Name is required" });

    // Resolve real IP behind proxies (Render sets x-forwarded-for)
    const forwarded = req.headers["x-forwarded-for"];
    const rawIp = forwarded ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;
    // Strip IPv6 loopback prefix so ip-api gets a plain IPv4 address
    const ip = rawIp === "::1" || rawIp === "127.0.0.1" ? "" : rawIp.replace(/^::ffff:/, "");

    const geo = ip ? await geoLookup(ip) : { country: "", city: "", countryCode: "" };

    const visit = await Visit.create({ name: name.trim(), ...geo });
    res.json({ success: true, data: visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/visits", authMiddleware, async (req, res) => {
  try {
    const visits = await Visit.find().sort({ visitedAt: -1 }).limit(200);
    const total = await Visit.countDocuments();
    res.json({ success: true, data: visits, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Protected CRUD routes (admin only)
const collections = ["educations", "works", "projects", "skills", "certifications"];
collections.forEach((col) => {
  router.post(`/${col}`, authMiddleware, createItem(col));
  router.put(`/${col}/:id`, authMiddleware, updateItem(col));
  router.delete(`/${col}/:id`, authMiddleware, deleteItem(col));
});

//export
module.exports = router;
