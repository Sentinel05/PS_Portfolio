import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./Home.css";
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
          <p className="profile-quote">Turning complex systems into reliable solutions.</p>
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
