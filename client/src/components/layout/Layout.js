import { React, useState } from "react";
import Home from "../../pages/home/Home";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import "./Layout.css";
import Menus from "../menus/Menus";

const Layout = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`sidebar ${expanded ? "sidebar--expanded" : "sidebar--collapsed"}`}>
      <button
        className="sidebar__toggle"
        onClick={() => setExpanded(!expanded)}
        aria-label="Toggle sidebar"
      >
        {expanded ? (
          <RiMenuFoldLine size={20} />
        ) : (
          <RiMenuUnfoldLine size={20} />
        )}
      </button>
      <Home expanded={expanded} />
      <Menus expanded={expanded} />
    </div>
  );
};

export default Layout;
