"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { GiChefToque } from "react-icons/gi";
import { FaMoon, FaSun } from "react-icons/fa";

type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "ai-culinary-chef-theme";
const THEME_CHANGE_EVENT = "ai-culinary-chef-theme-change";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(THEME_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
  };
}

export default function AppHeader() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => "dark");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <nav className="app-header">
      <Link href="/" className="app-header-brand">
        <GiChefToque size={24} />
        AI Culinary Chef
      </Link>

      <div className="app-header-actions">
        <div className="app-header-links">
          <Link href="/generator" className="top-nav-link">
            Generator
          </Link>
          <Link href="/saved" className="top-nav-link">
            Saved
          </Link>
          <Link href="/tools" className="top-nav-link">
            Tools
          </Link>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={handleThemeToggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </nav>
  );
}
