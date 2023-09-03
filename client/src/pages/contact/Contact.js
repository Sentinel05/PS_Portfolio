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
                      src="https://media.istockphoto.com/id/1049658692/photo/contact-us.jpg?s=612x612&w=0&k=20&c=hFoLqy8mHjvdPh2HFZQ9pRcO-zzEB9HIENJ7ub2sj80="
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
