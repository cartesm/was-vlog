"use client";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const handleCheck = () => {
    setTheme(theme == "dark" ? "light" : "dark");
  };

  return (
    <div
      onClick={handleCheck}
      className="hover:cursor-pointer hover:bg-white rounded-md p-2 hover:bg-opacity-30"
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </div>
  );
}

export default ThemeSelector;
