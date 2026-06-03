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
const Certification = require("../models/Certification");

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
    desc: "Developing end-to-end Web UI workflows for the Malware Scan feature, integrating multiple antivirus engines (Microsoft Defender, ClamAV, Symantec) to secure virtual environment backup and restore operations. Contributed to UI architecture, API design, and end-to-end workflow development involving scan engine configuration, scan policy creation, and scan execution. Mentoring new engineers in Web UI development, providing technical direction and conducting code reviews.",
    order: 1,
  },
  {
    date: "Sept 2023 – Dec 2025",
    title: "Associate Software Engineer",
    company: "OpenText",
    location: "Bengaluru, India",
    desc: "Led end-to-end development of Web UI workflows for Restore integrations across SAP HANA, VMware, and Documentum. Integrated SAP HANA Store Key-based authentication into APIs and UI workflows. Built reusable UI components reducing development effort by 70%. Enabled Disk-only, Disk + Tape, and Point-in-Time Recovery workflows in MFC UI. Re-architected SAP HANA backup parameter workflow for cluster environments. Resolved critical STAT defects through root cause analysis.",
    order: 2,
  },
  {
    date: "Feb 2023 – Aug 2023",
    title: "Software Engineer Intern",
    company: "Micro Focus",
    location: "Bengaluru, India",
    desc: "Developed POC Web UI workflow for Granular Recovery in Data Protector. Extended production support to Hyper-V and H3C CAS hypervisors. Built modular Angular frontend with Jest unit testing. Integrated frontend with REST APIs for VM disk mount/unmount workflows.",
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
  // Languages
  { name: "TypeScript",        iconName: "SiTypescript",        category: "Languages",              order: 1  },
  { name: "JavaScript",        iconName: "SiJavascript",        category: "Languages",              order: 2  },
  { name: "Java",              iconName: "FaJava",              category: "Languages",              order: 3  },
  { name: "C++",               iconName: "TbBrandCpp",          category: "Languages",              order: 4  },
  { name: "C",                 iconName: "SiC",                 category: "Languages",              order: 5  },
  { name: "SQL",               iconName: "TbSql",               category: "Languages",              order: 6  },
  { name: "Python",            iconName: "FaPython",            category: "Languages",              order: 7  },
  { name: "Perl",              iconName: "SiPerl",              category: "Languages",              order: 8  },
  // Frontend
  { name: "HTML",              iconName: "TbHtml",              category: "Frontend",               order: 9  },
  { name: "CSS",               iconName: "BiSolidFileCss",      category: "Frontend",               order: 10 },
  { name: "LESS",              iconName: "SiLess",              category: "Frontend",               order: 11 },
  { name: "Bootstrap 5",       iconName: "SiBootstrap",         category: "Frontend",               order: 12 },
  // Frameworks & Libraries
  { name: "Angular",           iconName: "FaAngular",           category: "Frameworks & Libraries", order: 13 },
  { name: "React",             iconName: "FaReact",             category: "Frameworks & Libraries", order: 14 },
  { name: "Spring Boot",       iconName: "SiSpringboot",        category: "Frameworks & Libraries", order: 15 },
  { name: "Node.js",           iconName: "FaNodeJs",            category: "Frameworks & Libraries", order: 16 },
  { name: "Express.js",        iconName: "SiExpress",           category: "Frameworks & Libraries", order: 17 },
  { name: "Jest",              iconName: "SiJest",              category: "Frameworks & Libraries", order: 18 },
  { name: "Mongoose",          iconName: "SiMongoose",          category: "Frameworks & Libraries", order: 19 },
  // Databases
  { name: "PostgreSQL",        iconName: "SiPostgresql",        category: "Databases",              order: 20 },
  { name: "MongoDB",           iconName: "SiMongodb",           category: "Databases",              order: 21 },
  { name: "Pinecone",          iconName: "TbVectorTriangle",    category: "Databases",              order: 22 },
  // DevOps
  { name: "Docker",            iconName: "SiDocker",            category: "DevOps",                 order: 23 },
  { name: "Kubernetes",        iconName: "SiKubernetes",        category: "DevOps",                 order: 24 },
  { name: "Render",            iconName: "SiRender",            category: "DevOps",                 order: 25 },
  // Tools
  { name: "Git",               iconName: "SiGit",               category: "Tools",                  order: 26 },
  { name: "GitLab",            iconName: "SiGitlab",            category: "Tools",                  order: 27 },
  { name: "GitHub",            iconName: "FaGithub",            category: "Tools",                  order: 28 },
  { name: "VS Code",           iconName: "SiVscodium",          category: "Tools",                  order: 29 },
  { name: "Postman",           iconName: "SiPostman",           category: "Tools",                  order: 30 },
  { name: "Swagger",           iconName: "SiSwagger",           category: "Tools",                  order: 31 },
  { name: "Figma",             iconName: "SiFigma",             category: "Tools",                  order: 32 },
  { name: "Visual Studio",     iconName: "TbBrandVisualStudio", category: "Tools",                  order: 33 },
  { name: "Jupyter Notebook",  iconName: "SiJupyter",           category: "Tools",                  order: 34 },
  { name: "MongoDB Atlas",     iconName: "SiMongodb",           category: "Tools",                  order: 35 },
  // Design & Architecture
  { name: "System Design",     iconName: "FaProjectDiagram",   category: "Design & Architecture",  order: 36 },
  { name: "UI/UX Design",      iconName: "MdDesignServices",   category: "Design & Architecture",  order: 37 },
  { name: "RAG",               iconName: "FaBrain",            category: "Design & Architecture",  order: 38 },
  { name: "JWT Authentication",iconName: "FaKey",              category: "Design & Architecture",  order: 39 },
];

const certifications = [
  {
    title: "Software Architecture & Design of Modern Large Scale Systems",
    issuer: "Udemy",
    date: "May 2026",
    link: "https://www.udemy.com/certificate/UC-ed2a6502-527c-471e-adf6-5dfd27b68ccf/",
    order: 1,
  },
  {
    title: "DESIGN RULES: Principles + Practices for Great UI Design",
    issuer: "Udemy",
    date: "Mar 2026",
    link: "https://ude.my/UC-8904c408-9824-432c-a88a-9c0e459f7289",
    order: 2,
  },
  {
    title: "Docker & Kubernetes: The Practical Guide [2025 Edition]",
    issuer: "Udemy",
    date: "Apr 2025",
    link: "https://www.udemy.com/certificate/UC-0eec8668-5363-4133-85cd-44f6410a3f16/",
    order: 3,
  },
  {
    title: "Java Programming: Arrays, Lists, and Structured Data",
    issuer: "Coursera",
    date: "Dec 2022",
    link: "https://www.coursera.org/account/accomplishments/certificate/JURD3SRYQLZJ",
    order: 4,
  },
  {
    title: "Java Programming: Solving Problems with Software",
    issuer: "Coursera",
    date: "Nov 2022",
    link: "https://www.coursera.org/account/accomplishments/certificate/3X5BVJUV9URX",
    order: 5,
  },
  {
    title: "Data Base Management System",
    issuer: "NPTEL",
    date: "Sept 2021",
    link: "https://nptel.ac.in/noc/E_Certificate/NPTEL21CS58S2319169903001999",
    order: 6,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Education.deleteMany({});
    await Work.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Certification.deleteMany({});
    console.log("Cleared existing data");

    await Education.insertMany(educations);
    await Work.insertMany(works);
    await Project.insertMany(projects);
    await Skill.insertMany(skills);
    await Certification.insertMany(certifications);
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
