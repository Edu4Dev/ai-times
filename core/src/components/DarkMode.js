import React from "react";

const DarkMode = ({ debug, theme, setTheme }) => (
  <div className='toggle-dark-mode'>
    <h1>{debug ? `The current theme is: ${theme}` : null}</h1>
    <button
      className={theme === "light" ? "active" : ""}
      onClick={() => setTheme("light")}
    >
      ☀️
    </button>
    <button
      className={theme === "dark" ? "active" : ""}
      onClick={() => setTheme("dark")}
    >
      🌙
    </button>
  </div>
);

export default DarkMode;
