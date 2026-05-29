const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconName: { type: String, required: true },
  category: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model("Skill", skillSchema);
