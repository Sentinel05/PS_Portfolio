import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import About from "./pages/about/About";
import Skills from "./pages/skills/Skills";
import Projects from "./pages/projects/Projects";
import Educations from "./pages/educations/Educations";
import Works from "./pages/works/Works";
import Contact from "./pages/contact/Contact";
import Certifications from "./pages/certifications/Certifications";

import { useTheme } from "./context/ThemeContext";
import MobileNav from "./components/mobileNav/MobileNav";
import Chatbot from "./components/chatbot/Chatbot";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import Resume from "./assets/documents/Priyanshu_Sarkar.pdf";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import Welcome from "./pages/welcome/Welcome";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/notFound/NotFound";

// ── Public portfolio page ─────────────────────────────────────────────────────
const Portfolio = () => {
  const [theme] = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`app-root ${theme === "light" ? "light-mode" : ""}`}>
      {/* Back to Welcome floating button */}
      <button
        className="portfolio-home-btn"
        onClick={() => navigate("/")}
        title="Back to Welcome"
      >
        ← Home
      </button>

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
        <Certifications />
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
      <Chatbot />
    </div>
  );
};

// ── App Router ────────────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      {/* Landing — role selection for every visitor */}
      <Route path="/" element={<Welcome />} />

      {/* Public portfolio (guest view) */}
      <Route path="/portfolio/*" element={<Portfolio />} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin portal — protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPortfolio />
          </ProtectedRoute>
        }
      />

      {/* Fallback — dedicated 404 page for unknown paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;


