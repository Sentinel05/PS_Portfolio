const express = require("express");
const { loginController, ingestController } = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST /api/v1/admin/login
router.post("/login", loginController);

// POST /api/v1/admin/ingest  (JWT-protected)
router.post("/ingest", authMiddleware, ingestController);

module.exports = router;
