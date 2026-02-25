"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  Calendar,
  Phone,
  MessageSquare,
  Check,
  Sparkles,
} from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { getLocalizedText, getPricingDisplay } from "@/lib/utils";
import { useServicesStore, useTenantsStore } from "@/hooks";
import type { Service, ServiceTier, Locale } from "@/types";

export default function ServiceRequestPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const t = useTranslations("guest");

  const slug = params.slug as string;
  const serviceId = params.serviceId as string;

  const { getTenantBySlug, isLoading: tenantsLoading } = useTenantsStore();
  const { getServiceById, isLoading: servicesLoading } = useServicesStore();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [tenant, setTenant] = useState<ReturnType<typeof getTenantBySlug>>(undefined);
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    date: "",
    time: "",
    notes: "",
  });

  const primaryColor = tenant?.branding?.primaryColor || "#f96d4a";
  
  // Show loading until stores are ready AND we've processed the data
  const isLoading = tenantsLoading || servicesLoading || !dataLoaded;

  // Load guest name from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem(`stayplus.guest.${slug}`);
      if (savedName) {
        setFormData((prev) => ({ ...prev, guestName: savedName }));
      }
    }
  }, [slug]);

  // Load service and tenant once stores are ready
  useEffect(() => {
    if (tenantsLoading || servicesLoading) {
      return;
    }
    
    const foundTenant = getTenantBySlug(slug);
    setTenant(foundTenant);
    
    const foundService = getServiceById(serviceId);
    if (foundService) {
      setService(foundService);
      // Auto-select first tier if available
      if (foundService.tiers && foundService.tiers.length > 0) {
        setSelectedTier(foundService.tiers[0]);
      }
    }
    
    setDataLoaded(true);
  }, [slug, serviceId, getTenantBySlug, getServiceById, tenantsLoading, servicesLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, this would submit to an API
    console.log("Submitting request:", {
      serviceId: service.id,
      serviceName: service.name,
      tenantId: service.tenantId,
      selectedTier: selectedTier?.id,
      tierName: selectedTier?.name,
      price: selectedTier?.price || service.price,
      ...formData,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const currentPrice = selectedTier?.price ?? service?.price;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        {/* Skeleton Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-surface-200">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="h-5 w-32 bg-surface-200 rounded animate-pulse" />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
          {/* Skeleton Image */}
          <div className="h-48 sm:h-64 rounded-2xl bg-surface-200 animate-pulse mb-6" />
          
          {/* Skeleton Title & Description */}
          <div className="mb-8 space-y-3">
            <div className="h-8 w-3/4 bg-surface-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-surface-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-surface-200 rounded animate-pulse" />
          </div>

          {/* Skeleton Tier Cards */}
          <div className="space-y-4 mb-6">
            <div className="h-6 w-40 bg-surface-200 rounded animate-pulse" />
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border-2 border-surface-200 p-5">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-surface-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-surface-200 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-16 bg-surface-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton Form Fields */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-surface-200">
              <div className="h-6 w-48 bg-surface-200 rounded animate-pulse mb-4" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="h-12 bg-surface-200 rounded-xl animate-pulse" />
                <div className="h-12 bg-surface-200 rounded-xl animate-pulse" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-surface-200">
              <div className="h-6 w-36 bg-surface-200 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                <div className="h-12 bg-surface-200 rounded-xl animate-pulse" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="h-12 bg-surface-200 rounded-xl animate-pulse" />
                  <div className="h-12 bg-surface-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Skeleton Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 p-4 z-50">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-surface-200 rounded animate-pulse" />
              <div className="h-7 w-16 bg-surface-200 rounded animate-pulse" />
            </div>
            <div className="h-12 w-36 bg-surface-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!service || !tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Service not found
        </h1>
        <Link href={`/apartment/${slug}`}>
          <Button variant="secondary">Back to Services</Button>
        </Link>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface-50">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-surface-200">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Link
              href={`/apartment/${slug}`}
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{tenant.name}</span>
            </Link>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Check className="w-10 h-10" style={{ color: primaryColor }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground mb-3"
          >
            {t("requestSubmitted")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-foreground/60 mb-8"
          >
            {t("requestConfirmation")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href={`/apartment/${slug}`}>
              <Button>
                {t("backToServices")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-surface-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href={`/apartment/${slug}`}
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{tenant.name}</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
        {/* Service Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Service Image */}
          {service.image && (
            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-6">
              <Image
                src={service.image}
                alt={getLocalizedText(service.name, locale)}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {getLocalizedText(service.name, locale)}
                </h1>
              </div>
            </div>
          )}

          {!service.image && (
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              {getLocalizedText(service.name, locale)}
            </h1>
          )}

          <p className="text-foreground/70 text-lg">
            {getLocalizedText(service.description, locale)}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tier Selection */}
          {service.tiers && service.tiers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                {t("selectOption")}
              </h2>
              <div className="grid gap-4">
                {service.tiers.map((tier, index) => {
                  const isSelected = selectedTier?.id === tier.id;
                  return (
                    <motion.button
                      key={tier.id}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => setSelectedTier(tier)}
                      className={`relative w-full text-left rounded-2xl border-2 transition-all overflow-hidden ${
                        isSelected
                          ? "border-primary-500 shadow-lg"
                          : "border-surface-200 hover:border-surface-300"
                      }`}
                      style={
                        isSelected
                          ? { borderColor: primaryColor }
                          : undefined
                      }
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Tier Image */}
                        {tier.image && (
                          <div className="relative w-full sm:w-40 h-32 sm:h-auto flex-shrink-0">
                            <Image
                              src={tier.image}
                              alt={getLocalizedText(tier.name, locale)}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Tier Content */}
                        <div className="flex-1 p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground text-lg">
                                  {getLocalizedText(tier.name, locale)}
                                </h3>
                                {index === 1 && (
                                  <span
                                    className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                                    style={{ backgroundColor: primaryColor }}
                                  >
                                    Popular
                                  </span>
                                )}
                              </div>
                              {tier.description && (
                                <p className="text-foreground/60 text-sm">
                                  {getLocalizedText(tier.description, locale)}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center justify-end gap-2">
                                {isSelected && (
                                  <span
                                    className="w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: primaryColor }}
                                    aria-label="Selected"
                                    title="Selected"
                                  >
                                    <Check className="w-4 h-4 text-white" />
                                  </span>
                                )}
                                <p
                                  className="text-xl font-bold"
                                  style={{ color: primaryColor }}
                                >
                                  {tier.price !== undefined ? `€${tier.price}` : t("free")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* No tiers - show base price */}
          {(!service.tiers || service.tiers.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="flex items-center justify-between">
                <span className="text-foreground/70">{t("price")}</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {getPricingDisplay(
                    service.pricingType,
                    service.price,
                    service.currency,
                    locale
                  )}
                </span>
              </Card>
            </motion.div>
          )}

          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                {t("preferredDateTime")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    type="date"
                    label={t("date")}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="relative">
                  <Input
                    type="time"
                    label={t("time")}
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                {t("contactInfo")}
              </h2>
              <div className="space-y-4">
                <Input
                  label={t("yourName")}
                  value={formData.guestName}
                  onChange={(e) =>
                    setFormData({ ...formData, guestName: e.target.value })
                  }
                  placeholder={t("enterYourName")}
                  required
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    type="email"
                    label={`${t("email")} (${t("optional")})`}
                    value={formData.guestEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, guestEmail: e.target.value })
                    }
                    placeholder="your@email.com"
                  />
                  <Input
                    type="tel"
                    label={`${t("phone")} (${t("optional")})`}
                    value={formData.guestPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, guestPhone: e.target.value })
                    }
                    placeholder="+387 61 123 456"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare
                  className="w-5 h-5"
                  style={{ color: primaryColor }}
                />
                {t("additionalNotes")}
              </h2>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder={t("notesPlaceholder")}
                rows={3}
              />
            </Card>
          </motion.div>
        </form>
      </main>

      {/* Fixed Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 p-4 z-50"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/60">
              {selectedTier
                ? getLocalizedText(selectedTier.name, locale)
                : t("total")}
            </p>
            <p className="text-2xl font-bold" style={{ color: primaryColor }}>
              {currentPrice !== undefined
                ? `€${currentPrice}`
                : getPricingDisplay(
                    service.pricingType,
                    service.price,
                    service.currency,
                    locale
                  )}
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!formData.guestName || !formData.date || !formData.time}
            className="px-8"
            style={{ backgroundColor: primaryColor }}
          >
            {t("submitRequest")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
