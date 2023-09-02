import React from "react";
import "./Projects.css";
import Flip from "react-reveal/Flip";

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
                  <span className="card-notify-badge">Full Stack</span>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPteZx6UiNpq6k9ekcAczrug1QxbP-642Ccg&usqp=CAU"
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
                  <div className="ad-title m-auto">
                    <h5>Priyanshu Sarkar Portfolio</h5>
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
                  <span className="card-notify-badge">Backend</span>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPteZx6UiNpq6k9ekcAczrug1QxbP-642Ccg&usqp=CAU"
                    alt="project1"
                  ></img>
                </div>
                <div className="card-image-overlay m-auto mt-3">
                  <span className="card-detail-badge">C++</span>
                  <span className="card-detail-badge">Backtracking</span>
                </div>
                <div className="card-body text-center">
                  <div className="ad-title m-auto">
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
                  <span className="card-notify-badge">Networking</span>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPteZx6UiNpq6k9ekcAczrug1QxbP-642Ccg&usqp=CAU"
                    alt="project1"
                  ></img>
                </div>
                <div className="card-image-overlay m-auto mt-3">
                  <span className="card-detail-badge">Mininet</span>
                  <span className="card-detail-badge">Miniedit</span>
                  <span className="card-detail-badge">Wireshark</span>
                  <span className="card-detail-badge">Ubuntu</span>
                </div>
                <div className="card-body text-center">
                  <div className="ad-title m-auto">
                    <h5>Creating and Testing SDN Scenarios</h5>
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
          </Flip>
        </div>
      </div>
    </>
  );
};

export default Projects;
