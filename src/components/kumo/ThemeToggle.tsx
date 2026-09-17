"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded flex items-center justify-center text-kumo-subtle">
        <Desktop weight="thin" size={18} />
      </div>
    );
  }

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
    if (theme === "system") return "Theme: System";
    if (theme === "dark") return "Theme: Dark";
    return "Theme: Light";
  };

  return (
    <button
      onClick={cycleTheme}
      title={getLabel()}
      aria-label={getLabel()}
      className="w-8 h-8 rounded flex items-center justify-center text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kumo-brand select-none"
    >
      {theme === "system" ? (
        <Desktop weight="thin" size={18} />
      ) : resolvedTheme === "dark" ? (
        <Moon weight="thin" size={18} />
      ) : (
        <Sun weight="thin" size={18} />
      )}
    </button>
  );
}
