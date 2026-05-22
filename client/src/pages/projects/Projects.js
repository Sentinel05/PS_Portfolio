import React from "react";
import "./Projects.css";
import Portfolio from "../../assets/images/Portfolio.png";
import TicTacToe from "../../assets/images/TicTacToe.png";
import Supermarket from "../../assets/images/Supermarket.png";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

const projects = [
  {
    image: Portfolio,
    type: "Full-Stack",
    typeColor: "#7c3aed",
    tags: ["Node", "Express", "React", "MongoDB"],
    title: "Portfolio Website",
    desc: "A full-stack MERN portfolio showcasing projects, skills and work experience with a modern design.",
    link: "https://github.com/Sentinel05/PS_Portfolio",
  },
  {
    image: TicTacToe,
    type: "Back-End",
    typeColor: "#0891b2",
    tags: ["C++", "Backtracking", "AI"],
    title: "Tic Tac Toe",
    desc: "A terminal-based Tic Tac Toe game with an unbeatable AI opponent implemented using backtracking.",
    link: "https://github.com/Sentinel05/Tic-Tac-Toe",
  },
  {
    image: Supermarket,
    type: "Back-End",
    typeColor: "#059669",
    tags: ["C++", "File Management"],
    title: "Supermarket Portal",
    desc: "A file-based supermarket management system with product CRUD, billing and inventory control.",
    link: "https://github.com/Sentinel05/Supermarket-Portal",
  },
];

const Projects = () => {
  return (
    <section className="projects" id="project">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading">Projects</h2>
        <hr className="section-divider" />
        <p className="section-subheading">My top recent projects</p>
      </motion.div>

      <div className="projects__grid">
        {projects.map((p, i) => (
          <motion.div
            key={i}
            className="project-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
          >
            <div className="project-card__img-wrap">
              <img src={p.image} alt={p.title} className="project-card__img" />
              <span
                className="project-card__badge"
                style={{ background: p.typeColor }}
              >
                {p.type}
              </span>
            </div>
            <div className="project-card__body">
              <div className="project-card__tags">
                {p.tags.map((t) => (
                  <span key={t} className="project-card__tag">{t}</span>
                ))}
              </div>
              <h3 className="project-card__title">{p.title}</h3>
              <p className="project-card__desc">{p.desc}</p>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="project-card__link"
              >
                <FiExternalLink size={14} />
                View on GitHub
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
