import React, { useEffect, useState } from "react";
import "./Works.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { MdWork } from "react-icons/md";
import { motion } from "framer-motion";

const Works = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/ps-portfolio/works")
      .then((res) => res.json())
      .then((json) => { if (json.success) setWorks(json.data); })
      .catch((err) => console.error("Failed to fetch works:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="work" id="work">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading">Work Experience</h2>
        <hr className="section-divider" />
        <p className="section-subheading">My professional journey</p>
      </motion.div>

      {loading ? (
        <div className="skel-timeline">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skel-timeline-item">
              <div className="skeleton skel-timeline-icon" />
              <div className="skel-timeline-card">
                <div className="skeleton skel-line skel-line--title" />
                <div className="skeleton skel-line skel-line--sub" />
                <div className="skeleton skel-line skel-line--body" />
                <div className="skeleton skel-line skel-line--body-sm" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <VerticalTimeline lineColor="rgba(6,182,212,0.25)">
          {works.map((w, i) => (
            <VerticalTimelineElement
              key={i}
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid rgba(6,182,212,0.2)",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                color: "var(--text)",
              }}
              contentArrowStyle={{ borderRight: "7px solid rgba(6,182,212,0.3)" }}
              date={w.date}
              dateClassName="work-date"
              iconStyle={{ background: "#0891b2", color: "#fff", boxShadow: "0 0 0 4px rgba(6,182,212,0.2)" }}
              icon={<MdWork />}
            >
              <h3 className="work-title">{w.title}</h3>
              <h4 className="work-company">{w.company}</h4>
              <p className="work-location">{w.location}</p>
              <p className="work-desc">{w.desc}</p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      )}
    </section>
  );
};

export default Works;
