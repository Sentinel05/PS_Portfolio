import React, { useEffect, useState } from "react";
import "./Educations.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { MdSchool } from "react-icons/md";
import { motion } from "framer-motion";

const Educations = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/ps-portfolio/educations")
      .then((res) => res.json())
      .then((json) => { if (json.success) setEducations(json.data); })
      .catch((err) => console.error("Failed to fetch educations:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="education" id="education">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading">Education</h2>
        <hr className="section-divider" />
        <p className="section-subheading">My academic qualifications</p>
      </motion.div>

      {loading ? (
        <div className="skel-timeline">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skel-timeline-item">
              <div className="skeleton skel-timeline-icon" />
              <div className="skel-timeline-card">
                <div className="skeleton skel-line skel-line--title" />
                <div className="skeleton skel-line skel-line--sub" />
                <div className="skeleton skel-line skel-line--short" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <VerticalTimeline lineColor="rgba(124,58,237,0.25)">
          {educations.map((edu, i) => (
            <VerticalTimelineElement
              key={i}
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid rgba(124,58,237,0.18)",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                color: "var(--text)",
              }}
              contentArrowStyle={{ borderRight: "7px solid rgba(124,58,237,0.3)" }}
              date={edu.date}
              dateClassName="edu-date"
              iconStyle={{ background: "#7c3aed", color: "#fff", boxShadow: "0 0 0 4px rgba(124,58,237,0.25)" }}
              icon={<MdSchool />}
            >
              <h3 className="edu-title">{edu.title}</h3>
              <h4 className="edu-school">{edu.school}</h4>
              <p className="edu-location">{edu.location}</p>
              <span className="edu-grade">{edu.grade}</span>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      )}
    </section>
  );
};

export default Educations;

