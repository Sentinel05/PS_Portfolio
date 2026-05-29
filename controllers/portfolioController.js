const Education = require("../models/Education");
const Work = require("../models/Work");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const nodemailer = require("nodemailer");

const sendEmailController = async (req, res) => {
  try {
    const { from_name, from_email, message } = req.body;

    if (!from_name || !from_email || !message) {
      return res.status(400).send({ success: false, message: "All fields are required." });
    }

    console.log("[sendEmail] GMAIL_USER:", process.env.GMAIL_USER);
    console.log("[sendEmail] GMAIL_PASS set:", !!process.env.GMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("[sendEmail] Transporter verified OK");

    const info = await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: from_email,
      subject: `New message from ${from_name} via Portfolio`,
      text: `Name: ${from_name}\nEmail: ${from_email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${from_name}</p><p><strong>Email:</strong> <a href="mailto:${from_email}">${from_email}</a></p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    console.log("[sendEmail] Message sent, messageId:", info.messageId);
    console.log("[sendEmail] Accepted:", info.accepted);
    console.log("[sendEmail] Rejected:", info.rejected);

    return res.status(200).send({
      success: true,
      message: "Your message sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Send email API error",
      error: error.message,
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
