import React from "react";
import "./About.css";
import RubberBand from "react-reveal/RubberBand";
import Jello from "react-reveal/Jello";
import Bounce from "react-reveal/Bounce";

const About = () => {
  return (
    <>
      <div className="about" id="about">
        <div className="row">
          <Jello>
            <div className="col-md-6 col-xl-6 col-lg-6 col-xs-12 about-image">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0whpKMsSSdlJ3nK6himYaX967iYEepBgeQA&usqp=CAU"
                alt="profile_pic"
              ></img>
            </div>
          </Jello>
          <div className="col-md-6 col-xl-6 col-lg-6 col-xs-12 about-content">
            <RubberBand>
              <h1>About me</h1>
            </RubberBand>
            <Bounce>
              <p>
                I am a fresher with a 6 months decent experience working with
                TypeScript, Angular and REST APIs to develop the web UI for a
                hypervisor integration related feature of the product. I quickly
                learned Angular and other required skills to develop a working
                web UI for the POC of the same in a two-man team and also,
                worked for the rapid production level development for the same.
                Apart from this, I am also very confident with C++ since I have
                studied C++ quite a lot and made some projects using it along
                with which I have some decent knowledge about other languages as
                well like Java, Python, SQL, C.
              </p>
            </Bounce>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
