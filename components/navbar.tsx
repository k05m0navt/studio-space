// components/navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/studio", label: "Studio" },
  { href: "/coworking", label: "Coworking" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/admin", label: "Admin" },
];

function DarkModeToggle({ fullWidth = false }: { fullWidth?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  const isDark = theme === "dark";
  
  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={
        fullWidth
          ? "w-full min-h-[44px] min-w-[44px] px-4 py-2 rounded border bg-muted hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition flex items-center justify-center"
          : "ml-2 px-2 py-1 rounded border bg-muted hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition min-h-[44px] min-w-[44px] flex items-center justify-center"
      }
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Click outside to close mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        // Also check if the click is not on the menu button
        const target = event.target as Element;
        const menuButton = target.closest('[aria-label="Toggle menu"]');
        if (!menuButton) {
          setMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Focus trap and Esc close for mobile drawer
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    drawer.addEventListener("keydown", handleKey);
    // Focus first item
    first?.focus();
    return () => drawer.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Show skeleton until mounted on client
  if (!mounted) {
    return (
      <nav className="w-full px-4 py-2 flex items-center justify-between shadow-sm bg-background sticky top-0 z-50 border-b">
        <Skeleton className="h-10 w-36 rounded" />
        <div className="flex gap-4 flex-1 justify-center">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      </nav>
    );
  }

  return (
    <motion.nav 
      className="w-full px-4 py-2 flex items-center justify-between shadow-sm bg-background sticky top-0 z-50 border-b"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link href="/" className="flex items-center gap-2 select-none" aria-label="Home">
        <motion.span 
          className="text-2xl font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          📸 Vasha Studio
        </motion.span>
      </Link>
      
      <ul className="hidden md:flex gap-1 items-center">
        {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.li 
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            >
              <Link
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] flex items-center justify-center text-sm font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-lg -z-10"
                    layoutId="navbar-active"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
      
      <div className="flex items-center gap-2 ml-4">
        <motion.div 
          className="hidden md:flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        >
          <DarkModeToggle />
          <Link href="/book">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <Button className="min-h-[44px] shadow-sm">
                Book Now
              </Button>
            </motion.div>
          </Link>
        </motion.div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <DarkModeToggle />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="min-h-[44px] min-w-[44px]"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              ref={drawerRef}
              className="fixed inset-x-0 top-16 bg-background border-b shadow-lg z-40 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="px-4 py-6 space-y-2">
                {NAV_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-accent min-h-[44px] flex items-center text-sm font-medium",
                        pathname === item.href 
                          ? "bg-primary text-primary-foreground font-semibold" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                  className="pt-4 border-t"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
                >
                  <Link href="/book" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full min-h-[44px]">
                      Book Now
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
