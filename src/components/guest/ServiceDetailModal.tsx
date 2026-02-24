"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Calendar, Clock, Mail, Phone } from "lucide-react";
import { Button, Input, Textarea, Select } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getLocalizedText, getPricingDisplay } from "@/lib/utils";
import type { Service, Locale, GuestRequestForm } from "@/types";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  locale: Locale;
  onSubmit: (data: GuestRequestForm) => Promise<void>;
  guestName: string;
}

const ServiceDetailModal = ({
  isOpen,
  onClose,
  service,
  locale,
  onSubmit,
  guestName,
}: ServiceDetailModalProps) => {
  const t = useTranslations("guest");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<GuestRequestForm>({
    guestName,
    selectedTier: "",
    quantity: 1,
    date: "",
    time: "",
    notes: "",
    guestEmail: "",
    guestPhone: "",
  });

  if (!service) return null;

  const name = getLocalizedText(service.name, locale);
  const description = getLocalizedText(service.description, locale);
  const priceDisplay = getPricingDisplay(
    service.pricingType,
    service.price,
    service.currency,
    locale
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      guestName,
      selectedTier: "",
      quantity: 1,
      date: "",
      time: "",
      notes: "",
      guestEmail: "",
      guestPhone: "",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
            >
              {isSuccess ? (
                // Success state
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {t("requestSubmitted")}
                  </h3>
                  <p className="text-foreground/60 mb-8">
                    {t("requestConfirmation")}
                  </p>
                  <Button onClick={handleClose} className="w-full">
                    {t("backToServices")}
                  </Button>
                </div>
              ) : (
                // Form state
                <>
                  {/* Header */}
                  <div className="relative p-6 pb-4 border-b border-surface-200">
                    <button
                      onClick={handleClose}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-foreground/60" />
                    </button>
                    <h2 className="text-xl font-bold text-foreground pr-8">
                      {name}
                    </h2>
                    <p className="text-foreground/60 text-sm mt-1 line-clamp-2">
                      {description}
                    </p>
                    <div className="mt-3">
                      <span
                        className={cn(
                          "inline-block text-sm font-semibold px-3 py-1 rounded-full",
                          service.pricingType === "free"
                            ? "bg-green-100 text-green-700"
                            : "bg-primary-100 text-primary-700"
                        )}
                      >
                        {priceDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                    {/* Tiers selection */}
                    {service.tiers && service.tiers.length > 0 && (
                      <Select
                        label={t("selectOption")}
                        options={service.tiers.map((tier) => ({
                          value: tier.id,
                          label: `${getLocalizedText(tier.name, locale)}${
                            tier.price ? ` - €${tier.price}` : ""
                          }`,
                        }))}
                        value={formData.selectedTier}
                        onChange={(e) =>
                          setFormData({ ...formData, selectedTier: e.target.value })
                        }
                        placeholder={t("selectOption")}
                      />
                    )}

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        label={t("preferredDate")}
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        leftIcon={<Calendar className="w-4 h-4" />}
                      />
                      <Input
                        type="time"
                        label={t("preferredTime")}
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        leftIcon={<Clock className="w-4 h-4" />}
                      />
                    </div>

                    {/* Contact info */}
                    <Input
                      type="email"
                      label={t("email")}
                      value={formData.guestEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, guestEmail: e.target.value })
                      }
                      leftIcon={<Mail className="w-4 h-4" />}
                      placeholder="your@email.com"
                    />

                    <Input
                      type="tel"
                      label={t("phone")}
                      value={formData.guestPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, guestPhone: e.target.value })
                      }
                      leftIcon={<Phone className="w-4 h-4" />}
                      placeholder="+387 61 123 456"
                    />

                    {/* Notes */}
                    <Textarea
                      label={t("additionalNotes")}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder={t("notesPlaceholder")}
                      rows={3}
                    />

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      isLoading={isSubmitting}
                    >
                      {t("submitRequest")}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export { ServiceDetailModal };
