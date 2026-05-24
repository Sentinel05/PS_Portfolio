const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  desc: { type: String, required: true },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model("Work", workSchema);
