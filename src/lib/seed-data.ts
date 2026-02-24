/**
 * Seed Data for StayPlus
 * 
 * This file contains all the initial data for categories and services.
 * Run this script to populate your Firebase database with initial data.
 * 
 * Usage: Import and call seedDatabase() from a server action or API route
 */

import type { ServiceCategory, Service, Tenant } from "@/types";

// ============ SERVICE CATEGORIES ============
export const seedCategories: Omit<ServiceCategory, "id">[] = [
  {
    name: { en: "Free Amenities", bs: "Besplatne Pogodnosti" },
    description: {
      en: "Complimentary items and services for your comfort",
      bs: "Besplatni predmeti i usluge za vašu udobnost",
    },
    icon: "gift",
    color: "green",
    order: 1,
    active: true,
  },
  {
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
    name: { en: "Tours & Activities", bs: "Ture i Aktivnosti" },
    description: {
      en: "Day trips, safaris, and local experiences",
      bs: "Jednodnevni izleti, safari i lokalna iskustva",
    },
    icon: "mountain",
    color: "emerald",
    order: 3,
    active: true,
  },
  {
    name: { en: "Food & Dining", bs: "Hrana i Restorani" },
    description: {
      en: "Breakfast, grocery shopping, and private chef services",
      bs: "Doručak, kupovina namirnica i usluge privatnog kuhara",
    },
    icon: "utensils",
    color: "orange",
    order: 4,
    active: true,
  },
  {
    name: { en: "Special Occasions", bs: "Posebne Prilike" },
    description: {
      en: "Romantic setups, birthdays, and proposal arrangements",
      bs: "Romantične pripreme, rođendani i pripreme za prosidbu",
    },
    icon: "heart",
    color: "pink",
    order: 5,
    active: true,
  },
  {
    name: { en: "Convenience", bs: "Pogodnosti" },
    description: {
      en: "Shopping runs, pharmacy, and currency exchange",
      bs: "Kupovina, apoteka i mjenjačnica",
    },
    icon: "shopping",
    color: "purple",
    order: 6,
    active: true,
  },
  {
    name: { en: "Car Services", bs: "Auto Usluge" },
    description: {
      en: "Car wash and detailing services",
      bs: "Pranje i detailing automobila",
    },
    icon: "car",
    color: "slate",
    order: 7,
    active: true,
  },
  {
    name: { en: "Extras", bs: "Dodatno" },
    description: {
      en: "Photography, borrowed items, and more",
      bs: "Fotografija, posudba predmeta i više",
    },
    icon: "sparkles",
    color: "amber",
    order: 8,
    active: true,
  },
];

