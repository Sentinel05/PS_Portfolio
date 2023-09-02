import React from "react";
import "./Educations.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { MdSchool } from "react-icons/md";

const Educations = () => {
  return (
    <>
      <div className="education" id="education">
        <h2 className="col-12 mt-3 text-center">Education Details</h2>
        <hr></hr>
        <p className="pb-3 text-center">
          👉here are my important educational qualifications
        </p>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "white", color: "black" }}
            contentArrowStyle={{ borderRight: "7px solid  white" }}
            date="2019 - 2023"
            iconStyle={{ background: "#138781", color: "#fff" }}
            icon={<MdSchool />}
          >
            <h3 className="vertical-timeline-element-title">
              Bachelor of Engineering (ECE)
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              Nitte Meenakshi Institute of Technology
            </h4>
            <div>(Bengaluru, India)</div>
            <p>Grade - 7.75 CGPA</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "white", color: "black" }}
            contentArrowStyle={{ borderRight: "7px solid  white" }}
            date="2018 - 2019"
            iconStyle={{ background: "#138781", color: "#fff" }}
            icon={<MdSchool />}
          >
            <h3 className="vertical-timeline-element-title">
              Higher Secondary (PCM + CS)
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              Kendriya Vidyalaya AFS Sulur
            </h4>
            <div>(Sulur, India)</div>
            <p>Grade - 91%</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "white", color: "black" }}
            contentArrowStyle={{ borderRight: "7px solid  white" }}
            date="2016 - 2017"
            iconStyle={{ background: "#138781", color: "#fff" }}
            icon={<MdSchool />}
          >
            <h3 className="vertical-timeline-element-title">Secondary</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Kendriya Vidyalaya AFS Sulur
            </h4>
            <div>(Sulur, India)</div>
            <p>Grade - 10.00 CGPA</p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </>
  );
};

export default Educations;
