const Education = require("../models/Education");
const Work = require("../models/Work");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Certification = require("../models/Certification");

const modelMap = {
  educations: Education,
  works: Work,
  projects: Project,
  skills: Skill,
  certifications: Certification,
};

const createItem = (collection) => async (req, res) => {
  try {
    const Model = modelMap[collection];
    const item = new Model(req.body);
    await item.save();
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Create failed", error: err.message });
  }
};

const updateItem = (collection) => async (req, res) => {
  try {
    const Model = modelMap[collection];
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Update failed", error: err.message });
  }
};

const deleteItem = (collection) => async (req, res) => {
  try {
    const Model = modelMap[collection];
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};

module.exports = { createItem, updateItem, deleteItem };
