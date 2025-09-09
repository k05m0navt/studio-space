// components/navbar.tsx
"use client";

import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, X, Moon, Sun, Globe, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase as supabaseClient } from '@/lib/supabase';

function safeTranslate(translator: (k: string) => string, key: string, fallback: string) {
  try {
    return translator(key);
  } catch (err) {
    return fallback;
  }
}

const NAV_ITEMS = [
  { href: "/", labelKey: "home" },
  { href: "/studio", labelKey: "studio" },
  { href: "/coworking", labelKey: "coworking" },
  { href: "/gallery", labelKey: "gallery" },
  { href: "/faq", labelKey: "faq" },
  { href: "/admin", labelKey: "admin" },
] as const;

// Studio logo removed — using plain site title in navbar instead

// Refined Dark Mode Toggle
function DarkModeToggle({ fullWidth = false }: { fullWidth?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('navigation');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";
  
  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      aria-label={isDark ? safeTranslate(t, "aria.switchToLight", "Switch to light mode") : safeTranslate(t, "aria.switchToDark", "Switch to dark mode") }
      onClick={toggle}
      className={cn(
        "relative overflow-hidden rounded-full transition-colors duration-300",
        isDark 
          ? "bg-zinc-800 border border-zinc-700 text-amber-400"
          : "bg-white border border-slate-200 text-sky-600",
        "shadow-md flex items-center justify-center",
        fullWidth
          ? "w-full h-12 px-4 py-2"
          : "h-10 w-10"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -30 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 30 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Moon className="h-4 w-4" />
            {fullWidth && (
              <span className="font-medium text-sm">{t('theme.dark')}</span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 30 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -30 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Sun className="h-4 w-4" />
            {fullWidth && (
              <span className="font-medium text-sm">{t('theme.light')}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Refined Language Switcher with Dark Mode Support
function LanguageSwitcher({ fullWidth = false }: { fullWidth?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('navigation');

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = theme === "dark";

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <motion.button
      aria-label={locale === 'en' ? safeTranslate(t, 'aria.switchToRussian', 'Switch to Russian') : safeTranslate(t, 'aria.switchToEnglish', 'Switch to English')}
      onClick={toggleLanguage}
      className={cn(
        "relative overflow-hidden rounded-full shadow-md transition-colors duration-300",
        "border flex items-center justify-center",
        locale === 'en' 
          ? isDark 
            ? "bg-zinc-800 border-zinc-700 text-sky-400" 
            : "bg-white border-slate-200 text-sky-600"
          : isDark 
            ? "bg-zinc-800 border-zinc-700 text-rose-400" 
            : "bg-white border-slate-200 text-rose-600",
        fullWidth
          ? "w-full h-12 px-4 py-2"
          : "h-10 w-10"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={locale}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1"
        >
          {!fullWidth ? (
            <span className="text-xs font-bold">
              {locale === 'en' ? t('langShort.ru') : t('langShort.en')}
            </span>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-1" />
              <span className="font-medium text-sm">
                {locale === 'en' ? t('langFull.ru') : t('langFull.en')}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

export function Navbar({ services: initialServices = null }: { services?: { studio?: { enabled: boolean }; coworking?: { enabled: boolean } } | null }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');

  useEffect(() => {
    setMounted(true);
  }, []);

  const queryClient = useQueryClient();
  const { data: svcData } = useQuery({
    queryKey: ['service-config'],
    queryFn: async () => {
      const res = await fetch('/api/settings/services');
      if (!res.ok) throw new Error('Failed to load service settings');
      const json = await res.json();
      return json?.data ?? null;
    },
    // Use server-provided initial data to avoid layout flash
    initialData: initialServices as any ?? undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const svc = svcData ?? { studio: { enabled: true }, coworking: { enabled: true } };

  // Subscribe to Supabase Realtime events for service config updates
  useEffect(() => {
    const channel = supabaseClient.channel('settings');
    channel.on('broadcast', { event: 'service-config.updated' }, (payload) => {
      try {
        const data = payload.payload?.data;
        if (data) {
          queryClient.setQueryData(['service-config'], (old: any) => ({ ...(old ?? {}), ...(data ?? {}) }));
        }
      } catch (err) {
        // ignore
      }
    });
    channel.subscribe();
    return () => { channel.unsubscribe(); };
  }, [queryClient]);

  // Determine visible nav items (show until we know the flags)
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!svc) return true;
    if (item.href === '/coworking') return Boolean(svc.coworking?.enabled);
    if (item.href === '/studio') return Boolean(svc.studio?.enabled);
    return true;
  });

  // Close menu on route change and reset state
  useEffect(() => {
    setMenuOpen(false);
    const timer = setTimeout(() => {
      document.body.classList.remove('mobile-menu-open');
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Add/remove body class for content animation
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [menuOpen]);

  // Accessibility and keyboard navigation
  useEffect(() => {
    const handleMouseDown = () => document.body.classList.add('using-mouse');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') document.body.classList.remove('using-mouse');
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Click outside to close mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
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

  // Focus management
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
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (e.key === 'Tab') {
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

    drawer.addEventListener('keydown', handleKey);
    first?.focus();

    return () => drawer.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-[60] w-full border-b border-outline-variant bg-surface-container/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 lg:h-24 items-center justify-between">
            <Skeleton className="h-10 w-32 sm:h-12 sm:w-48" />
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-12 lg:w-16" />
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
              <div className="md:hidden">
                <Skeleton className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <a href="#main-content" className="skip-to-content">{tCommon('skipToContent')}</a>

      <header className="sticky top-0 z-[60] w-full border-b border-outline-variant bg-surface-container/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 lg:h-24 items-center justify-between">
            <Link href="/" className="flex items-center rounded-2xl p-2 -ml-2 transition-all duration-200 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <span className="text-lg font-semibold">Vasha Studio</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-2 lg:space-x-4" role="navigation">
              {visibleNavItems.map((item: { href: string; labelKey: string }) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative overflow-hidden rounded-full px-6 py-3 lg:px-8 lg:py-4 transition-all duration-200",
                    "text-base lg:text-lg font-medium",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    pathname === item.href ? "bg-tertiary-container text-tertiary-container-foreground shadow-sm" : "text-surface-foreground hover:bg-surface-container-high"
                  )}
                >
                  {t(item.labelKey)}
                  {pathname === item.href && (
                    <motion.div className="absolute bottom-1 left-1/2 w-6 h-1 bg-tertiary rounded-full" initial={{ scale: 0, x: "-50%" }} animate={{ scale: 1, x: "-50%" }} transition={{ duration: 0.2, ease: "linear" }} />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/book">
                  <motion.button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-5 rounded-full flex items-center gap-2 shadow-md" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Calendar className="h-4 w-4" />
                    <span>{t('bookNow')}</span>
                  </motion.button>
                </Link>
                <LanguageSwitcher />
                <DarkModeToggle />
              </div>

              <div className="flex md:hidden items-center space-x-3">
                <Link href="/book" className="mr-1">
                  <motion.button className="bg-primary hover:bg-primary/90 text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-md" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={t('bookNow')}>
                    <Calendar className="h-4 w-4" />
                  </motion.button>
                </Link>
                <LanguageSwitcher />
                <DarkModeToggle />

                <button className="h-12 w-12 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm flex items-center justify-center transition-colors" onClick={() => setMenuOpen(!menuOpen)} aria-label={t('aria.toggleMenu')} aria-expanded={menuOpen}>
                  <AnimatePresence mode="wait">
                    {menuOpen ? (
                      <motion.div key="close" initial={{ rotate: 0 }} animate={{ rotate: 90 }} exit={{ rotate: 0 }} transition={{ duration: 0.15, ease: "linear" }}>
                        <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} transition={{ duration: 0.15, ease: "linear" }}>
                        <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: "linear" }} className="fixed inset-0 bg-black/60" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 100 }} onClick={() => setMenuOpen(false)} />

            <motion.div ref={drawerRef} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "linear" }} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '320px', maxWidth: '85vw', zIndex: 101 }} role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
              <div className="h-full bg-white dark:bg-gray-900 rounded-l-3xl shadow-2xl border-l border-gray-200 dark:border-gray-700">

                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.2, ease: "linear" }} className="flex items-center gap-3">
                    <span className="text-sm font-semibold">Vasha Studio</span>
                    <div>
                      <h2 id="mobile-menu-title" className="font-semibold text-lg text-gray-900 dark:text-white">{t('menuTitle')}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('menuSubtitle')}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.15, ease: "linear" }}
                  >
                    <button
                      className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                      onClick={() => setMenuOpen(false)}
                      aria-label={t('aria.closeMenu')}
                    >
                      <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </motion.div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex flex-col h-[calc(100%-88px)] overflow-y-auto bg-white dark:bg-gray-900">
                  {/* Navigation Links */}
                  <nav className="flex-1 py-6 px-6" role="navigation">
                    <motion.ul 
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.2, ease: "linear" }}
                    >
                      {visibleNavItems.map((item, index) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.25 + index * 0.03, 
                            duration: 0.15,
                            ease: "linear"
                          }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-150",
                              "text-base font-medium",
                              pathname === item.href
                                ? "bg-yellow-400 text-gray-900 shadow-sm"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                          >
                            <span>{t(item.labelKey)}</span>
                            {pathname === item.href && (
                              <motion.div
                                className="w-2 h-2 bg-gray-900 rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.03, duration: 0.15, ease: "linear" }}
                              />
                            )}
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </nav>

                  {/* Footer Controls */}
                  <motion.div 
                    className="mt-auto p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.2, ease: "linear" }}
                  >
                    <LanguageSwitcher fullWidth />
                    <DarkModeToggle fullWidth />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
