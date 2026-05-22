import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./Home.css";
import Typewriter from "typewriter-effect";
import Resume from "../../assets/documents/Priyanshu_Sarkar.pdf";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import Pic from "../../assets/images/cool-dp.jpg";
import { motion } from "framer-motion";

const Home = ({ expanded }) => {
  const [theme, setTheme] = useTheme();

  const handleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="sidebar-profile">
      <motion.div
        className="profile-pic-wrap"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={Pic} alt="Priyanshu Sarkar" className="profile-pic" />
      </motion.div>

      {expanded && (
        <motion.div
          className="profile-info"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h3 className="profile-name">Priyanshu</h3>
          <div className="profile-typewriter">
            <Typewriter
              options={{
                strings: ["Developer", "Engineer", "Gamer", "Athlete"],
                autoStart: true,
                loop: true,
                deleteSpeed: 40,
                delay: 60,
              }}
            />
          </div>
          <div className="profile-actions">
            <a
              className="btn-primary-sm"
              href="https://api.whatsapp.com/send?phone=7904953079"
              rel="noreferrer"
              target="_blank"
            >
              Hire Me
            </a>
            <a className="btn-outline-sm" href={Resume} download="Priyanshu_Resume.pdf">
              Resume
            </a>
          </div>
        </motion.div>
      )}

      <button className="theme-toggle" onClick={handleTheme} title="Toggle theme">
        {theme === "dark" ? (
          <BsFillSunFill size={16} />
        ) : (
          <BsFillMoonStarsFill size={16} />
        )}
      </button>
    </div>
  );
};

export default Home;
