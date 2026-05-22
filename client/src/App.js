import "./App.css";
import Layout from "./components/layout/Layout";
import About from "./pages/about/About";
import Skills from "./pages/skills/Skills";
import Projects from "./pages/projects/Projects";
import Educations from "./pages/educations/Educations";
import Works from "./pages/works/Works";
import Contact from "./pages/contact/Contact";
import ScrollToTop from "react-scroll-to-top";
import { useTheme } from "./context/ThemeContext";
import MobileNav from "./components/mobileNav/MobileNav";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import Resume from "./assets/documents/Priyanshu_Sarkar.pdf";
import "./App.css";

function App() {
  const [theme] = useTheme();

  return (
    <div className={`app-root ${theme === "light" ? "light-mode" : ""}`}>
      <MobileNav />
      <Layout />
      <div className="main-content">
        {/* ── Hero Banner ── */}
        <section className="hero" id="home">
          <div className="hero__glow hero__glow--1" />
          <div className="hero__glow hero__glow--2" />
          <motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="hero__greeting">Hello, I'm</p>
            <h1 className="hero__name">Priyanshu Sarkar</h1>
            <div className="hero__typewriter">
              <Typewriter
                options={{
                  strings: ["Software Engineer", "Full-Stack Developer", "Problem Solver", "Open-Source Enthusiast"],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 35,
                  delay: 55,
                }}
              />
            </div>
            <p className="hero__desc">
              Building robust enterprise software at <span className="hero__company">OpenText</span> · passionate about clean code and impactful solutions.
            </p>
            <div className="hero__actions">
              <a
                className="hero__btn hero__btn--primary"
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById("contact").scrollIntoView({ behavior: "smooth" }); }}
              >
                Get in Touch
              </a>
              <a className="hero__btn hero__btn--outline" href={Resume} download="Priyanshu_Sarkar_Resume.pdf">
                Download CV
              </a>
            </div>
          </motion.div>
        </section>

        <About />
        <Educations />
        <Works />
        <Skills />
        <Projects />
        <Contact />
        <motion.footer
          className="footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Crafted by <span>Priyanshu Sarkar</span> &copy; {new Date().getFullYear()}
        </motion.footer>
      </div>
      <ScrollToTop
        smooth
        color="#a78bfa"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "50%",
          boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
        }}
      />
    </div>
  );
}

export default App;

