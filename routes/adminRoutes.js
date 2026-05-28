const express = require("express");
const { loginController } = require("../controllers/adminController");

const router = express.Router();

// POST /api/v1/admin/login
router.post("/login", loginController);

module.exports = router;
