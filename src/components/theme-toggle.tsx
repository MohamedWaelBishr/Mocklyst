'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      // If system, toggle to the opposite of current actual theme
      setTheme(actualTheme === "dark" ? "light" : "dark");
    }
  };

  const isDark = actualTheme === "dark";

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className={`
        relative h-9 w-9 p-0 rounded-lg
        transition-all duration-200 ease-in-out
        ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
            : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
        }
        hover:scale-105 active:scale-95
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <div className="relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={actualTheme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {isDark ? (
              <Moon className="h-4 w-4 text-gray-300" />
            ) : (
              <Sun className="h-4 w-4 text-gray-600" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Button>
  );
}
