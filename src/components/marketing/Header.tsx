"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button, LanguageSwitcher } from "@/components/ui";
import { Logo, LogoText } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const Header = () => {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: t("nav.services") },
    { href: "#how-it-works", label: t("home.howItWorks.title") },
    { href: "#for-hosts", label: t("home.hosts.title") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size="md" />
            <LogoText className="text-xl" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground/70 hover:text-primary-600 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/admin">
              <Button variant="primary" size="sm">
                {t("common.getStarted")}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-surface-200 p-4"
          >
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground/70 hover:text-primary-600 transition-colors font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-surface-200 flex items-center justify-between">
                <LanguageSwitcher variant="full" />
              </div>
              <Link href="/admin" className="w-full mt-2">
                <Button variant="primary" className="w-full">
                  {t("common.getStarted")}
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export { Header };
