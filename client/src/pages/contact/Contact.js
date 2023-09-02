import React from "react";
import "./Contact.css";
import { FaLinkedin, FaGithubSquare } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Shake from "react-reveal/Shake";

const Contact = () => {
  return (
    <>
      <Shake>
        <div className="contact" id="contact">
          <div className="card card0 border-0">
            <div className=" row">
              <div className="col-md-6 col-lg-6 col-xl-6 col-sm-12">
                <div className="card1">
                  <div className="row border-line">
                    <img
                      src="data:image/jpeg;base64,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"
                      alt="contact"
                      className="image"
                    ></img>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="card2 d-flex card border-0 px-4 py-5">
                  <div className="row">
                    <div className="row">
                      <h6>
                        Contact with
                        <a href="https://www.linkedin.com/in/priyanshu-sarkar-79464b242">
                          <FaLinkedin
                            color="blue"
                            size={36}
                            className="ms-2"
                          ></FaLinkedin>
                        </a>
                        <a href="https://github.com/Sentinel05">
                          <FaGithubSquare
                            color="black"
                            size={36}
                            className="ms-2"
                          ></FaGithubSquare>
                        </a>
                        <a href="mailto:ps30.official@gmail.com">
                          <SiGmail color="red" size={36} className="ms-2" />
                        </a>
                      </h6>
                    </div>

                    <div className="row px-3 mb-4">
                      <div className="line"></div>
                      <small className="or text-center">OR</small>
                      <div className="line"></div>
                    </div>
                    <div className="row px-3">
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        className="mb-3"
                      ></input>
                    </div>
                    <div className="row px-3">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your e-mail"
                        className="mb-3"
                      ></input>
                    </div>
                    <div className="row px-3">
                      <textarea
                        type="text"
                        name="msg"
                        placeholder="Type your message"
                        className="mb-3"
                      ></textarea>
                    </div>
                    <div className="row px-3">
                      <button className="button" type="submit">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Shake>
    </>
  );
};

export default Contact;
