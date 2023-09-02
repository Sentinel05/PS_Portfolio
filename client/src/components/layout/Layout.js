import { React, useState } from "react";
import Home from "../../pages/home/Home";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import "./Layout.css";
import Menus from "../menus/Menus";

const Layout = () => {
  const [toggle, setToggle] = useState(true);

  //change toggle
  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <div className="sidebar-section">
        <div className={toggle ? "sidebar-toggle sidebar" : "sidebar"}>
          <div className="sidebar-toggle-icons">
            <p onClick={handleToggle}>
              {toggle ? (
                <FaAngleDoubleLeft size={30}></FaAngleDoubleLeft>
              ) : (
                <FaAngleDoubleRight size={30}></FaAngleDoubleRight>
              )}
            </p>
          </div>
          <Menus toggle={toggle}></Menus>
        </div>
        <div className="">
          <Home></Home>
        </div>
      </div>
    </>
  );
};

export default Layout;
