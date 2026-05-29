import React from "react";
import "./Menus.css";
import { FcHome, FcAbout, FcBusiness, FcContacts } from "react-icons/fc";
import { MdMilitaryTech } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { IoConstruct } from "react-icons/io5";
import { PiCertificateBold } from "react-icons/pi";
import { Link } from "react-scroll";
import { motion } from "framer-motion";

const navItems = [
  { to: "home",          label: "Home",           Icon: FcHome         },
  { to: "about",         label: "About",          Icon: FcAbout        },
  { to: "education",     label: "Education",      Icon: GiGraduateCap  },
  { to: "work",          label: "Work",           Icon: FcBusiness     },
  { to: "skill",         label: "Skills",         Icon: MdMilitaryTech },
  { to: "certification", label: "Certifications", Icon: PiCertificateBold },
  { to: "project",       label: "Projects",       Icon: IoConstruct    },
  { to: "contact",       label: "Contact",        Icon: FcContacts     },
];

const Menus = ({ expanded }) => {
  return (
    <nav className="sidebar-nav">
      {navItems.map(({ to, label, Icon }, i) => (
        <motion.div
          key={to}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35 }}
        >
          <Link
            to={to}
            spy={true}
            smooth={true}
            duration={400}
            offset={-20}
            activeClass="nav-item--active"
            className="nav-item"
          >
            <span className="nav-item__icon">
              <Icon size={20} />
            </span>
            {expanded && (
              <motion.span
                className="nav-item__label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                {label}
              </motion.span>
            )}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
};

export default Menus;
