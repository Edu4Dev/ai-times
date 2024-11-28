import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import DarkMode from "../components/DarkMode";

const DarkModeContainer = ({ debug = false }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  // useEffect  only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return <DarkMode debug={debug} theme={theme} setTheme={setTheme} />;
};

export default DarkModeContainer;
