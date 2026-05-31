const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  visitedAt: { type: Date, default: Date.now },
  country:   { type: String, default: "" },
  city:      { type: String, default: "" },
  countryCode: { type: String, default: "" },
});

module.exports = mongoose.model("Visit", VisitSchema);
