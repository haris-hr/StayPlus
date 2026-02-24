"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  GuestNameModal,
  GuestHeader,
  HeroBanner,
  CategoryTabs,
  ServiceCard,
  ServiceDetailModal,
} from "@/components/guest";
import { Spinner } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { categories as allCategories } from "@/data/categories";
import { getTenantBySlug } from "@/data/tenants";
import { getServicesByTenantId } from "@/data/services";
import type { Tenant, Service, ServiceCategory, Locale, GuestRequestForm } from "@/types";

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
      const currentTenant = getTenantBySlug(slug);
      
      if (currentTenant) {
        setTenant(currentTenant);
        // Get services for this tenant from the data layer
        const tenantServices = getServicesByTenantId(currentTenant.id);
        setServices(tenantServices);
        
        // Get unique categories that have services
        const usedCategoryIds = Array.from(new Set(tenantServices.map(s => s.categoryId)));
        const usedCategories = allCategories.filter(c => usedCategoryIds.includes(c.id));
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

      {/* Hero Banner */}
      <HeroBanner 
        tenant={tenant} 
        locale={locale} 
        guestName={guestName}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t("browseServices")}
          </h2>
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