// ============ SAMPLE SERVICES ============
// These will be created for the demo tenant
export const seedServices: Omit<Service, "id" | "tenantId" | "createdAt" | "updatedAt">[] = [
  // FREE AMENITIES
  {
    categoryId: "free",
    name: { en: "Complimentary Water", bs: "Besplatna Voda" },
    description: {
      en: "Fresh bottled water available in your apartment for your convenience",
      bs: "Svježa flaširana voda dostupna u vašem apartmanu za vašu udobnost",
    },
    shortDescription: { en: "Fresh bottled water", bs: "Svježa flaširana voda" },
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 1,
  },
  {
    categoryId: "free",
    name: { en: "Nespresso Coffee", bs: "Nespresso Kafa" },
    description: {
      en: "Premium Nespresso coffee capsules for your morning enjoyment",
      bs: "Premium Nespresso kapsule kafe za vaše jutarnje uživanje",
    },
    shortDescription: { en: "Premium coffee capsules", bs: "Premium kapsule kafe" },
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 2,
  },
  {
    categoryId: "free",
    name: { en: "Welcome Snacks", bs: "Grickalice Dobrodošlice" },
    description: {
      en: "Selection of chocolates and fresh fruits waiting for you",
      bs: "Izbor čokolada i svježeg voća koji vas čekaju",
    },
    shortDescription: { en: "Chocolates & fruits", bs: "Čokolade i voće" },
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 3,
  },
  {
    categoryId: "free",
    name: { en: "Borrowed Items", bs: "Posudba Predmeta" },
    description: {
      en: "Phone chargers, umbrella, iron, and other essentials available to borrow",
      bs: "Punjači za telefon, kišobran, pegla i ostale potrepštine dostupne za posudbu",
    },
    shortDescription: { en: "Chargers, umbrella, iron", bs: "Punjači, kišobran, pegla" },
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 4,
  },

  // TRANSPORT
  {
    categoryId: "transport",
    name: { en: "Airport Transfer", bs: "Aerodromski Transfer" },
    description: {
      en: "Comfortable pickup and dropoff from Sarajevo International Airport. Our driver will meet you at arrivals with a name sign.",
      bs: "Udoban prevoz od i do Međunarodnog aerodroma Sarajevo. Naš vozač će vas dočekati na dolasku s tablom s vašim imenom.",
    },
    shortDescription: { en: "Airport pickup & dropoff", bs: "Prevoz od/do aerodroma" },
    pricingType: "fixed",
    price: 25,
    currency: "EUR",
    active: true,
    featured: true,
    order: 1,
  },
  {
    categoryId: "transport",
    name: { en: "Rent a Car", bs: "Rent-a-Car" },
    description: {
      en: "Wide selection of vehicles for your travel needs. From economy to premium options.",
      bs: "Širok izbor vozila za vaše potrebe putovanja. Od ekonomskih do premium opcija.",
    },
    shortDescription: { en: "Vehicle rental service", bs: "Usluga iznajmljivanja vozila" },
    pricingType: "variable",
    price: 35,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard", bs: "Standard" }, price: 35, description: { en: "Economy vehicles", bs: "Ekonomska vozila" } },
      { id: "premium", name: { en: "Premium", bs: "Premium" }, price: 55, description: { en: "Luxury vehicles", bs: "Luksuzna vozila" } },
    ],
    active: true,
    order: 2,
  },
  {
    categoryId: "transport",
    name: { en: "Taxi Service", bs: "Taxi Usluga" },
    description: {
      en: "Reliable taxi service for getting around the city. Standard or premium options available.",
      bs: "Pouzdana taxi usluga za kretanje po gradu. Dostupne standardne ili premium opcije.",
    },
    shortDescription: { en: "City taxi service", bs: "Gradska taxi usluga" },
    pricingType: "variable",
    price: 10,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard", bs: "Standard" }, price: 10 },
      { id: "premium", name: { en: "Premium", bs: "Premium" }, price: 20 },
    ],
    active: true,
    order: 3,
  },
  {
    categoryId: "transport",
    name: { en: "Private Driver", bs: "Privatni Vozač" },
    description: {
      en: "Personal driver at your disposal for the day. Perfect for sightseeing or business.",
      bs: "Osobni vozač na raspolaganju za cijeli dan. Savršeno za razgledavanje ili poslovanje.",
    },
    shortDescription: { en: "Full-day private driver", bs: "Privatni vozač za cijeli dan" },
    pricingType: "fixed",
    price: 150,
    currency: "EUR",
    active: true,
    order: 4,
  },

  // TOURS & ACTIVITIES
  {
    categoryId: "tours",
    name: { en: "Erma Safari", bs: "Erma Safari" },
    description: {
      en: "Exciting safari adventure through beautiful Bosnian nature. Experience wildlife and stunning landscapes.",
      bs: "Uzbudljiva safari avantura kroz prekrasnu bosansku prirodu. Doživite divlje životinje i zadivljujuće pejzaže.",
    },
    shortDescription: { en: "Safari adventure experience", bs: "Safari avantura" },
    pricingType: "variable",
    price: 45,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard", bs: "Standard" }, price: 45 },
      { id: "premium", name: { en: "Premium", bs: "Premium" }, price: 75 },
      { id: "vip", name: { en: "VIP Package", bs: "VIP Paket" }, price: 120 },
    ],
    active: true,
    featured: true,
    order: 1,
  },
  {
    categoryId: "tours",
    name: { en: "Day Trip - Mostar", bs: "Jednodnevni Izlet - Mostar" },
    description: {
      en: "Visit the historic city of Mostar and its famous Old Bridge. Includes guided tour and free time.",
      bs: "Posjetite historijski grad Mostar i njegov čuveni Stari most. Uključuje vođenu turu i slobodno vrijeme.",
    },
    shortDescription: { en: "Historic Mostar tour", bs: "Tura historijskog Mostara" },
    pricingType: "variable",
    price: 65,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard", bs: "Standard" }, price: 65 },
      { id: "premium", name: { en: "Premium (with lunch)", bs: "Premium (s ručkom)" }, price: 95 },
    ],
    active: true,
    order: 2,
  },
  {
    categoryId: "tours",
    name: { en: "Day Trip - Konjic & Jablanica", bs: "Jednodnevni Izlet - Konjic i Jablanica" },
    description: {
      en: "Explore the beautiful towns of Konjic and Jablanica. Visit the famous bridge and enjoy local cuisine.",
      bs: "Istražite prekrasne gradove Konjic i Jablanicu. Posjetite čuveni most i uživajte u lokalnoj kuhinji.",
    },
    shortDescription: { en: "Konjic & Jablanica tour", bs: "Tura Konjic i Jablanica" },
    pricingType: "fixed",
    price: 55,
    currency: "EUR",
    active: true,
    order: 3,
  },
  {
    categoryId: "tours",
    name: { en: "Day Trip - Travnik & Jajce", bs: "Jednodnevni Izlet - Travnik i Jajce" },
    description: {
      en: "Discover the royal cities of Travnik and Jajce. See the famous waterfall and medieval fortress.",
      bs: "Otkrijte kraljevske gradove Travnik i Jajce. Pogledajte čuveni vodopad i srednjovjekovnu tvrđavu.",
    },
    shortDescription: { en: "Travnik & Jajce tour", bs: "Tura Travnik i Jajce" },
    pricingType: "fixed",
    price: 70,
    currency: "EUR",
    active: true,
    order: 4,
  },

  // FOOD & DINING
  {
    categoryId: "food",
    name: { en: "Breakfast", bs: "Doručak" },
    description: {
      en: "Delicious breakfast delivered from our partner restaurant. Traditional Bosnian or continental options.",
      bs: "Ukusan doručak dostavljen iz našeg partnerskog restorana. Tradicionalne bosanske ili kontinentalne opcije.",
    },
    shortDescription: { en: "Restaurant breakfast delivery", bs: "Dostava doručka iz restorana" },
    pricingType: "fixed",
    price: 15,
    currency: "EUR",
    active: true,
    order: 1,
  },
  {
    categoryId: "food",
    name: { en: "Grocery Pre-stock", bs: "Nabavka Namirnica" },
    description: {
      en: "Have your groceries waiting for you when you arrive. Send us your shopping list and we'll take care of the rest.",
      bs: "Neka vas namirnice čekaju kada stignete. Pošaljite nam listu za kupovinu i mi ćemo se pobrinuti za ostalo.",
    },
    shortDescription: { en: "Pre-arrival grocery shopping", bs: "Kupovina namirnica prije dolaska" },
    pricingType: "quote",
    currency: "EUR",
    active: true,
    order: 2,
  },
  {
    categoryId: "food",
    name: { en: "Private Chef", bs: "Privatni Kuhar" },
    description: {
      en: "Enjoy a gourmet dinner prepared by a professional chef in your apartment. Perfect for special occasions.",
      bs: "Uživajte u gurmanskoj večeri koju priprema profesionalni kuhar u vašem apartmanu. Savršeno za posebne prilike.",
    },
    shortDescription: { en: "In-apartment dining experience", bs: "Iskustvo večere u apartmanu" },
    pricingType: "quote",
    currency: "EUR",
    active: true,
    featured: true,
    order: 3,
  },

  // SPECIAL OCCASIONS
  {
    categoryId: "special",
    name: { en: "Romantic Setup", bs: "Romantična Priprema" },
    description: {
      en: "Rose petals, candles, champagne - make your evening unforgettable. Perfect for anniversaries and special dates.",
      bs: "Latice ruža, svijeće, šampanjac - učinite večer nezaboravnom. Savršeno za godišnjice i posebne datume.",
    },
    shortDescription: { en: "Romantic evening setup", bs: "Priprema romantične večeri" },
    pricingType: "variable",
    price: 50,
    currency: "EUR",
    active: true,
    featured: true,
    order: 1,
  },
  {
    categoryId: "special",
    name: { en: "Proposal Setup", bs: "Priprema za Prosidbu" },
    description: {
      en: "Make your proposal moment perfect. We'll help you create an unforgettable setting for the big question.",
      bs: "Učinite trenutak prosidbe savršenim. Pomoći ćemo vam stvoriti nezaboravan ambijent za veliko pitanje.",
    },
    shortDescription: { en: "Marriage proposal arrangement", bs: "Priprema za prosidbu" },
    pricingType: "quote",
    currency: "EUR",
    active: true,
    order: 2,
  },
  {
    categoryId: "special",
    name: { en: "Birthday Setup", bs: "Rođendanska Priprema" },
    description: {
      en: "Surprise your loved one with a birthday celebration. Decorations, cake, and more.",
      bs: "Iznenadite voljenu osobu proslavom rođendana. Dekoracije, torta i više.",
    },
    shortDescription: { en: "Birthday celebration setup", bs: "Priprema proslave rođendana" },
    pricingType: "variable",
    price: 40,
    currency: "EUR",
    active: true,
    order: 3,
  },

  // CONVENIENCE
  {
    categoryId: "convenience",
    name: { en: "Shopping Run", bs: "Kupovina" },
    description: {
      en: "We'll pick up whatever you need from local stores. Just send us your list.",
      bs: "Pokupićemo sve što vam treba iz lokalnih trgovina. Samo nam pošaljite listu.",
    },
    shortDescription: { en: "Personal shopping service", bs: "Usluga osobne kupovine" },
    pricingType: "fixed",
    price: 10,
    currency: "EUR",
    active: true,
    order: 1,
  },
  {
    categoryId: "convenience",
    name: { en: "Pharmacy Run", bs: "Apoteka" },
    description: {
      en: "Need medication or health products? We'll pick them up for you from the pharmacy.",
      bs: "Trebate lijekove ili zdravstvene proizvode? Pokupićemo ih za vas iz apoteke.",
    },
    shortDescription: { en: "Pharmacy pickup service", bs: "Usluga preuzimanja iz apoteke" },
    pricingType: "fixed",
    price: 10,
    currency: "EUR",
    active: true,
    order: 2,
  },
  {
    categoryId: "convenience",
    name: { en: "Currency Exchange", bs: "Mjenjačnica" },
    description: {
      en: "Need to exchange currency? We offer competitive rates and convenient service.",
      bs: "Trebate zamijeniti valutu? Nudimo konkurentne tečajeve i praktičnu uslugu.",
    },
    shortDescription: { en: "Currency exchange service", bs: "Usluga mjenjačnice" },
    pricingType: "quote",
    currency: "EUR",
    active: true,
    order: 3,
  },

  // CAR SERVICES
  {
    categoryId: "car",
    name: { en: "Car Wash", bs: "Pranje Auta" },
    description: {
      en: "Professional car wash service. We'll pick up your car and return it sparkling clean.",
      bs: "Profesionalna usluga pranja automobila. Pokupićemo vaš auto i vratiti ga blistavo čistog.",
    },
    shortDescription: { en: "Professional car wash", bs: "Profesionalno pranje auta" },
    pricingType: "fixed",
    price: 20,
    currency: "EUR",
    active: true,
    order: 1,
  },
  {
    categoryId: "car",
    name: { en: "Car Detailing", bs: "Detailing Auta" },
    description: {
      en: "Complete interior and exterior detailing service for your vehicle.",
      bs: "Kompletna usluga detailinga unutrašnjosti i vanjštine vašeg vozila.",
    },
    shortDescription: { en: "Full car detailing", bs: "Kompletan detailing auta" },
    pricingType: "fixed",
    price: 50,
    currency: "EUR",
    active: true,
    order: 2,
  },

  // EXTRAS
  {
    categoryId: "extras",
    name: { en: "Photographer", bs: "Fotograf" },
    description: {
      en: "Professional photography services for your special moments in Sarajevo.",
      bs: "Profesionalne fotografske usluge za vaše posebne trenutke u Sarajevu.",
    },
    shortDescription: { en: "Professional photography", bs: "Profesionalna fotografija" },
    pricingType: "quote",
    currency: "EUR",
    active: true,
    order: 1,
  },
];

