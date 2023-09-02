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
import Bounce from "react-reveal/Bounce";
import MobileNav from "./components/mobileNav/MobileNav";

function App() {
  const [theme] = useTheme();
  return (
    <>
      <div id={theme}>
        <MobileNav></MobileNav>
        <Layout></Layout>
        <div className="container">
          <About></About>
          <Educations></Educations>
          <Works></Works>
          <Skills></Skills>
          <Projects></Projects>
          <Contact></Contact>
        </div>
        <Bounce bottom>
          <div className="footer pb-3 ms-3">
            <h4 className="text-center">
              Made with 💕 by Priyanshu Sarkar &copy; 2023
            </h4>
          </div>
        </Bounce>
      </div>
      <ScrollToTop
        smooth
        color="#f29f67"
        style={{ backgroundColor: "#1e1e2c", borderRadius: "80px" }}
      />
    </>
  );
}

export default App;
