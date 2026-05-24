const Education = require("../models/Education");
const Work = require("../models/Work");
const Project = require("../models/Project");
const Skill = require("../models/Skill");

const sendEmailController = (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Your message sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Send email API error",
      error,
    });
  }
};

const getEducationsController = async (req, res) => {
  try {
    const data = await Education.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch educations", error });
  }
};

const getWorksController = async (req, res) => {
  try {
    const data = await Work.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch works", error });
  }
};

const getProjectsController = async (req, res) => {
  try {
    const data = await Project.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch projects", error });
  }
};

const getSkillsController = async (req, res) => {
  try {
    const data = await Skill.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch skills", error });
  }
};

module.exports = {
  sendEmailController,
  getEducationsController,
  getWorksController,
  getProjectsController,
  getSkillsController,
};
