const express = require("express");
const {
  sendEmailController,
  getEducationsController,
  getWorksController,
  getProjectsController,
  getSkillsController,
} = require("../controllers/portfolioController");
const { chatController } = require("../controllers/chatController");
const { createItem, updateItem, deleteItem } = require("../controllers/crudController");
const authMiddleware = require("../middleware/auth");
const Visit = require("../models/Visit");

//router object
const router = express.Router();

// Public routes
router.post("/sendEmail", sendEmailController);
router.get("/educations", getEducationsController);
router.get("/works", getWorksController);
router.get("/projects", getProjectsController);
router.get("/skills", getSkillsController);
router.post("/chat", chatController);

// Guest visit tracking — public log, protected read
router.post("/visits", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ success: false, message: "Name is required" });
    const visit = await Visit.create({ name: name.trim() });
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
const collections = ["educations", "works", "projects", "skills"];
collections.forEach((col) => {
  router.post(`/${col}`, authMiddleware, createItem(col));
  router.put(`/${col}/:id`, authMiddleware, updateItem(col));
  router.delete(`/${col}/:id`, authMiddleware, deleteItem(col));
});

//export
module.exports = router;
