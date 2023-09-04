import React from "react";
import "./Projects.css";
import Flip from "react-reveal/Flip";
import Portfolio from "../../assets/images/Portfolio.png";
import TicTacToe from "../../assets/images/TicTacToe.png";
import Supermarket from "../../assets/images/Supermarket.png";

const Projects = () => {
  return (
    <>
      <div className="container project" id="project">
        <h2 className="col-12 mt-3 text-center">Projects</h2>
        <hr></hr>
        <p className="pb-3 text-center">
          👉here are my top 3 recent projects with live links and source code
        </p>

        <div className="row" id="ads">
          <Flip right cascade>
            <div className="col-md-4">
              <div className="card rounded">
                <div className="card-image">
                  <span className="card-notify-badge">Full-Stack</span>
                  <img
                    src={Portfolio}
                    alt="project1"
                  ></img>
                </div>
                <div className="card-image-overlay m-auto mt-3">
                  <span className="card-detail-badge">Node</span>
                  <span className="card-detail-badge">Express</span>
                  <span className="card-detail-badge">React</span>
                  <span className="card-detail-badge">Mongodb</span>
                </div>
                <div className="card-body text-center">
                  <div className="m-auto">
                    <h5>Portfolio Website</h5>
                  </div>
                  <a
                    className="ad-btn"
                    href="https://github.com/Sentinel05/PS_Portfolio"
                  >
                    Checkout
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card rounded">
                <div className="card-image">
                  <span className="card-notify-badge">Back-End</span>
                  <img
                    src={TicTacToe}
                    alt="project2"
                  ></img>
                </div>
                <div className="card-image-overlay m-auto mt-3">
                  <span className="card-detail-badge">C++</span>
                  <span className="card-detail-badge">Backtracking</span>
                </div>
                <div className="card-body text-center">
                  <div className="m-auto">
                    <h5>Tic Tac Toe</h5>
                  </div>
                  <a
                    className="ad-btn"
                    href="https://github.com/Sentinel05/Tic-Tac-Toe"
                  >
                    Checkout
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card rounded">
                <div className="card-image">
                  <span className="card-notify-badge">Back-End</span>
                  <img
                    src={Supermarket}
                    alt="project3"
                  ></img>
                </div>
                <div className="card-image-overlay m-auto mt-3">
                  <span className="card-detail-badge">C++</span>
                  <span className="card-detail-badge">File Management</span>
                </div>
                <div className="card-body text-center">
                  <div className="m-auto">
                    <h5>Supermarket Portal</h5>
                  </div>
                  <a
                    className="ad-btn"
                    href="https://github.com/Sentinel05/Supermarket-Portal"
                  >
                    Checkout
                  </a>
                </div>
              </div>
            </div>
          </Flip>
        </div>
      </div>
    </>
  );
};

export default Projects;
