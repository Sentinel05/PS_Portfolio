import React, { useEffect, useState } from "react";
import "./Projects.css";
import Portfolio from "../../assets/images/Portfolio.png";
import TicTacToe from "../../assets/images/TicTacToe.png";
import Supermarket from "../../assets/images/Supermarket.png";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

const imageMap = {
  Portfolio,
  TicTacToe,
  Supermarket,
};

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/v1/ps-portfolio/projects")
      .then((res) => res.json())
      .then((json) => { if (json.success) setProjects(json.data); })
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

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
            key={p._id}
            className="project-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
          >
            <div className="project-card__img-wrap">
              <img src={imageMap[p.imageKey]} alt={p.title} className="project-card__img" />
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
