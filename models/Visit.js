const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  visitedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Visit", VisitSchema);
