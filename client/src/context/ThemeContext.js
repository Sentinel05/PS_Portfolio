import { useState, createContext, useContext } from "react";

const ThemeContext = createContext();

const getInitialTheme = () => {
  const hour = new Date().getHours();
  // Daytime: 6 am – 6 pm → light; otherwise dark
  return hour >= 6 && hour < 18 ? "light" : "dark";
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { useTheme, ThemeProvider };
