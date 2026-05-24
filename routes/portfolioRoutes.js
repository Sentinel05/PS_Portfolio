const express = require("express");
const {
  sendEmailController,
  getEducationsController,
  getWorksController,
  getProjectsController,
  getSkillsController,
} = require("../controllers/portfolioController");

//router object
const router = express.Router();

//routes
router.post("/sendEmail", sendEmailController);
router.get("/educations", getEducationsController);
router.get("/works", getWorksController);
router.get("/projects", getProjectsController);
router.get("/skills", getSkillsController);

//export
module.exports = router;
