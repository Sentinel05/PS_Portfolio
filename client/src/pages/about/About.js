import React from "react";
import "./About.css";
import Pic from "../../assets/images/Priyanshu.jpeg";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="about" id="about">
      <motion.div
        className="about__card glass-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="about__image-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <img src={Pic} alt="Priyanshu Sarkar" className="about__image" />
          <div className="about__image-ring" />
        </motion.div>

        <motion.div
          className="about__content"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="about__title">About Me</h2>
          <hr className="section-divider" style={{ margin: "0.75rem 0 1.25rem" }} />
          <p className="about__text">
            I am a <strong>Software Engineer at OpenText</strong>, developing and enhancing
            integrational features for Data Protector — enabling enterprises to protect critical
            environments like SAP HANA, VMware, Documentum and Windows Defender. My role
            combines innovation with customer focus, ensuring complex incidents are resolved
            with efficiency and precision.
          </p>
          <p className="about__text">
            I thrive on solving technical challenges, optimising system performance, and creating
            solutions that directly impact enterprise reliability and customer trust.
          </p>
          <div className="about__tags">
            {["TypeScript", "C++", "Angular", "React", "REST APIs", "Data Protector"].map((tag) => (
              <span key={tag} className="about__tag">{tag}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
