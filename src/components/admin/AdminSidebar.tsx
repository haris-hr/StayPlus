"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Layers,
  ClipboardList,
  FolderOpen,
  Users,
  Settings,
  Languages,
  Sparkles,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  user?: {
    displayName?: string;
    email: string;
    photoURL?: string;
  } | null;
  onSignOut: () => void;
}

const AdminSidebar = ({
  isCollapsed,
  onToggle,
  user,
  onSignOut,
}: AdminSidebarProps) => {
  const t = useTranslations("admin");
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: t("overview"), href: "/admin" },
    { icon: Building2, label: t("tenants"), href: "/admin/tenants" },
    { icon: FolderOpen, label: t("categories"), href: "/admin/categories" },
    { icon: Layers, label: t("services"), href: "/admin/services" },
    { icon: ClipboardList, label: t("requests"), href: "/admin/requests" },
    { icon: Users, label: t("users"), href: "/admin/users" },
    { icon: Languages, label: t("translations"), href: "/admin/translations" },
    { icon: Settings, label: t("settings"), href: "/admin/settings" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname.endsWith("/admin") || pathname.endsWith("/admin/");
    }
    return pathname.includes(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 bg-white border-r border-surface-200 z-40 flex flex-col"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-surface-200">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold text-foreground"
            >
              Stay<span className="text-primary-500">Plus</span>
            </motion.span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 text-foreground/60 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                    active
                      ? "bg-primary-50 text-primary-600"
                      : "text-foreground/70 hover:bg-surface-100 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      active ? "text-primary-600" : "text-foreground/50"
                    )}
                  />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {active && !isCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-surface-200">
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl bg-surface-50",
            isCollapsed && "justify-center"
          )}
        >
          <Avatar
            src={user?.photoURL}
            fallback={user?.displayName || user?.email}
            size="sm"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-xs text-foreground/60 truncate">
                {user?.email}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onSignOut}
              className="p-2 rounded-lg hover:bg-surface-200 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-foreground/60" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export { AdminSidebar };
