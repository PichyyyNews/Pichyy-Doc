"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("system");
    }
  };

  const getLabel = () => {
    if (!mounted) return "Toggle theme";
    if (theme === "system") return "Theme: System";
    if (theme === "dark") return "Theme: Dark";
    return "Theme: Light";
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={getLabel()}
      aria-label={getLabel()}
      suppressHydrationWarning
      className="w-8 h-8 rounded flex items-center justify-center text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kumo-brand select-none transition-none"
    >
      {!mounted ? (
        <Desktop weight="thin" size={18} />
      ) : theme === "system" ? (
        <Desktop weight="thin" size={18} />
      ) : resolvedTheme === "dark" ? (
        <Moon weight="thin" size={18} />
      ) : (
        <Sun weight="thin" size={18} />
      )}
    </button>
  );
}
