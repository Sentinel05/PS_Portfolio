import React from "react";
import "./About.css";
import RubberBand from "react-reveal/RubberBand";
import Jello from "react-reveal/Jello";
import Bounce from "react-reveal/Bounce";
import Pic from "../../assets/images/Priyanshu.jpg";

const About = () => {
  return (
    <>
      <div className="about" id="about">
        <div className="row">
          <Jello>
            <div className="col-md-4 col-xl-4 col-lg-4 col-xs-12 about-image">
              <img src={Pic} alt="profile_pic"></img>
            </div>
          </Jello>
          <div className="col-md-8 col-xl-8 col-lg-8 col-xs-12 about-content">
            <RubberBand>
              <h1>About me</h1>
            </RubberBand>
            <Bounce>
              <p>
                I am a Software Engineer at OpenText, I develop and enhance
                integrational features for Data Protector, enabling enterprises
                to protect critical environments like SAP HANA, VMware,
                Documentum and Windows Defender. My role combines
                innovation—building integrations that expand product
                capabilities—with customer focus, ensuring complex incidents are
                resolved with efficiency and precision. I thrive on solving
                technical challenges, optimizing system performance, and
                creating solutions that directly impact enterprise reliability
                and customer trust.
              </p>
            </Bounce>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
