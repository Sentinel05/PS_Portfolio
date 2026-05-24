const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  school: { type: String, required: true },
  location: { type: String, required: true },
  grade: { type: String, required: true },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model("Education", educationSchema);
