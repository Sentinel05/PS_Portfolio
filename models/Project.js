const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  imageKey: { type: String, required: true },
  type: { type: String, required: true },
  typeColor: { type: String, required: true },
  tags: [{ type: String }],
  title: { type: String, required: true },
  desc: { type: String, required: true },
  link: { type: String, required: true },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model("Project", projectSchema);
