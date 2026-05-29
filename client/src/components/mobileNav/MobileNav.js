import { React, useState } from "react";
import "./MobileNav.css";
import { FcHome, FcAbout, FcBusiness, FcContacts } from "react-icons/fc";
import { MdMilitaryTech } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { IoConstruct } from "react-icons/io5";
import { PiCertificateBold } from "react-icons/pi";
import { Link } from "react-scroll";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "home",          label: "Home",           Icon: FcHome            },
  { to: "about",         label: "About",          Icon: FcAbout           },
  { to: "education",     label: "Education",      Icon: GiGraduateCap     },
  { to: "work",          label: "Work Experience",Icon: FcBusiness        },
  { to: "skill",         label: "Skills",         Icon: MdMilitaryTech    },
  { to: "certification", label: "Certifications", Icon: PiCertificateBold },
  { to: "project",       label: "Projects",       Icon: IoConstruct       },
  { to: "contact",       label: "Contact",        Icon: FcContacts        },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <div className="mobile-nav__bar">
        <button className="mobile-nav__toggle" onClick={() => setOpen(!open)}>
          {open ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
        <span className="mobile-nav__title">PS Portfolio</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav__menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                spy={true}
                smooth={true}
                duration={400}
                offset={-60}
                className="mobile-nav__item"
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
