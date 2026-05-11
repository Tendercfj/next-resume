"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

const storageKey = "next-resume-theme";

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="relative rounded-full"
      aria-label="切换明暗主题"
      title="切换明暗主题"
      onClick={toggleTheme}
    >
      <Sun className="size-3.5 scale-100 transition-transform dark:scale-0" />
      <Moon className="absolute size-3.5 scale-0 transition-transform dark:scale-100" />
    </Button>
  );
}

function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}
