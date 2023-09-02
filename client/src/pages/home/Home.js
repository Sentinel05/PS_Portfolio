import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./Home.css";
import Typewriter from "typewriter-effect";
import Resume from "../../assets/documents/Priyanshu Resume 2.pdf";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import Fade from "react-reveal/Fade";
import Slide from "react-reveal/Slide";

const Home = () => {
  const [theme, setTheme] = useTheme();

  //handle Theme
  const handleTheme = () => {
    setTheme((prevState) => (prevState === "Light" ? "Dark" : "Light"));
  };

  return (
    <>
      <div className="container-fluid home-container" id="home">
        <div className="theme-btn" onClick={handleTheme}>
          {theme === "Light" ? (
            <BsFillMoonStarsFill size={30}></BsFillMoonStarsFill>
          ) : (
            <BsFillSunFill size={30}></BsFillSunFill>
          )}
        </div>
        <div className="container home-content">
          <Slide right>
            <h2>Hi, I'm a</h2>
            <h1>
              <Typewriter
                options={{
                  strings: ["Developer", "Gamer", "Artist", "Athelete"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </h1>
          </Slide>
          <Fade bottom cascade>
            <div className="home-buttons">
              <a
                className="btn btn-hire"
                href="https://api.whatsapp.com/send?phone=7904953079"
                rel="noreferrer"
                target="_blank"
              >
                Hire Me
              </a>
              <a className="btn btn-cv" href={Resume} download="Resume.pdf">
                My Resume
              </a>
            </div>
          </Fade>
        </div>
      </div>
    </>
  );
};

export default Home;
