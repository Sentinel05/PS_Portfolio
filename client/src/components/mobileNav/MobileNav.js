import { React, useState } from "react";
import "./MobileNav.css";
import { FcHome, FcAbout, FcBusiness, FcContacts } from "react-icons/fc";
import { MdMilitaryTech } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { IoConstruct } from "react-icons/io5";
import { Link } from "react-scroll";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  //handle open
  const handleOpen = () => {
    setOpen(!open);
  };

  //handle menu clicks
  const handleMenuClicks = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="mobile-nav">
        <div className="mobile-nav-header">
          {open ? (
            <AiOutlineMenuFold
              size={30}
              className="mobile-nav-icon"
              onClick={handleOpen}
            ></AiOutlineMenuFold>
          ) : (
            <AiOutlineMenuUnfold
              size={30}
              className="mobile-nav-icon"
              onClick={handleOpen}
            ></AiOutlineMenuUnfold>
          )}
          <span className="mobile-nav-title">My Portfolio App</span>
        </div>
        {open && (
          <div className="mobile-nav-menu">
            <div className="nav-items">
              <div className="nav-item">
                <div className="nav-link">
                  <Link
                    to="home"
                    spy={true}
                    smooth={true}
                    duration={100}
                    onClick={handleMenuClicks}
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
                    onClick={handleMenuClicks}
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
                    onClick={handleMenuClicks}
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
                    onClick={handleMenuClicks}
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
                    onClick={handleMenuClicks}
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
                    onClick={handleMenuClicks}
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
                    onClick={handleMenuClicks}
                  >
                    <FcContacts></FcContacts>
                    Contact Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileNav;
