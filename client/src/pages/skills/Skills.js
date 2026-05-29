import React, { useEffect, useState } from "react";
import "./Skills.css";
import { iconRegistry } from "../../utils/SkillsList.js";
import { motion } from "framer-motion";

const CATEGORY_ORDER = [
  "Languages",
  "Frontend",
  "Frameworks & Libraries",
  "Databases",
  "DevOps",
  "Tools",
];

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("/api/v1/ps-portfolio/skills")
      .then((res) => res.json())
      .then((json) => { if (json.success) setSkills(json.data); })
      .catch((err) => console.error("Failed to fetch skills:", err));
  }, []);

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = skills.filter((s) => s.category === cat);
    if (items.length > 0) acc.push({ category: cat, items });
    return acc;
  }, []);

  const uncategorised = skills.filter(
    (s) => !s.category || !CATEGORY_ORDER.includes(s.category)
  );

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

      <div className="skills__categories">
        {grouped.map(({ category, items }, gi) => (
          <motion.div
            key={category}
            className="skills__group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: gi * 0.07 }}
          >
            <h3 className="skills__group-title">{category}</h3>
            <div className="skills__grid">
              {items.map((skill, i) => {
                const Icon = iconRegistry[skill.iconName];
                return (
                  <motion.div
                    key={skill._id}
                    className="skill-card glass-card"
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                  >
                    {Icon && <Icon className="skill-card__icon" />}
                    <span className="skill-card__name">{skill.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {uncategorised.length > 0 && (
          <div className="skills__group">
            <h3 className="skills__group-title">Other</h3>
            <div className="skills__grid">
              {uncategorised.map((skill, i) => {
                const Icon = iconRegistry[skill.iconName];
                return (
                  <motion.div
                    key={skill._id}
                    className="skill-card glass-card"
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                  >
                    {Icon && <Icon className="skill-card__icon" />}
                    <span className="skill-card__name">{skill.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;

