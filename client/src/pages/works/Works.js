import React from "react";
import "./Works.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { MdWork } from "react-icons/md";

const Works = () => {
  return (
    <>
      <div className="conatiner work" id="work">
        <h2 className="col-12 mt-3 text-center">Work Experience</h2>
        <hr></hr>
        <p className="pb-3 text-center">👉here are my work experiences</p>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "#138781", color: "black" }}
            contentArrowStyle={{ borderRight: "7px solid  #138781" }}
            date="Feb 2023 - Aug 2023"
            iconStyle={{ background: "#138781", color: "#fff" }}
            icon={<MdWork />}
          >
            <h3 className="vertical-timeline-element-title">
              Software Engineer Intern
            </h3>
            <h4 className="vertical-timeline-element-subtitle">Micro Focus</h4>
            <div className="work-location">(Bengaluru, India)</div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "#138781", color: "black" }}
            contentArrowStyle={{ borderRight: "7px solid  #138781" }}
            date="Sept 2023 - Present"
            iconStyle={{ background: "#138781", color: "#fff" }}
            icon={<MdWork />}
          >
            <h3 className="vertical-timeline-element-title">
              Associate Software Engineer
            </h3>
            <h4 className="vertical-timeline-element-subtitle">OpenText</h4>
            <div className="work-location">(Bengaluru, India)</div>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </>
  );
};

export default Works;
