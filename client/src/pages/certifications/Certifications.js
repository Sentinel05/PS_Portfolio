import React, { useEffect, useState } from "react";
import "./Certifications.css";
import { motion } from "framer-motion";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";

const issuerColors = {
  Udemy:    { bg: "rgba(236,119,31,0.12)",  border: "rgba(236,119,31,0.3)",  text: "#ec771f" },
  Coursera: { bg: "rgba(0,87,183,0.12)",    border: "rgba(0,87,183,0.3)",    text: "#0057b7" },
  NPTEL:    { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)",   text: "#16a34a" },
};

const defaultColor = { bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)", text: "#a78bfa" };

const Certifications = () => {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetch("/api/v1/ps-portfolio/certifications")
      .then((res) => res.json())
      .then((json) => { if (json.success) setCerts(json.data); })
      .catch((err) => console.error("Failed to fetch certifications:", err));
  }, []);

  return (
    <section className="certifications" id="certification">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading">Certifications</h2>
        <hr className="section-divider" />
        <p className="section-subheading">Courses and credentials I've completed</p>
      </motion.div>

      <div className="cert__grid">
        {certs.map((cert, i) => {
          const color = issuerColors[cert.issuer] || defaultColor;
          return (
            <motion.a
              key={cert._id}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-card glass-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -5 }}
            >
              <div className="cert-card__icon-wrap" style={{ background: color.bg, border: `1px solid ${color.border}` }}>
                <HiOutlineBadgeCheck className="cert-card__icon" style={{ color: color.text }} />
              </div>

              <div className="cert-card__body">
                <h3 className="cert-card__title">{cert.title}</h3>
                <div className="cert-card__meta">
                  <span
                    className="cert-card__issuer"
                    style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
                  >
                    {cert.issuer}
                  </span>
                  <span className="cert-card__date">{cert.date}</span>
                </div>
              </div>

              <FiExternalLink className="cert-card__link-icon" />
            </motion.a>
          );
        })}
      </div>
    </section>
  );
};

export default Certifications;
