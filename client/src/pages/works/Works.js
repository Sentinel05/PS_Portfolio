import React from "react";
import "./Works.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { MdWork } from "react-icons/md";
import { motion } from "framer-motion";

const works = [
  {
    date: "Feb 2023 – Aug 2023",
    title: "Software Engineer Intern",
    company: "Micro Focus",
    location: "Bengaluru, India",
    desc: "Contributed to enterprise backup and recovery solutions, gaining hands-on experience with Data Protector.",
  },
  {
    date: "Sept 2023 – Dec 2025",
    title: "Associate Software Engineer",
    company: "OpenText",
    location: "Bengaluru, India",
    desc: "Developed integrational features for SAP HANA, VMware and Documentum backups in Data Protector.",
  },
  {
    date: "Jan 2026 – Present",
    title: "Software Engineer",
    company: "OpenText",
    location: "Bengaluru, India",
    desc: "Leading development of Windows Defender integration and complex enterprise customer incident resolution.",
  },
];

const Works = () => {
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
    </section>
  );
};

export default Works;
