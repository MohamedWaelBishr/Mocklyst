"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/UserNav";
import { useIsAuthenticated, useAuthLoading } from "@/lib/stores/auth-store";
import {
  useScrollNavigation,
  landingPageSections,
} from "@/hooks/useScrollNavigation";

interface NavigationItem {
  name: string;
  href: string;
  isExternal?: boolean;
  onClick?: () => void;
  isScrollTarget?: boolean;
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const authLoading = useAuthLoading();
  const pathname = usePathname();

  // Use scroll navigation hook only on the landing page
  const isLandingPage = pathname === "/";
  const { activeSection, scrollToSection } = useScrollNavigation(
    isLandingPage ? landingPageSections : []
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Navigation items for unauthenticated users
  const publicNavigation: NavigationItem[] = [
    {
      name: "Features",
      href: "#features",
      isScrollTarget: true,
      onClick: () => {
        if (isLandingPage) {
          scrollToSection("features");
        } else {
          window.location.href = "/#features";
        }
        setIsOpen(false);
      },
    },
    {
      name: "How It Works",
      href: "#how-it-works",
      isScrollTarget: true,
      onClick: () => {
        if (isLandingPage) {
          scrollToSection("how-it-works");
        } else {
          window.location.href = "/#how-it-works";
        }
        setIsOpen(false);
      },
    },
    { name: "Demo", href: "/create" },
    { name: "Docs", href: "/docs" },
  ];

  // Navigation items for authenticated users
  const authenticatedNavigation: NavigationItem[] = [
    {
      name: "Features",
      href: "#features",
      isScrollTarget: true,
      onClick: () => {
        if (isLandingPage) {
          scrollToSection("features");
        } else {
          window.location.href = "/#features";
        }
        setIsOpen(false);
      },
    },
    {
      name: "How It Works",
      href: "#how-it-works",
      isScrollTarget: true,
      onClick: () => {
        if (isLandingPage) {
          scrollToSection("how-it-works");
        } else {
          window.location.href = "/#how-it-works";
        }
        setIsOpen(false);
      },
    },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Create Mock", href: "/create" },
    { name: "Docs", href: "/docs" },
  ];

  const navigation = isAuthenticated
    ? authenticatedNavigation
    : publicNavigation;

  const handleNavClick = (item: NavigationItem) => {
    if (item.onClick) {
      item.onClick();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-700/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-purple-600 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
                Mocklyst
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => {
              const isActive =
                isLandingPage &&
                item.isScrollTarget &&
                activeSection === item.href.replace("#", "");

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className={`transition-colors duration-200 font-medium relative ${
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavItem"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium"
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </nav>
          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Auth Section */}
            {!authLoading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden md:flex"
              >
                {!isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="bg-gradient-to-r from-purple-600 to-purple-600"
                    >
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </div>
                ) : (
                  <UserNav />
                )}
              </motion.div>
            )}

            {/* Mobile menu button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 md:hidden border-t  dark:border-slate-700/20 shadow-lg backdrop-blur-md"
            >
              <div className="px-2 pt-4 pb-6 space-y-3">
                {navigation.map((item, index) => {
                  const isActive =
                    isLandingPage &&
                    item.isScrollTarget &&
                    activeSection === item.href.replace("#", "");

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="block"
                    >
                      {item.onClick ? (
                        <button
                          onClick={() => handleNavClick(item)}
                          className={`block w-full text-center px-3 py-2 rounded-md transition-colors duration-200 font-medium ${
                            isActive
                              ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                              : "text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => handleNavClick(item)}
                          className="block w-full text-center px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 font-medium"
                          target={item.isExternal ? "_blank" : undefined}
                          rel={
                            item.isExternal ? "noopener noreferrer" : undefined
                          }
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}

                {/* Mobile Auth Section */}
                {!authLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 border-t border-slate-200/20 dark:border-slate-700/20"
                  >
                    {!isAuthenticated ? (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          asChild
                        >
                          <Link
                            href="/auth/signin"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign In
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          asChild
                        >
                          <Link
                            href="/auth/signup"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="px-3">
                        <UserNav />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
