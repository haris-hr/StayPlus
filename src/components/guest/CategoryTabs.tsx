"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Gift,
  Car,
  Mountain,
  UtensilsCrossed,
  Heart,
  ShoppingBag,
  Sparkles,
  LayoutGrid,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceCategory, Locale } from "@/types";
import { getLocalizedText } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gift: Gift,
  car: Car,
  mountain: Mountain,
  utensils: UtensilsCrossed,
  heart: Heart,
  shopping: ShoppingBag,
  sparkles: Sparkles,
  grid: LayoutGrid,
  camera: Camera,
};

interface CategoryTabsProps {
  categories: ServiceCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  locale: Locale;
}

const CategoryTabs = ({
  categories,
  selectedCategory,
  onSelectCategory,
  locale,
}: CategoryTabsProps) => {
  const t = useTranslations("guest");

  const allCategory = {
    id: null,
    name: t("allServices"),
    icon: "grid",
  };

  const tabs = [
    allCategory,
    ...categories.map((cat) => ({
      id: cat.id,
      name: getLocalizedText(cat.name, locale),
      icon: cat.icon,
      color: cat.color,
    })),
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-1">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.icon] || LayoutGrid;
          const isSelected = selectedCategory === tab.id;

          return (
            <motion.button
              key={tab.id || "all"}
              onClick={() => onSelectCategory(tab.id)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200",
                isSelected
                  ? "text-white"
                  : "text-foreground/70 hover:text-foreground hover:bg-surface-100"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/25"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.name}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export { CategoryTabs };
