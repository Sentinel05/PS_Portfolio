import React from "react";
import "./Skills.css";
import { SkillsList } from "../../utils/SkillsList.js";
import Bounce from "react-reveal/Bounce";

const Skills = () => {
  return (
    <>
      <div className="container skills" id="skill">
        <h2 className="col-12 mt-3 text-center">Skills</h2>
        <hr></hr>
        <p className="pb-3 text-center">
          👉including Languages, Frameworks, Databases, Front-end and Back-end
          tools and APIs
        </p>
        <Bounce right cascade>
          <div className="row">
            {SkillsList.map((skill) => (
              <div key={skill._id} className="col-md-3">
                <div className="card m-2">
                  <div className="card-content">
                    <div className="card-body">
                      <div className="media d-flex justify-content-center">
                        <div className="alig-self-center">
                          <skill.icon className="skill-icon" />
                        </div>
                        <div className="media-body">
                          <h5>{skill.name}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Bounce>
      </div>
    </>
  );
};

export default Skills;
