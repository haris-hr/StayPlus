"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Spinner, Avatar, LanguageSwitcher } from "@/components/ui";

// Mock auth for development
const mockUser = {
  displayName: "Sunny Sarajevo",
  email: "host@example.com",
  photoURL: undefined as string | undefined,
  tenantId: "demo",
  tenantName: "Sunny Sarajevo Apartment",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // In production, check Firebase auth and verify tenant access
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 500);
  }, [router]);

  const handleSignOut = async () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { icon: LayoutDashboard, label: t("overview"), href: "/dashboard" },
    { icon: ClipboardList, label: t("requests"), href: "/dashboard/requests" },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-foreground">
                  Stay<span className="text-primary-500">Plus</span>
                </span>
                <p className="text-xs text-foreground/60">{user.tenantName}</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-surface-100 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              <div className="hidden sm:flex items-center gap-3">
                <Avatar
                  src={user.photoURL}
                  fallback={user.displayName}
                  size="sm"
                />
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-foreground/60">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5 text-foreground/60" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 border-t border-surface-200"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-foreground/70 hover:text-foreground hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </motion.nav>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
