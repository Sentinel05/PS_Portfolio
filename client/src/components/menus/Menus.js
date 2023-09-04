import React from "react";
import "./Menus.css";
import { FcHome, FcAbout, FcBusiness, FcContacts } from "react-icons/fc";
import { MdMilitaryTech } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { IoConstruct } from "react-icons/io5";
import { Link } from "react-scroll";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";
import Pic from "../../assets/images/cool-dp.jpg";

const Menus = ({ toggle }) => {
  return (
    <>
      {toggle ? (
        <>
          <Zoom>
            <div className="navbar-profile-pic">
              <img src={Pic} alt="dp"></img>
            </div>
          </Zoom>
          <Fade left cascade>
            <div className="nav-items">
              <div className="nav-item">
                <div className="nav-link">
                  <Link
                    to="home"
                    spy={true}
                    smooth={true}
                    duration={100}
                    offset={-10}
                  >
                    <FcHome></FcHome>
                    Home
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link
                    to="about"
                    spy={true}
                    smooth={true}
                    duration={100}
                    offset={-25}
                  >
                    <FcAbout></FcAbout>
                    About
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link
                    to="education"
                    spy={true}
                    smooth={true}
                    duration={100}
                    offset={-25}
                  >
                    <GiGraduateCap></GiGraduateCap>
                    Educatiion Details
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link
                    to="work"
                    spy={true}
                    smooth={true}
                    duration={100}
                    offset={-25}
                  >
                    <FcBusiness></FcBusiness>
                    Work Experience
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link
                    to="skill"
                    spy={true}
                    smooth={true}
                    duration={100}
                    offset={-25}
                  >
                    <MdMilitaryTech></MdMilitaryTech>
                    Skills
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link
                    to="project"
                    spy={true}
                    smooth={true}
                    duration={100}
                    offset={-25}
                  >
                    <IoConstruct></IoConstruct>
                    Projects
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link
                    to="contact"
                    spy={true}
                    smooth={true}
                    duration={100}
                    offset={-25}
                  >
                    <FcContacts></FcContacts>
                    Contact Details
                  </Link>
                </div>
              </div>
            </div>
          </Fade>
        </>
      ) : (
        <>
          <Fade left cascade>
            <div className="nav-items">
              <div className="nav-item">
                <div className="nav-link">
                  <Link to="home" spy={true} smooth={true} duration={100}>
                    <FcHome></FcHome>
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link to="about" spy={true} smooth={true} duration={100}>
                    <FcAbout></FcAbout>
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link to="education" spy={true} smooth={true} duration={100}>
                    <GiGraduateCap></GiGraduateCap>
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link to="work" spy={true} smooth={true} duration={100}>
                    <FcBusiness></FcBusiness>
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link to="skill" spy={true} smooth={true} duration={100}>
                    <MdMilitaryTech></MdMilitaryTech>
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link to="project" spy={true} smooth={true} duration={100}>
                    <IoConstruct></IoConstruct>
                  </Link>
                </div>
              </div>
              <div className="nav-item">
                <div className="nav-link">
                  <Link to="contact" spy={true} smooth={true} duration={100}>
                    <FcContacts></FcContacts>
                  </Link>
                </div>
              </div>
            </div>
          </Fade>
        </>
      )}
    </>
  );
};

export default Menus;
