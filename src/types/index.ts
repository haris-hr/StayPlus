// Internationalization types
export type Locale = "en" | "bs";

export interface I18nText {
  en: string;
  bs: string;
}

// Tenant types
export interface TenantBranding {
  logo?: string;
  heroImage?: string; // Hero banner image for the guest portal (top of guest portal)
  primaryColor?: string;
  accentColor?: string;
  hideLogo?: boolean;
  customDomain?: string;
}

export interface TenantContact {
  email: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  description?: I18nText;
  branding: TenantBranding;
  contact: TenantContact;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Service types
export type PricingType = "fixed" | "variable" | "quote" | "free";

export interface ServiceTier {
  id: string;
  name: I18nText;
  price?: number;
  description?: I18nText;
}

export interface Service {
  id: string;
  tenantId: string;
  categoryId: string;
  name: I18nText;
  description: I18nText;
  shortDescription?: I18nText;
  image?: string;
  icon?: string;
  pricingType: PricingType;
  price?: number;
  currency: string;
  tiers?: ServiceTier[];
  active: boolean;
  featured?: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: I18nText;
  description?: I18nText;
  icon: string;
  color?: string;
  order: number;
  active: boolean;
}

// Request types
export type RequestStatus = 
  | "pending" 
  | "confirmed" 
  | "in_progress" 
  | "completed" 
  | "cancelled";

export interface ServiceRequest {
  id: string;
  tenantId: string;
  serviceId: string;
  serviceName: I18nText;
  categoryId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  status: RequestStatus;
  selectedTier?: string;
  quantity?: number;
  date?: Date;
  time?: string;
  notes?: string;
  price?: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export type UserRole = "super_admin" | "tenant_admin" | "tenant_viewer";

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  tenantId?: string; // Only for tenant users
  active: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Dashboard stats
export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  requestsThisWeek: number;
  requestsThisMonth: number;
  popularServices: { serviceId: string; serviceName: string; count: number }[];
}

// Form types
export interface GuestRequestForm {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  selectedTier?: string;
  quantity?: number;
  date?: string;
  time?: string;
  notes?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
