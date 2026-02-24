"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  GuestNameModal,
  GuestHeader,
  CategoryTabs,
  ServiceCard,
  ServiceDetailModal,
} from "@/components/guest";
import { Spinner } from "@/components/ui";
import { Link } from "@/i18n/routing";
import type { Tenant, Service, ServiceCategory, Locale, GuestRequestForm } from "@/types";

// Mock data for development - will be replaced with Firebase
const mockCategories: ServiceCategory[] = [
  { id: "free", name: { en: "Free Amenities", bs: "Besplatne Pogodnosti" }, icon: "gift", order: 1, active: true },
  { id: "transport", name: { en: "Transport", bs: "Transport" }, icon: "car", order: 2, active: true },
  { id: "tours", name: { en: "Tours & Activities", bs: "Ture i Aktivnosti" }, icon: "mountain", order: 3, active: true },
  { id: "food", name: { en: "Food & Dining", bs: "Hrana i Restorani" }, icon: "utensils", order: 4, active: true },
  { id: "special", name: { en: "Special Occasions", bs: "Posebne Prilike" }, icon: "heart", order: 5, active: true },
  { id: "convenience", name: { en: "Convenience", bs: "Pogodnosti" }, icon: "shopping", order: 6, active: true },
  { id: "car-services", name: { en: "Car Services", bs: "Auto Usluge" }, icon: "car", order: 7, active: true },
  { id: "photography", name: { en: "Photography", bs: "Fotografija" }, icon: "camera", order: 8, active: true },
];