// ============ SAMPLE TENANT ============
export const seedTenant: Omit<Tenant, "id" | "createdAt" | "updatedAt"> = {
  slug: "sunny-sarajevo",
  name: "Sunny Sarajevo Apartment",
  description: {
    en: "Beautiful apartment in the heart of Sarajevo",
    bs: "Prekrasan apartman u srcu Sarajeva",
  },
  branding: {
    primaryColor: "#f96d4a",
    accentColor: "#05c7ae",
    hideLogo: false,
  },
  contact: {
    email: "host@example.com",
    phone: "+387 61 123 456",
    whatsapp: "+387 61 123 456",
  },
  active: true,
};

/**
 * Seed the database with initial data
 * Call this function from a server action or API route
 */
export async function seedDatabase() {
  // Import Firebase functions
  const { createCategory, createTenant, createService } = await import("./firebase/collections");

  console.log("Starting database seed...");

  // Create categories
  console.log("Creating categories...");
  const categoryIds: Record<string, string> = {};
  for (const category of seedCategories) {
    const id = await createCategory(category);
    // Use a simple key based on the English name
    const key = category.name.en.toLowerCase().replace(/[^a-z]/g, "").slice(0, 10);
    categoryIds[key] = id;
    console.log(`Created category: ${category.name.en} (${id})`);
  }

  // Create tenant
  console.log("Creating tenant...");
  const tenantId = await createTenant(seedTenant);
  console.log(`Created tenant: ${seedTenant.name} (${tenantId})`);

  // Create services
  console.log("Creating services...");
  for (const service of seedServices) {
    await createService({
      ...service,
      tenantId,
    });
    console.log(`Created service: ${service.name.en}`);
  }

  console.log("Database seed completed!");
  return { categoryIds, tenantId };
}
