import type { I18nText, Locale, PricingType } from "@/types";

// Get localized text
export function getLocalizedText(text: I18nText | undefined, locale: Locale): string {
  if (!text) return "";
  return text[locale] || text.en || "";
}

// Format price
export function formatPrice(
  price: number | undefined,
  currency: string = "EUR",
  locale: Locale = "en"
): string {
  if (price === undefined || price === null) return "";
  
  const formatter = new Intl.NumberFormat(locale === "bs" ? "bs-BA" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(price);
}

// Get pricing display text
export function getPricingDisplay(
  pricingType: PricingType,
  price: number | undefined,
  currency: string = "EUR",
  locale: Locale = "en"
): string {
  switch (pricingType) {
    case "free":
      return locale === "bs" ? "Besplatno" : "Free";
    case "quote":
      return locale === "bs" ? "Na upit" : "Request Quote";
    case "variable":
      return price 
        ? `${locale === "bs" ? "Od" : "From"} ${formatPrice(price, currency, locale)}`
        : locale === "bs" ? "Cijena varira" : "Price varies";
    case "fixed":
    default:
      return price ? formatPrice(price, currency, locale) : "";
  }
}

// Format date
export function formatDate(date: Date | undefined, locale: Locale = "en"): string {
  if (!date) return "";
  
  return new Intl.DateTimeFormat(locale === "bs" ? "bs-BA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Format date and time
export function formatDateTime(date: Date | undefined, locale: Locale = "en"): string {
  if (!date) return "";
  
  return new Intl.DateTimeFormat(locale === "bs" ? "bs-BA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Format relative time
export function formatRelativeTime(date: Date | undefined, locale: Locale = "en"): string {
  if (!date) return "";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) {
    return locale === "bs" ? "Upravo sada" : "Just now";
  }
  if (diffMins < 60) {
    return locale === "bs" 
      ? `Prije ${diffMins} min` 
      : `${diffMins} min ago`;
  }
  if (diffHours < 24) {
    return locale === "bs" 
      ? `Prije ${diffHours}h` 
      : `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return locale === "bs" 
      ? `Prije ${diffDays} dana` 
      : `${diffDays} days ago`;
  }
  
  return formatDate(date, locale);
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
