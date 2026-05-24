const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

// Force Node.js DNS resolver to use Google's public DNS — fixes SRV lookup
// failures on some Windows setups where c-ares can't reach the system resolver
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Education = require("../models/Education");
const Work = require("../models/Work");
const Project = require("../models/Project");
const Skill = require("../models/Skill");

dotenv.config();

const educations = [
  {
    date: "2019 – 2023",
    title: "Bachelor of Engineering (ECE)",
    school: "Nitte Meenakshi Institute of Technology",
    location: "Bengaluru, India",
    grade: "7.75 CGPA",
    order: 1,
  },
  {
    date: "2018 – 2019",
    title: "Higher Secondary (PCM + CS)",
    school: "Kendriya Vidyalaya AFS Sulur",
    location: "Sulur, India",
    grade: "91%",
    order: 2,
  },
  {
    date: "2016 – 2017",
    title: "Secondary (10th)",
    school: "Kendriya Vidyalaya AFS Sulur",
    location: "Sulur, India",
    grade: "10.00 CGPA",
    order: 3,
  },
];

const works = [
  {
    date: "Jan 2026 – Present",
    title: "Software Engineer",
    company: "OpenText",
    location: "Bengaluru, India",
    desc: "Leading development of Windows Defender integration and complex enterprise customer incident resolution.",
    order: 1,
  },
  {
    date: "Sept 2023 – Dec 2025",
    title: "Associate Software Engineer",
    company: "OpenText",
    location: "Bengaluru, India",
    desc: "Developed integrational features for SAP HANA, VMware and Documentum backups in Data Protector.",
    order: 2,
  },
  {
    date: "Feb 2023 – Aug 2023",
    title: "Software Engineer Intern",
    company: "Micro Focus",
    location: "Bengaluru, India",
    desc: "Contributed to enterprise backup and recovery solutions, gaining hands-on experience with Data Protector.",
    order: 3,
  },
];

const projects = [
  {
    imageKey: "Portfolio",
    type: "Full-Stack",
    typeColor: "#7c3aed",
    tags: ["Node", "Express", "React", "MongoDB"],
    title: "Portfolio Website",
    desc: "A full-stack MERN portfolio showcasing projects, skills and work experience with a modern design.",
    link: "https://github.com/Sentinel05/PS_Portfolio",
    order: 1,
  },
  {
    imageKey: "TicTacToe",
    type: "Back-End",
    typeColor: "#0891b2",
    tags: ["C++", "Backtracking", "AI"],
    title: "Tic Tac Toe",
    desc: "A terminal-based Tic Tac Toe game with an unbeatable AI opponent implemented using backtracking.",
    link: "https://github.com/Sentinel05/Tic-Tac-Toe",
    order: 2,
  },
  {
    imageKey: "Supermarket",
    type: "Back-End",
    typeColor: "#059669",
    tags: ["C++", "File Management"],
    title: "Supermarket Portal",
    desc: "A file-based supermarket management system with product CRUD, billing and inventory control.",
    link: "https://github.com/Sentinel05/Supermarket-Portal",
    order: 3,
  },
];

const skills = [
  { name: "TypeScript", iconName: "SiTypescript", order: 1 },
  { name: "JavaScript", iconName: "SiJavascript", order: 2 },
  { name: "C++", iconName: "TbBrandCpp", order: 3 },
  { name: "HTML", iconName: "TbHtml", order: 4 },
  { name: "CSS", iconName: "BiSolidFileCss", order: 5 },
  { name: "C", iconName: "TbBrandComedyCentral", order: 6 },
  { name: "Java", iconName: "FaJava", order: 7 },
  { name: "Python", iconName: "FaPython", order: 8 },
  { name: "Angular", iconName: "FaAngular", order: 9 },
  { name: "React", iconName: "FaReact", order: 10 },
  { name: "SQL", iconName: "TbSql", order: 11 },
  { name: "Jest", iconName: "SiJest", order: 12 },
  { name: "Postman", iconName: "SiPostman", order: 13 },
  { name: "RESTful APIs", iconName: "TbApi", order: 14 },
  { name: "VS Code", iconName: "SiVscodium", order: 15 },
  { name: "Jupyter Notebook", iconName: "SiJupyter", order: 16 },
  { name: "Turbo C++", iconName: "GrDos", order: 17 },
  { name: "SDN", iconName: "FaNetworkWired", order: 18 },
  { name: "Mininet", iconName: "FaWifi", order: 19 },
  { name: "Miniedit", iconName: "BsHddNetwork", order: 20 },
  { name: "Wireshark", iconName: "SiWireshark", order: 21 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Education.deleteMany({});
    await Work.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    console.log("Cleared existing data");

    await Education.insertMany(educations);
    await Work.insertMany(works);
    await Project.insertMany(projects);
    await Skill.insertMany(skills);
    console.log("Seed data inserted successfully");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
