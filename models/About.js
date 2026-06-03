const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  paragraphs: [{ type: String }],
  tags: [{ type: String }],
});

module.exports = mongoose.model("About", aboutSchema);
