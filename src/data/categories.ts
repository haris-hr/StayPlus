import type { ServiceCategory } from "@/types";

export const categories: ServiceCategory[] = [
  {
    id: "free",
    name: { en: "Free Amenities", bs: "Besplatne Pogodnosti" },
    description: {
      en: "Complimentary services and amenities for our guests",
      bs: "Besplatne usluge i pogodnosti za naše goste",
    },
    icon: "gift",
    color: "emerald",
    order: 1,
    active: true,
  },
  {
    id: "transport",
    name: { en: "Transport", bs: "Transport" },
    description: {
      en: "Airport transfers, car rentals, and taxi services",
      bs: "Aerodromski transferi, rent-a-car i taxi usluge",
    },
    icon: "car",
    color: "blue",
    order: 2,
    active: true,
  },
  {
    id: "tours",
    name: { en: "Tours & Activities", bs: "Ture i Aktivnosti" },
    description: {
      en: "Guided tours, day trips, and outdoor adventures",
      bs: "Vođene ture, jednodnevni izleti i avanture na otvorenom",
    },
    icon: "mountain",
    color: "orange",
    order: 3,
    active: true,
  },
  {
    id: "food",
    name: { en: "Food & Dining", bs: "Hrana i Restorani" },
    description: {
      en: "Breakfast, grocery shopping, and dining experiences",
      bs: "Doručak, kupovina namirnica i gastronomska iskustva",
    },
    icon: "utensils",
    color: "red",
    order: 4,
    active: true,
  },
  {
    id: "special",
    name: { en: "Special Occasions", bs: "Posebne Prilike" },
    description: {
      en: "Romantic setups, birthday celebrations, and more",
      bs: "Romantične pripreme, proslave rođendana i više",
    },
    icon: "heart",
    color: "pink",
    order: 5,
    active: true,
  },
  {
    id: "convenience",
    name: { en: "Convenience", bs: "Pogodnosti" },
    description: {
      en: "Shopping runs, pharmacy, laundry, and more",
      bs: "Kupovina, apoteka, pranje veša i više",
    },
    icon: "shopping-bag",
    color: "indigo",
    order: 6,
    active: true,
  },
  {
    id: "car-services",
    name: { en: "Car Services", bs: "Auto Usluge" },
    description: {
      en: "Car wash, detailing, and maintenance",
      bs: "Pranje auta, detailing i održavanje",
    },
    icon: "wrench",
    color: "slate",
    order: 7,
    active: true,
  },
  {
    id: "photography",
    name: { en: "Photography", bs: "Fotografija" },
    description: {
      en: "Professional photo sessions and vacation memories",
      bs: "Profesionalne foto sesije i uspomene s odmora",
    },
    icon: "camera",
    color: "violet",
    order: 8,
    active: true,
  },
];

export const getCategoryById = (id: string): ServiceCategory | undefined => {
  return categories.find((c) => c.id === id);
};

export const getActiveCategories = (): ServiceCategory[] => {
  return categories.filter((c) => c.active).sort((a, b) => a.order - b.order);
};