// Services for Sunny Sarajevo Apartment
const sunnySarajevoServices: Service[] = [
  // FREE AMENITIES
  {
    id: "1",
    tenantId: "sunny-sarajevo",
    categoryId: "free",
    name: { en: "Complimentary Water & Snacks", bs: "Besplatna Voda i Grickalice" },
    description: { en: "Fresh bottled water, local chocolates, and seasonal fruits waiting for you upon arrival. A small welcome gift from us!", bs: "Svježa flaširana voda, domaće čokolade i sezonsko voće čekaju vas po dolasku. Mali poklon dobrodošlice od nas!" },
    shortDescription: { en: "Water, chocolates & fruits", bs: "Voda, čokolade i voće" },
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    tenantId: "sunny-sarajevo",
    categoryId: "free",
    name: { en: "Nespresso Coffee & Tea", bs: "Nespresso Kafa i Čaj" },
    description: { en: "Premium Nespresso coffee capsules and a selection of fine teas. Start your morning the right way!", bs: "Premium Nespresso kapsule i izbor finih čajeva. Započnite jutro na pravi način!" },
    shortDescription: { en: "Premium coffee & tea selection", bs: "Premium izbor kafe i čaja" },
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    tenantId: "sunny-sarajevo",
    categoryId: "free",
    name: { en: "Phone Chargers & Adapters", bs: "Punjači i Adapteri" },
    description: { en: "Forgot your charger? No problem! We have iPhone, Android, and universal chargers available for you to borrow.", bs: "Zaboravili ste punjač? Nema problema! Imamo iPhone, Android i univerzalne punjače na raspolaganju." },
    shortDescription: { en: "Borrow chargers & adapters", bs: "Posudite punjače i adaptere" },
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    tenantId: "sunny-sarajevo",
    categoryId: "free",
    name: { en: "Umbrellas & Rain Gear", bs: "Kišobrani i Oprema za Kišu" },
    description: { en: "Sarajevo weather can be unpredictable! Borrow our umbrellas and stay dry during your explorations.", bs: "Sarajevsko vrijeme može biti nepredvidivo! Posudite naše kišobrane i ostanite suhi tokom istraživanja." },
    shortDescription: { en: "Borrow umbrellas", bs: "Posudite kišobrane" },
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80",
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // TRANSPORT
  {
    id: "5",
    tenantId: "sunny-sarajevo",
    categoryId: "transport",
    name: { en: "Airport Transfer", bs: "Aerodromski Transfer" },
    description: { en: "Comfortable and reliable pickup and dropoff from Sarajevo International Airport. Our driver will meet you at arrivals with a name sign. Includes luggage assistance and bottled water.", bs: "Udoban i pouzdan prevoz od i do Međunarodnog aerodroma Sarajevo. Naš vozač će vas dočekati na dolasku s natpisom vašeg imena. Uključuje pomoć s prtljagom i flaširanu vodu." },
    shortDescription: { en: "Airport pickup & dropoff", bs: "Prevoz od/do aerodroma" },
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    pricingType: "fixed",
    price: 25,
    currency: "EUR",
    active: true,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    tenantId: "sunny-sarajevo",
    categoryId: "transport",
    name: { en: "Rent a Car", bs: "Rent-a-Car" },
    description: { en: "Explore Bosnia at your own pace! Choose from our selection of well-maintained vehicles. All cars include full insurance, unlimited mileage, and 24/7 roadside assistance.", bs: "Istražite Bosnu svojim tempom! Izaberite iz naše ponude dobro održavanih vozila. Svi automobili uključuju puno osiguranje, neograničenu kilometražu i 24/7 pomoć na cesti." },
    shortDescription: { en: "Freedom to explore", bs: "Sloboda istraživanja" },
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    pricingType: "variable",
    price: 35,
    currency: "EUR",
    tiers: [
      { id: "economy", name: { en: "Economy (VW Polo)", bs: "Ekonomija (VW Polo)" }, price: 35, description: { en: "Perfect for city driving", bs: "Savršen za gradsku vožnju" } },
      { id: "standard", name: { en: "Standard (VW Golf)", bs: "Standard (VW Golf)" }, price: 45, description: { en: "Comfortable for longer trips", bs: "Udoban za duža putovanja" } },
      { id: "premium", name: { en: "Premium (Mercedes C220d)", bs: "Premium (Mercedes C220d)" }, price: 85, description: { en: "Travel in style & luxury", bs: "Putujte sa stilom i luksuzom" } },
    ],
    active: true,
    featured: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    tenantId: "sunny-sarajevo",
    categoryId: "transport",
    name: { en: "Private Driver", bs: "Privatni Vozač" },
    description: { en: "Your personal chauffeur for the day. Perfect for business meetings, special occasions, or simply exploring the city in comfort. Professional, English-speaking driver.", bs: "Vaš osobni vozač za cijeli dan. Savršeno za poslovne sastanke, posebne prilike ili jednostavno istraživanje grada u udobnosti. Profesionalni vozač koji govori engleski." },
    shortDescription: { en: "Personal chauffeur service", bs: "Usluga osobnog vozača" },
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    pricingType: "variable",
    price: 80,
    currency: "EUR",
    tiers: [
      { id: "half-day", name: { en: "Half Day (4 hours)", bs: "Pola Dana (4 sata)" }, price: 80 },
      { id: "full-day", name: { en: "Full Day (8 hours)", bs: "Cijeli Dan (8 sati)" }, price: 140 },
    ],
    active: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    tenantId: "sunny-sarajevo",
    categoryId: "transport",
    name: { en: "City Taxi", bs: "Gradski Taxi" },
    description: { en: "Need a quick ride? We'll arrange a trusted taxi for you anywhere in Sarajevo. Fixed prices, no surprises.", bs: "Trebate brzu vožnju? Organizirat ćemo pouzdani taxi za vas bilo gdje u Sarajevu. Fiksne cijene, bez iznenađenja." },
    shortDescription: { en: "Quick city rides", bs: "Brze gradske vožnje" },
    image: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=800&q=80",
    pricingType: "variable",
    price: 5,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard Taxi", bs: "Standardni Taxi" }, price: 5, description: { en: "Base fare + per km", bs: "Osnovna tarifa + po km" } },
      { id: "premium", name: { en: "Premium (Mercedes)", bs: "Premium (Mercedes)" }, price: 10, description: { en: "Luxury vehicle", bs: "Luksuzno vozilo" } },
    ],
    active: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // TOURS & ACTIVITIES
  {
    id: "9",
    tenantId: "sunny-sarajevo",
    categoryId: "tours",
    name: { en: "Erma Safari Adventure", bs: "Erma Safari Avantura" },
    description: { en: "Experience the breathtaking beauty of Bosnian nature on our famous Erma Safari! Off-road adventure through mountains, rivers, and hidden villages. Includes lunch at a traditional restaurant.", bs: "Doživite zapanjujuću ljepotu bosanske prirode na našem čuvenom Erma Safariju! Off-road avantura kroz planine, rijeke i skrivena sela. Uključuje ručak u tradicionalnom restoranu." },
    shortDescription: { en: "Off-road nature adventure", bs: "Off-road avantura u prirodi" },
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    pricingType: "variable",
    price: 45,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard (Shared)", bs: "Standard (Grupni)" }, price: 45, description: { en: "Join a group tour", bs: "Pridružite se grupnoj turi" } },
      { id: "premium", name: { en: "Premium (Private)", bs: "Premium (Privatni)" }, price: 95, description: { en: "Private tour for 2", bs: "Privatna tura za 2" } },
      { id: "vip", name: { en: "VIP Package", bs: "VIP Paket" }, price: 150, description: { en: "Private + drone footage", bs: "Privatno + snimanje dronom" } },
    ],
    active: true,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    tenantId: "sunny-sarajevo",
    categoryId: "tours",
    name: { en: "Mostar & Kravice Day Trip", bs: "Jednodnevni Izlet Mostar i Kravice" },
    description: { en: "Visit the iconic Stari Most (Old Bridge), explore the charming old town, and cool off at the stunning Kravice Waterfalls. A must-do experience!", bs: "Posjetite ikonični Stari Most, istražite šarmantnu staru čaršiju i rashladite se na prekrasnim Kravice vodopadima. Nezaobilazno iskustvo!" },
    shortDescription: { en: "Old Bridge & waterfalls", bs: "Stari Most i vodopadi" },
    image: "https://images.unsplash.com/photo-1592425044793-a1d66db91cec?w=800&q=80",
    pricingType: "variable",
    price: 65,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard (Group)", bs: "Standard (Grupni)" }, price: 65 },
      { id: "private", name: { en: "Private Tour", bs: "Privatna Tura" }, price: 180 },
    ],
    active: true,
    featured: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    tenantId: "sunny-sarajevo",
    categoryId: "tours",
    name: { en: "Travnik & Jajce Day Trip", bs: "Jednodnevni Izlet Travnik i Jajce" },
    description: { en: "Discover the royal town of Travnik with its medieval fortress and the magical Jajce with its famous waterfall in the city center. Rich history and stunning nature!", bs: "Otkrijte kraljevski grad Travnik sa srednjovjekovnom tvrđavom i čarobni Jajce sa čuvenim vodopadom u centru grada. Bogata historija i zapanjujuća priroda!" },
    shortDescription: { en: "Medieval towns & waterfalls", bs: "Srednjovjekovni gradovi i vodopadi" },
    image: "https://images.unsplash.com/photo-1596394723269-b2cbca4e6313?w=800&q=80",
    pricingType: "fixed",
    price: 70,
    currency: "EUR",
    active: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    tenantId: "sunny-sarajevo",
    categoryId: "tours",
    name: { en: "Sarajevo Walking Tour", bs: "Pješačka Tura Sarajevom" },
    description: { en: "Explore the fascinating history of Sarajevo with our expert local guide. Visit Baščaršija, the Latin Bridge, war tunnels, and hidden gems only locals know about.", bs: "Istražite fascinantnu historiju Sarajeva s našim stručnim lokalnim vodičem. Posjetite Baščaršiju, Latinski most, ratne tunele i skrivene dragulje koje samo lokalni stanovnici poznaju." },
    shortDescription: { en: "Discover Sarajevo's secrets", bs: "Otkrijte tajne Sarajeva" },
    image: "https://images.unsplash.com/photo-1555990538-1e7a7210c6e8?w=800&q=80",
    pricingType: "fixed",
    price: 25,
    currency: "EUR",
    active: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "13",
    tenantId: "sunny-sarajevo",
    categoryId: "tours",
    name: { en: "Konjic Rafting Adventure", bs: "Rafting Avantura Konjic" },
    description: { en: "Experience the thrill of white-water rafting on the beautiful Neretva River! All equipment provided, suitable for beginners and experienced rafters alike.", bs: "Doživite uzbuđenje raftinga na prekrasnoj rijeci Neretvi! Sva oprema je osigurana, pogodno za početnike i iskusne raftere." },
    shortDescription: { en: "White-water rafting", bs: "Rafting na divljim vodama" },
    image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80",
    pricingType: "fixed",
    price: 55,
    currency: "EUR",
    active: true,
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // FOOD & DINING
  {
    id: "14",
    tenantId: "sunny-sarajevo",
    categoryId: "food",
    name: { en: "Traditional Breakfast Delivery", bs: "Dostava Tradicionalnog Doručka" },
    description: { en: "Wake up to a delicious Bosnian breakfast delivered to your door! Fresh somun bread, kajmak, local cheese, eggs, and traditional pastries from our partner bakery.", bs: "Probudite se uz ukusan bosanski doručak dostavljen na vrata! Svježi somun, kajmak, domaći sir, jaja i tradicionalne peciva iz naše partnerske pekare." },
    shortDescription: { en: "Authentic Bosnian breakfast", bs: "Autentičan bosanski doručak" },
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
    pricingType: "fixed",
    price: 15,
    currency: "EUR",
    active: true,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "15",
    tenantId: "sunny-sarajevo",
    categoryId: "food",
    name: { en: "Grocery Pre-Stock", bs: "Nabavka Namirnica" },
    description: { en: "Arrive to a fully stocked fridge! Tell us what you need and we'll have everything ready for you. Perfect for families or longer stays.", bs: "Stignite do punog frižidera! Recite nam šta vam treba i sve će biti spremno za vas. Savršeno za porodice ili duže boravke." },
    shortDescription: { en: "Pre-arrival shopping", bs: "Kupovina prije dolaska" },
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    pricingType: "quote",
    currency: "EUR",
    active: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "16",
    tenantId: "sunny-sarajevo",
    categoryId: "food",
    name: { en: "Private Chef Experience", bs: "Iskustvo Privatnog Kuhara" },
    description: { en: "Enjoy a gourmet dinner prepared in your apartment by our talented private chef. Choose from traditional Bosnian cuisine or international dishes. Perfect for special occasions!", bs: "Uživajte u gurmanskoj večeri pripremljenoj u vašem apartmanu od strane našeg talentovanog privatnog kuhara. Izaberite tradicionalnu bosansku kuhinju ili internacionalna jela. Savršeno za posebne prilike!" },
    shortDescription: { en: "Gourmet dinner at home", bs: "Gurmanska večera kod kuće" },
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    pricingType: "variable",
    price: 80,
    currency: "EUR",
    tiers: [
      { id: "2-course", name: { en: "2-Course Dinner", bs: "Večera od 2 Slijeda" }, price: 80 },
      { id: "4-course", name: { en: "4-Course Dinner", bs: "Večera od 4 Slijeda" }, price: 120 },
      { id: "full", name: { en: "Full Experience + Wine", bs: "Puno Iskustvo + Vino" }, price: 180 },
    ],
    active: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "17",
    tenantId: "sunny-sarajevo",
    categoryId: "food",
    name: { en: "Restaurant Reservations", bs: "Rezervacije Restorana" },
    description: { en: "Let us book the best restaurants in Sarajevo for you! From traditional ćevapi spots to fine dining, we know all the best places.", bs: "Pustite nas da rezervišemo najbolje restorane u Sarajevu za vas! Od tradicionalnih ćevabdžinica do fine dining restorana, znamo sva najbolja mjesta." },
    shortDescription: { en: "Best local restaurants", bs: "Najbolji lokalni restorani" },
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // SPECIAL OCCASIONS
  {
    id: "18",
    tenantId: "sunny-sarajevo",
    categoryId: "special",
    name: { en: "Romantic Setup", bs: "Romantična Priprema" },
    description: { en: "Surprise your loved one with a beautifully decorated apartment! Rose petals, candles, champagne, chocolates, and soft music. Perfect for anniversaries or proposals.", bs: "Iznenadite voljenu osobu prekrasno ukrašenim apartmanom! Latice ruža, svijeće, šampanjac, čokolade i tiha muzika. Savršeno za godišnjice ili prosidbe." },
    shortDescription: { en: "Love is in the air", bs: "Ljubav je u zraku" },
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
    pricingType: "variable",
    price: 50,
    currency: "EUR",
    tiers: [
      { id: "basic", name: { en: "Basic (Petals & Candles)", bs: "Osnovni (Latice i Svijeće)" }, price: 50 },
      { id: "premium", name: { en: "Premium + Champagne", bs: "Premium + Šampanjac" }, price: 90 },
      { id: "proposal", name: { en: "Proposal Package", bs: "Paket za Prosidbu" }, price: 150 },
    ],
    active: true,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "19",
    tenantId: "sunny-sarajevo",
    categoryId: "special",
    name: { en: "Birthday Celebration Setup", bs: "Priprema Proslave Rođendana" },
    description: { en: "Make their birthday unforgettable! Balloons, decorations, cake, and a special gift. We'll set everything up before you arrive.", bs: "Učinite njihov rođendan nezaboravnim! Baloni, dekoracije, torta i poseban poklon. Sve ćemo pripremiti prije vašeg dolaska." },
    shortDescription: { en: "Birthday surprise setup", bs: "Iznenađenje za rođendan" },
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    pricingType: "variable",
    price: 60,
    currency: "EUR",
    tiers: [
      { id: "basic", name: { en: "Basic Decoration", bs: "Osnovna Dekoracija" }, price: 60 },
      { id: "with-cake", name: { en: "With Custom Cake", bs: "Sa Tortom po Narudžbi" }, price: 100 },
      { id: "full", name: { en: "Full Party Package", bs: "Puni Party Paket" }, price: 150 },
    ],
    active: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "20",
    tenantId: "sunny-sarajevo",
    categoryId: "special",
    name: { en: "Honeymoon Package", bs: "Paket za Medeni Mjesec" },
    description: { en: "Start your married life in style! Includes romantic setup, champagne breakfast, couples massage booking, and a special dinner reservation.", bs: "Započnite bračni život sa stilom! Uključuje romantičnu pripremu, doručak sa šampanjcem, rezervaciju masaže za parove i posebnu rezervaciju večere." },
    shortDescription: { en: "Perfect honeymoon start", bs: "Savršen početak medenog mjeseca" },
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    pricingType: "fixed",
    price: 200,
    currency: "EUR",
    active: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // CONVENIENCE
  {
    id: "21",
    tenantId: "sunny-sarajevo",
    categoryId: "convenience",
    name: { en: "Shopping Run", bs: "Usluga Kupovine" },
    description: { en: "Need something from the store? We'll pick it up for you! Groceries, pharmacy items, souvenirs - just tell us what you need.", bs: "Trebate nešto iz trgovine? Mi ćemo to pokupiti za vas! Namirnice, lijekovi, suveniri - samo nam recite šta vam treba." },
    shortDescription: { en: "We shop, you relax", bs: "Mi kupujemo, vi se opuštate" },
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    pricingType: "fixed",
    price: 10,
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "22",
    tenantId: "sunny-sarajevo",
    categoryId: "convenience",
    name: { en: "Pharmacy Run", bs: "Usluga Apoteke" },
    description: { en: "Feeling under the weather? We'll get your medicine from the pharmacy. Just send us a photo of what you need or describe your symptoms.", bs: "Ne osjećate se dobro? Donijet ćemo vam lijekove iz apoteke. Samo nam pošaljite sliku onoga što vam treba ili opišite simptome." },
    shortDescription: { en: "Medicine delivery", bs: "Dostava lijekova" },
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    pricingType: "fixed",
    price: 8,
    currency: "EUR",
    active: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "23",
    tenantId: "sunny-sarajevo",
    categoryId: "convenience",
    name: { en: "Currency Exchange", bs: "Mjenjačnica" },
    description: { en: "Need to exchange money? We'll handle it for you at the best rates in town. No need to search for exchange offices!", bs: "Trebate zamijeniti novac? Mi ćemo to obaviti za vas po najboljim kursevima u gradu. Nema potrebe tražiti mjenjačnice!" },
    shortDescription: { en: "Best exchange rates", bs: "Najbolji kursevi" },
    image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80",
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "24",
    tenantId: "sunny-sarajevo",
    categoryId: "convenience",
    name: { en: "Laundry Service", bs: "Usluga Pranja Veša" },
    description: { en: "Traveling light? We offer wash, dry, and fold service. Express same-day service available for an additional fee.", bs: "Putujete lagano? Nudimo uslugu pranja, sušenja i slaganja. Ekspresna usluga istog dana dostupna uz dodatnu naknadu." },
    shortDescription: { en: "Wash, dry & fold", bs: "Pranje, sušenje i slaganje" },
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80",
    pricingType: "variable",
    price: 15,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard (24h)", bs: "Standard (24h)" }, price: 15 },
      { id: "express", name: { en: "Express (Same Day)", bs: "Ekspres (Isti Dan)" }, price: 25 },
    ],
    active: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // CAR SERVICES
  {
    id: "25",
    tenantId: "sunny-sarajevo",
    categoryId: "car-services",
    name: { en: "Car Wash & Detailing", bs: "Pranje i Detailing Auta" },
    description: { en: "Arrived with your own car? Let us take care of it while you explore! From basic wash to full detailing, we've got you covered.", bs: "Stigli ste sa svojim autom? Pustite nas da se pobrinemo za njega dok vi istražujete! Od osnovnog pranja do punog detailinga, mi smo tu za vas." },
    shortDescription: { en: "Your car, sparkling clean", bs: "Vaš auto, blistavo čist" },
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
    pricingType: "variable",
    price: 20,
    currency: "EUR",
    tiers: [
      { id: "basic", name: { en: "Basic Wash", bs: "Osnovno Pranje" }, price: 20 },
      { id: "premium", name: { en: "Premium Wash + Interior", bs: "Premium Pranje + Unutrašnjost" }, price: 40 },
      { id: "full", name: { en: "Full Detailing", bs: "Puni Detailing" }, price: 80 },
    ],
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // PHOTOGRAPHY
  {
    id: "26",
    tenantId: "sunny-sarajevo",
    categoryId: "photography",
    name: { en: "Professional Photo Session", bs: "Profesionalna Foto Sesija" },
    description: { en: "Capture your Sarajevo memories with a professional photographer! Perfect for couples, families, or solo travelers. Includes edited photos delivered digitally.", bs: "Zabilježite svoje sarajevske uspomene s profesionalnim fotografom! Savršeno za parove, porodice ili solo putnike. Uključuje uređene fotografije dostavljene digitalno." },
    shortDescription: { en: "Professional vacation photos", bs: "Profesionalne fotografije s odmora" },
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    pricingType: "variable",
    price: 80,
    currency: "EUR",
    tiers: [
      { id: "mini", name: { en: "Mini Session (30 min)", bs: "Mini Sesija (30 min)" }, price: 80, description: { en: "15 edited photos", bs: "15 uređenih fotografija" } },
      { id: "standard", name: { en: "Standard (1 hour)", bs: "Standard (1 sat)" }, price: 150, description: { en: "30 edited photos", bs: "30 uređenih fotografija" } },
      { id: "full", name: { en: "Full Day Coverage", bs: "Cjelodnevno Snimanje" }, price: 350, description: { en: "100+ edited photos", bs: "100+ uređenih fotografija" } },
    ],
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Services for Mountain View Lodge
const mountainViewServices: Service[] = [
  {
    id: "mv-1",
    tenantId: "mountain-view",
    categoryId: "free",
    name: { en: "Welcome Basket", bs: "Korpa Dobrodošlice" },
    description: { en: "Local honey, homemade jam, fresh bread, and mountain tea waiting for you!", bs: "Domaći med, domaći džem, svježi kruh i planinski čaj čekaju vas!" },
    shortDescription: { en: "Local treats", bs: "Lokalni specijaliteti" },
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mv-2",
    tenantId: "mountain-view",
    categoryId: "tours",
    name: { en: "Guided Mountain Hike", bs: "Vođena Planinska Šetnja" },
    description: { en: "Explore the beautiful Bjelašnica mountain with our experienced guide. Various difficulty levels available.", bs: "Istražite prekrasnu planinu Bjelašnicu s našim iskusnim vodičem. Dostupni različiti nivoi težine." },
    shortDescription: { en: "Mountain adventure", bs: "Planinska avantura" },
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    pricingType: "variable",
    price: 30,
    currency: "EUR",
    tiers: [
      { id: "easy", name: { en: "Easy Trail (2h)", bs: "Lagana Staza (2h)" }, price: 30 },
      { id: "medium", name: { en: "Medium Trail (4h)", bs: "Srednja Staza (4h)" }, price: 50 },
      { id: "challenging", name: { en: "Challenging (Full Day)", bs: "Zahtjevna (Cijeli Dan)" }, price: 80 },
    ],
    active: true,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mv-3",
    tenantId: "mountain-view",
    categoryId: "tours",
    name: { en: "Ski Equipment Rental", bs: "Iznajmljivanje Ski Opreme" },
    description: { en: "Hit the slopes with quality ski equipment! We offer skis, snowboards, boots, and all accessories.", bs: "Osvojite staze s kvalitetnom ski opremom! Nudimo skije, snowboard, cipele i svu opremu." },
    shortDescription: { en: "Ski & snowboard gear", bs: "Ski i snowboard oprema" },
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
    pricingType: "variable",
    price: 25,
    currency: "EUR",
    tiers: [
      { id: "basic", name: { en: "Basic Set", bs: "Osnovni Set" }, price: 25 },
      { id: "premium", name: { en: "Premium Set", bs: "Premium Set" }, price: 45 },
    ],
    active: true,
    featured: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mv-4",
    tenantId: "mountain-view",
    categoryId: "food",
    name: { en: "Traditional Mountain Dinner", bs: "Tradicionalna Planinska Večera" },
    description: { en: "Experience authentic Bosnian mountain cuisine! Lamb under the bell, fresh trout, or vegetarian options.", bs: "Doživite autentičnu bosansku planinsku kuhinju! Janjetina ispod sača, svježa pastrmka ili vegetarijanske opcije." },
    shortDescription: { en: "Authentic local cuisine", bs: "Autentična lokalna kuhinja" },
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    pricingType: "fixed",
    price: 35,
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mv-5",
    tenantId: "mountain-view",
    categoryId: "transport",
    name: { en: "Ski Shuttle", bs: "Ski Shuttle" },
    description: { en: "Daily shuttle to Bjelašnica ski resort. Morning pickup and afternoon return.", bs: "Dnevni shuttle do ski centra Bjelašnica. Jutarnji odvoz i popodnevni povratak." },
    shortDescription: { en: "To the slopes & back", bs: "Do staza i nazad" },
    image: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=800&q=80",
    pricingType: "fixed",
    price: 15,
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Services for Dobrinja Apartments (copy of Sunny Sarajevo with different tenant ID)
const dobrinjaServices: Service[] = sunnySarajevoServices.map(service => ({
  ...service,
  id: `dobrinja-${service.id}`,
  tenantId: "dobrinja-apartments",
}));

// All services combined
const allServices = [...sunnySarajevoServices, ...mountainViewServices, ...dobrinjaServices];

// Tenants
const tenants: Record<string, Tenant> = {
  "sunny-sarajevo": {
    id: "sunny-sarajevo",
    slug: "sunny-sarajevo",
    name: "Sunny Sarajevo Apartment",
    branding: {
      primaryColor: "#f96d4a",
      accentColor: "#05c7ae",
    },
    contact: { 
      email: "host@sunnysarajevo.com",
      phone: "+387 61 123 456",
      whatsapp: "+387 61 123 456",
    },
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "mountain-view": {
    id: "mountain-view",
    slug: "mountain-view",
    name: "Mountain View Lodge",
    branding: {
      primaryColor: "#2d5a27",
      accentColor: "#8b4513",
    },
    contact: { 
      email: "info@mountainviewlodge.ba",
      phone: "+387 62 987 654",
    },
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "dobrinja-apartments": {
    id: "dobrinja-apartments",
    slug: "dobrinja-apartments",
    name: "Dobrinja Apartments",
    branding: {
      primaryColor: "#1e40af",
      accentColor: "#0891b2",
      hideLogo: true, // Hide StayPlus branding completely
    },
    contact: { 
      email: "info@dobrinja-apartments.ba",
      phone: "+387 61 555 777",
      whatsapp: "+387 61 555 777",
    },
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export default function GuestPortalPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const t = useTranslations("guest");
  const slug = params.slug as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [guestName, setGuestName] = useState<string>("");
  const [showNameModal, setShowNameModal] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      // Get tenant by slug
      const currentTenant = tenants[slug];
      
      if (currentTenant) {
        setTenant(currentTenant);
        // Filter services for this tenant
        const tenantServices = allServices.filter(s => s.tenantId === currentTenant.id);
        setServices(tenantServices);
        
        // Get unique categories that have services
        const usedCategoryIds = [...new Set(tenantServices.map(s => s.categoryId))];
        const usedCategories = mockCategories.filter(c => usedCategoryIds.includes(c.id));
        setCategories(usedCategories);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [slug]);

  // Check for saved guest name
  useEffect(() => {
    const savedName = localStorage.getItem(`guestName_${slug}`);
    if (savedName) {
      setGuestName(savedName);
      setShowNameModal(false);
    }
  }, [slug]);

  // Filter services by category
  const filteredServices = useMemo(() => {
    if (!selectedCategory) return services;
    return services.filter((s) => s.categoryId === selectedCategory);
  }, [services, selectedCategory]);

  // Get category info for a service
  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      icon: category?.icon || "sparkles",
      color: categoryId,
    };
  };

  // Handle guest name submission
  const handleNameSubmit = (name: string) => {
    setGuestName(name);
    localStorage.setItem(`guestName_${slug}`, name);
    setShowNameModal(false);
  };

  // Handle service request submission
  const handleRequestSubmit = async (data: GuestRequestForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Request submitted:", { ...data, service: selectedService });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Apartment Not Found
          </h1>
          <p className="text-foreground/60 mb-6">
            The apartment you&apos;re looking for doesn&apos;t exist or is no longer available.
          </p>
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Guest Name Modal */}
      <GuestNameModal
        isOpen={showNameModal}
        onSubmit={handleNameSubmit}
        tenantName={tenant.name}
      />

      {/* Header */}
      <GuestHeader tenant={tenant} guestName={guestName} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t("browseServices")}
          </h1>
          <p className="text-foreground/60">{t("selectCategory")}</p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 -mx-4 px-4"
        >
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            locale={locale}
          />
        </motion.div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service, index) => {
              const categoryInfo = getCategoryInfo(service.categoryId);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <ServiceCard
                    service={service}
                    categoryIcon={categoryInfo.icon}
                    categoryColor={categoryInfo.color}
                    locale={locale}
                    onClick={() => {
                      setSelectedService(service);
                      setShowServiceModal(true);
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-foreground/60">{t("noServices")}</p>
          </div>
        )}

        {/* Powered by */}
        {tenant.branding?.hideLogo !== true && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-foreground/40 flex items-center justify-center gap-2">
              {t("poweredBy")}
              <Link href="/" className="flex items-center gap-1 text-foreground/60 hover:text-primary-600 transition-colors">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">StayPlus</span>
              </Link>
            </p>
          </motion.div>
        )}
      </main>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false);
          setSelectedService(null);
        }}
        service={selectedService}
        locale={locale}
        onSubmit={handleRequestSubmit}
        guestName={guestName}
      />
    </div>
  );
}
