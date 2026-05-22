import { React, useState, useRef } from "react";
import "./Contact.css";
import { FaLinkedin, FaWhatsappSquare, FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

const socialLinks = [
  {
    Icon: FaLinkedin,
    href: "https://www.linkedin.com/in/priyanshu-sarkar-79464b242",
    color: "#0077b5",
    label: "LinkedIn",
  },
  {
    Icon: FaWhatsappSquare,
    href: "https://api.whatsapp.com/send?phone=7904953079",
    color: "#25D366",
    label: "WhatsApp",
    rel: "noreferrer",
    target: "_blank",
  },
  {
    Icon: SiGmail,
    href: "mailto:ps30.official@gmail.com",
    color: "#ea4335",
    label: "Email",
  },
  {
    Icon: FaGithub,
    href: "https://github.com/Sentinel05",
    color: "#6e7681",
    label: "GitHub",
    target: "_blank",
    rel: "noreferrer",
  },
];

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    emailjs
      .send(
        "service_6evilyb",
        "template_c64o3se",
        {
          from_name: form.name,
          to_name: "Priyanshu Sarkar",
          from_email: form.email,
          to_email: "p30sarkar@gmail.com",
          message: form.message,
        },
        "XPlopKMKr2oWOtoHd"
      )
      .then(() => {
        setLoading(false);
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setLoading(false);
        setStatus("error");
      });
  };

  return (
    <section className="contact" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-heading">Get In Touch</h2>
        <hr className="section-divider" />
        <p className="section-subheading">Let's build something together</p>
      </motion.div>

      <div className="contact__layout">
        {/* Left info panel */}
        <motion.div
          className="contact__info glass-card"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="contact__info-title">Connect with me</h3>
          <p className="contact__info-desc">
            Whether it's a job opportunity, a project idea or just a hello — my inbox is always open.
          </p>
          <div className="contact__socials">
            {socialLinks.map(({ Icon, href, color, label, rel, target }) => (
              <a
                key={label}
                href={href}
                rel={rel}
                target={target}
                className="social-btn"
                aria-label={label}
              >
                <Icon size={22} style={{ color }} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right form */}
        <motion.div
          className="contact__form-wrap glass-card"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <form ref={formRef} onSubmit={handleSubmit} className="contact__form">
            <div className="form-field">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                placeholder="Tell me about your project or inquiry..."
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="form-input form-textarea"
              />
            </div>
            {status === "success" && (
              <p className="form-status form-status--success">
                ✓ Message sent! I'll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="form-status form-status--error">
                ✗ Something went wrong. Please try again.
              </p>
            )}
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
