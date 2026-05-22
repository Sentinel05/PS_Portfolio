import React from "react";
import "./Skills.css";
import { SkillsList } from "../../utils/SkillsList.js";
import { motion } from "framer-motion";

const Skills = () => {
  return (
    <section className="skills" id="skill">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading">Skills</h2>
        <hr className="section-divider" />
        <p className="section-subheading">
          Languages, Frameworks, Databases, and Tools
        </p>
      </motion.div>

      <div className="skills__grid">
        {SkillsList.map((skill, i) => (
          <motion.div
            key={skill._id}
            className="skill-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            whileHover={{ y: -4, scale: 1.03 }}
          >
            <skill.icon className="skill-card__icon" />
            <span className="skill-card__name">{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
