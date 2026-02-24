import type { Tenant } from "@/types";

export const tenants: Record<string, Tenant> = {
  "sunny-sarajevo": {
    id: "sunny-sarajevo",
    slug: "sunny-sarajevo",
    name: "Sunny Sarajevo Apartment",
    description: {
      en: "Welcome to your home away from home in the heart of Sarajevo. Explore our curated services to make your stay unforgettable!",
      bs: "Dobrodošli u vaš dom daleko od doma u srcu Sarajeva. Istražite naše usluge kako biste učinili vaš boravak nezaboravnim!",
    },
    branding: {
      heroImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80",
      primaryColor: "#f96d4a",
      accentColor: "#05c7ae",
    },
    contact: {
      email: "host@sunnysarajevo.com",
      phone: "+387 61 123 456",
      whatsapp: "+387 61 123 456",
      address: "Ferhadija 15, Sarajevo 71000",
    },
    active: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  "mountain-view": {
    id: "mountain-view",
    slug: "mountain-view",
    name: "Mountain View Lodge",
    description: {
      en: "Escape to the mountains! Your cozy retreat near Bjelašnica awaits with stunning views and adventure at your doorstep.",
      bs: "Pobegnite u planine! Vaše udobno utočište blizu Bjelašnice čeka sa zadivljujućim pogledima i avanturom na pragu.",
    },
    branding: {
      heroImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80",
      primaryColor: "#2d5a27",
      accentColor: "#8b4513",
    },
    contact: {
      email: "info@mountainviewlodge.ba",
      phone: "+387 62 987 654",
      address: "Bjelašnica bb, Trnovo 71220",
    },
    active: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  "dobrinja-apartments": {
    id: "dobrinja-apartments",
    slug: "dobrinja-apartments",
    name: "Dobrinja Apartments",
    description: {
      en: "Modern comfort meets convenience. Discover our premium services designed to enhance your Sarajevo experience.",
      bs: "Moderna udobnost susreće praktičnost. Otkrijte naše premium usluge dizajnirane da unaprijede vaše sarajevsko iskustvo.",
    },
    branding: {
      heroImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
      primaryColor: "#1e40af",
      accentColor: "#0891b2",
      hideLogo: true, // Full white-label - hide StayPlus branding
    },
    contact: {
      email: "info@dobrinja-apartments.ba",
      phone: "+387 61 555 777",
      whatsapp: "+387 61 555 777",
      address: "Dobrinja C5, Sarajevo 71000",
    },
    active: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
};

export const getTenantBySlug = (slug: string): Tenant | undefined => {
  return tenants[slug];
};

export const getTenantById = (id: string): Tenant | undefined => {
  return Object.values(tenants).find((t) => t.id === id);
};

export const getActiveTenants = (): Tenant[] => {
  return Object.values(tenants).filter((t) => t.active);
};

export const getAllTenants = (): Tenant[] => {
  return Object.values(tenants);
};
