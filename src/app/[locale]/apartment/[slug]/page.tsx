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
];

const mockServices: Service[] = [
  {
    id: "1",
    tenantId: "demo",
    categoryId: "free",
    name: { en: "Complimentary Water", bs: "Besplatna Voda" },
    description: { en: "Fresh bottled water available in your apartment", bs: "Svježa flaširana voda dostupna u vašem apartmanu" },
    shortDescription: { en: "Fresh bottled water", bs: "Svježa flaširana voda" },
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    tenantId: "demo",
    categoryId: "free",
    name: { en: "Nespresso Coffee", bs: "Nespresso Kafa" },
    description: { en: "Premium Nespresso coffee capsules for your enjoyment", bs: "Premium Nespresso kapsule za vaše uživanje" },
    shortDescription: { en: "Premium coffee capsules", bs: "Premium kapsule kafe" },
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    tenantId: "demo",
    categoryId: "transport",
    name: { en: "Airport Transfer", bs: "Aerodromski Transfer" },
    description: { en: "Comfortable pickup and dropoff from Sarajevo International Airport", bs: "Udoban prevoz od i do Međunarodnog aerodroma Sarajevo" },
    shortDescription: { en: "Airport pickup & dropoff", bs: "Prevoz od/do aerodroma" },
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
    id: "4",
    tenantId: "demo",
    categoryId: "transport",
    name: { en: "Rent a Car", bs: "Rent-a-Car" },
    description: { en: "Wide selection of vehicles for your travel needs", bs: "Širok izbor vozila za vaše potrebe putovanja" },
    shortDescription: { en: "Vehicle rental service", bs: "Usluga iznajmljivanja vozila" },
    pricingType: "variable",
    price: 35,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard", bs: "Standard" }, price: 35 },
      { id: "premium", name: { en: "Premium", bs: "Premium" }, price: 55 },
    ],
    active: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    tenantId: "demo",
    categoryId: "tours",
    name: { en: "Erma Safari", bs: "Erma Safari" },
    description: { en: "Exciting safari adventure through beautiful Bosnian nature", bs: "Uzbudljiva safari avantura kroz prekrasnu bosansku prirodu" },
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    tenantId: "demo",
    categoryId: "tours",
    name: { en: "Day Trip - Mostar", bs: "Jednodnevni Izlet - Mostar" },
    description: { en: "Visit the historic city of Mostar and its famous Old Bridge", bs: "Posjetite historijski grad Mostar i njegov čuveni Stari most" },
    shortDescription: { en: "Historic Mostar tour", bs: "Tura historijskog Mostara" },
    pricingType: "fixed",
    price: 65,
    currency: "EUR",
    active: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    tenantId: "demo",
    categoryId: "food",
    name: { en: "Breakfast", bs: "Doručak" },
    description: { en: "Delicious breakfast delivered from our partner restaurant", bs: "Ukusan doručak dostavljen iz našeg partnerskog restorana" },
    shortDescription: { en: "Restaurant breakfast delivery", bs: "Dostava doručka iz restorana" },
    pricingType: "fixed",
    price: 15,
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    tenantId: "demo",
    categoryId: "food",
    name: { en: "Grocery Pre-stock", bs: "Nabavka Namirnica" },
    description: { en: "Have your groceries waiting for you when you arrive", bs: "Neka vas namirnice čekaju kada stignete" },
    shortDescription: { en: "Pre-arrival grocery shopping", bs: "Kupovina namirnica prije dolaska" },
    pricingType: "quote",
    currency: "EUR",
    active: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    tenantId: "demo",
    categoryId: "special",
    name: { en: "Romantic Setup", bs: "Romantična Priprema" },
    description: { en: "Rose petals, candles, champagne - make your evening special", bs: "Latice ruža, svijeće, šampanjac - učinite večer posebnom" },
    shortDescription: { en: "Romantic evening setup", bs: "Priprema romantične večeri" },
    pricingType: "variable",
    price: 50,
    currency: "EUR",
    active: true,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    tenantId: "demo",
    categoryId: "convenience",
    name: { en: "Shopping Run", bs: "Kupovina" },
    description: { en: "We'll pick up whatever you need from local stores", bs: "Pokupićemo sve što vam treba iz lokalnih trgovina" },
    shortDescription: { en: "Personal shopping service", bs: "Usluga osobne kupovine" },
    pricingType: "fixed",
    price: 10,
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockTenant: Tenant = {
  id: "demo",
  slug: "sunny-sarajevo",
  name: "Sunny Sarajevo Apartment",
  branding: {},
  contact: { email: "host@example.com" },
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function GuestPortalPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const t = useTranslations("guest");
  
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
      // In production, this would fetch from Firebase
      // const tenant = await getTenantBySlug(params.slug as string);
      // const services = await getServicesByTenant(tenant.id);
      // const categories = await getAllCategories();
      
      // Using mock data for now
      setTenant(mockTenant);
      setServices(mockServices);
      setCategories(mockCategories);
      setIsLoading(false);
    };

    loadData();
  }, [params.slug]);

  // Check for saved guest name
  useEffect(() => {
    const savedName = localStorage.getItem(`guestName_${params.slug}`);
    if (savedName) {
      setGuestName(savedName);
      setShowNameModal(false);
    }
  }, [params.slug]);

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
    localStorage.setItem(`guestName_${params.slug}`, name);
    setShowNameModal(false);
  };

  // Handle service request submission
  const handleRequestSubmit = async (data: GuestRequestForm) => {
    // In production, this would save to Firebase
    // await createRequest({
    //   tenantId: tenant!.id,
    //   serviceId: selectedService!.id,
    //   serviceName: selectedService!.name,
    //   categoryId: selectedService!.categoryId,
    //   guestName: data.guestName || guestName,
    //   guestEmail: data.guestEmail,
    //   guestPhone: data.guestPhone,
    //   status: "pending",
    //   selectedTier: data.selectedTier,
    //   date: data.date ? new Date(data.date) : undefined,
    //   time: data.time,
    //   notes: data.notes,
    //   currency: selectedService!.currency,
    // });
    
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
