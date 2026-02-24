// Application constants

// Locale settings
export const LOCALES = ["en", "bs"] as const;
export const DEFAULT_LOCALE = "en";

// Currency
export const DEFAULT_CURRENCY = "EUR";
export const SUPPORTED_CURRENCIES = ["EUR", "BAM", "USD"] as const;

// Request statuses with colors
export const REQUEST_STATUS_CONFIG = {
  pending: {
    label: { en: "Pending", bs: "Na čekanju" },
    color: "amber",
    bgClass: "bg-amber-100",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
  },
  confirmed: {
    label: { en: "Confirmed", bs: "Potvrđeno" },
    color: "blue",
    bgClass: "bg-blue-100",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
  },
  in_progress: {
    label: { en: "In Progress", bs: "U toku" },
    color: "purple",
    bgClass: "bg-purple-100",
    textClass: "text-purple-700",
    borderClass: "border-purple-200",
  },
  completed: {
    label: { en: "Completed", bs: "Završeno" },
    color: "green",
    bgClass: "bg-green-100",
    textClass: "text-green-700",
    borderClass: "border-green-200",
  },
  cancelled: {
    label: { en: "Cancelled", bs: "Otkazano" },
    color: "red",
    bgClass: "bg-red-100",
    textClass: "text-red-700",
    borderClass: "border-red-200",
  },
} as const;

// User roles with labels
export const USER_ROLE_CONFIG = {
  super_admin: {
    label: { en: "Super Admin", bs: "Super Admin" },
    color: "purple",
    permissions: ["all"],
  },
  tenant_admin: {
    label: { en: "Tenant Admin", bs: "Admin Stanodavca" },
    color: "blue",
    permissions: ["read", "write", "manage_services"],
  },
  tenant_viewer: {
    label: { en: "Viewer", bs: "Preglednik" },
    color: "gray",
    permissions: ["read"],
  },
} as const;

// Category icons mapping
export const CATEGORY_ICONS = {
  free: "gift",
  transport: "car",
  tours: "mountain",
  food: "utensils",
  special: "heart",
  convenience: "shopping-bag",
  "car-services": "wrench",
  photography: "camera",
} as const;

// Category colors for styling
export const CATEGORY_COLORS = {
  free: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  transport: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  tours: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  food: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  special: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  convenience: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  "car-services": {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  photography: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
  },
} as const;

// Pricing type labels
export const PRICING_TYPE_LABELS = {
  free: { en: "Free", bs: "Besplatno" },
  fixed: { en: "Fixed Price", bs: "Fiksna Cijena" },
  variable: { en: "Variable", bs: "Varijabilna" },
  quote: { en: "Request Quote", bs: "Na Upit" },
} as const;

// Animation variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
} as const;

// Stagger children animation
export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  GUEST_NAME_PREFIX: "guestName_",
  LOCALE: "locale",
  SIDEBAR_COLLAPSED: "sidebarCollapsed",
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  TENANTS: "/api/tenants",
  SERVICES: "/api/services",
  REQUESTS: "/api/requests",
  USERS: "/api/users",
  CATEGORIES: "/api/categories",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Date/time formats
export const DATE_FORMATS = {
  SHORT: { year: "numeric", month: "short", day: "numeric" } as const,
  LONG: { year: "numeric", month: "long", day: "numeric" } as const,
  WITH_TIME: {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  } as const,
} as const;
