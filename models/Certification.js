const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  link: { type: String, required: true },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model("Certification", certificationSchema);
