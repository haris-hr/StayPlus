"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Car,
  Mountain,
  UtensilsCrossed,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getLocalizedText, getPricingDisplay } from "@/lib/utils";
import type { Service, Locale } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gift: Gift,
  car: Car,
  mountain: Mountain,
  utensils: UtensilsCrossed,
  heart: Heart,
  shopping: ShoppingBag,
  sparkles: Sparkles,
};

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  free: { bg: "bg-green-50", icon: "text-green-600", badge: "bg-green-100 text-green-700" },
  transport: { bg: "bg-blue-50", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  tours: { bg: "bg-emerald-50", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  food: { bg: "bg-orange-50", icon: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
  special: { bg: "bg-pink-50", icon: "text-pink-600", badge: "bg-pink-100 text-pink-700" },
  convenience: { bg: "bg-purple-50", icon: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
  car: { bg: "bg-slate-50", icon: "text-slate-600", badge: "bg-slate-100 text-slate-700" },
  extras: { bg: "bg-amber-50", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
};

interface ServiceCardProps {
  service: Service;
  categoryIcon?: string;
  categoryColor?: string;
  locale: Locale;
  onClick: () => void;
}

const ServiceCard = ({
  service,
  categoryIcon = "sparkles",
  categoryColor = "extras",
  locale,
  onClick,
}: ServiceCardProps) => {
  const Icon = iconMap[categoryIcon] || Sparkles;
  const colors = colorMap[categoryColor] || colorMap.extras;

  const name = getLocalizedText(service.name, locale);
  const description = getLocalizedText(service.shortDescription || service.description, locale);
  const priceDisplay = getPricingDisplay(
    service.pricingType,
    service.price,
    service.currency,
    locale
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        hover
        onClick={onClick}
        className="h-full cursor-pointer group overflow-hidden"
        padding="none"
      >
        {/* Image or gradient header */}
        {service.image ? (
          <div className="relative h-40 overflow-hidden">
            <img
              src={service.image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {service.featured && (
              <div className="absolute top-3 right-3">
                <Badge variant="warning" size="sm" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className={cn("relative h-32", colors.bg)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className={cn("w-16 h-16 opacity-20", colors.icon)} />
            </div>
            {service.featured && (
              <div className="absolute top-3 right-3">
                <Badge variant="warning" size="sm" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary-600 transition-colors line-clamp-1">
              {name}
            </h3>
            <div
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                colors.bg
              )}
            >
              <Icon className={cn("w-4 h-4", colors.icon)} />
            </div>
          </div>

          <p className="text-sm text-foreground/60 line-clamp-2 mb-4">
            {description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-sm font-semibold px-3 py-1 rounded-full",
                service.pricingType === "free"
                  ? "bg-green-100 text-green-700"
                  : "bg-primary-100 text-primary-700"
              )}
            >
              {priceDisplay}
            </span>
            <span className="text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export { ServiceCard };
