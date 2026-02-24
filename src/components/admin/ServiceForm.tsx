"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { Button, Input, Textarea, Select, Card } from "@/components/ui";
import type { Service, ServiceCategory, Tenant, PricingType, ServiceTier } from "@/types";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  categories: ServiceCategory[];
  tenants: Tenant[];
  onSubmit: (data: Partial<Service>) => Promise<void>;
}

const pricingTypes: { value: PricingType; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "fixed", label: "Fixed Price" },
  { value: "variable", label: "Variable (From price)" },
  { value: "quote", label: "Request Quote" },
];

const getInitialFormData = (service?: Service | null) => ({
  tenantId: service?.tenantId || "",
  categoryId: service?.categoryId || "",
  nameEn: service?.name?.en || "",
  nameBs: service?.name?.bs || "",
  descriptionEn: service?.description?.en || "",
  descriptionBs: service?.description?.bs || "",
  shortDescriptionEn: service?.shortDescription?.en || "",
  shortDescriptionBs: service?.shortDescription?.bs || "",
  image: service?.image || "",
  pricingType: service?.pricingType || ("fixed" as PricingType),
  price: service?.price?.toString() || "",
  currency: service?.currency || "EUR",
  tiers: service?.tiers || ([] as ServiceTier[]),
  active: service?.active ?? true,
  featured: service?.featured || false,
  order: service?.order?.toString() || "0",
});

const ServiceForm = ({
  isOpen,
  onClose,
  service,
  categories,
  tenants,
  onSubmit,
}: ServiceFormProps) => {
  const t = useTranslations("admin");
  const isEditing = !!service;

  const [formData, setFormData] = useState(getInitialFormData(service));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or service changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(service));
    }
  }, [isOpen, service]);

  const addTier = () => {
    setFormData({
      ...formData,
      tiers: [
        ...formData.tiers,
        {
          id: `tier-${Date.now()}`,
          name: { en: "", bs: "" },
          price: undefined,
        },
      ],
    });
  };

  const removeTier = (index: number) => {
    setFormData({
      ...formData,
      tiers: formData.tiers.filter((_, i) => i !== index),
    });
  };

  const updateTier = (index: number, field: string, value: string) => {
    const newTiers = [...formData.tiers];
    if (field === "nameEn") {
      newTiers[index] = {
        ...newTiers[index],
        name: { ...newTiers[index].name, en: value },
      };
    } else if (field === "nameBs") {
      newTiers[index] = {
        ...newTiers[index],
        name: { ...newTiers[index].name, bs: value },
      };
    } else if (field === "price") {
      newTiers[index] = {
        ...newTiers[index],
        price: value ? parseFloat(value) : undefined,
      };
    }
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        tenantId: formData.tenantId,
        categoryId: formData.categoryId,
        name: { en: formData.nameEn, bs: formData.nameBs },
        description: { en: formData.descriptionEn, bs: formData.descriptionBs },
        shortDescription: formData.shortDescriptionEn
          ? { en: formData.shortDescriptionEn, bs: formData.shortDescriptionBs }
          : undefined,
        image: formData.image || undefined,
        pricingType: formData.pricingType,
        price: formData.price ? parseFloat(formData.price) : undefined,
        currency: formData.currency,
        tiers: formData.tiers.length > 0 ? formData.tiers : undefined,
        active: formData.active,
        featured: formData.featured,
        order: parseInt(formData.order) || 0,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-8 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    {isEditing ? t("editService") : t("addService")}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Tenant & Category */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label={t("tenant")}
                    options={[
                      { value: "", label: "Select tenant" },
                      ...tenants.map((t) => ({
                        value: t.id,
                        label: t.name,
                      })),
                    ]}
                    value={formData.tenantId}
                    onChange={(e) =>
                      setFormData({ ...formData, tenantId: e.target.value })
                    }
                    required
                  />
                  <Select
                    label={t("serviceCategory")}
                    options={[
                      { value: "", label: "Select category" },
                      ...categories.map((c) => ({
                        value: c.id,
                        label: c.name.en,
                      })),
                    ]}
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Name (i18n) */}
                <Card variant="outline" padding="md">
                  <h3 className="font-semibold text-foreground mb-4">
                    {t("serviceName")}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="English"
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                      }
                      placeholder="e.g., Airport Transfer"
                      required
                    />
                    <Input
                      label="Bosanski"
                      value={formData.nameBs}
                      onChange={(e) =>
                        setFormData({ ...formData, nameBs: e.target.value })
                      }
                      placeholder="npr. Aerodromski Transfer"
                      required
                    />
                  </div>
                </Card>

                {/* Description (i18n) */}
                <Card variant="outline" padding="md">
                  <h3 className="font-semibold text-foreground mb-4">
                    {t("serviceDescription")}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Textarea
                      label="English"
                      value={formData.descriptionEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionEn: e.target.value,
                        })
                      }
                      placeholder="Describe the service..."
                      rows={3}
                      required
                    />
                    <Textarea
                      label="Bosanski"
                      value={formData.descriptionBs}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionBs: e.target.value,
                        })
                      }
                      placeholder="Opišite uslugu..."
                      rows={3}
                      required
                    />
                  </div>
                </Card>

                {/* Pricing */}
                <Card variant="outline" padding="md">
                  <h3 className="font-semibold text-foreground mb-4">
                    {t("pricingType")}
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Select
                      label={t("pricingType")}
                      options={pricingTypes}
                      value={formData.pricingType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricingType: e.target.value as PricingType,
                        })
                      }
                    />
                    {formData.pricingType !== "free" &&
                      formData.pricingType !== "quote" && (
                        <>
                          <Input
                            label={t("price")}
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({ ...formData, price: e.target.value })
                            }
                            placeholder="0.00"
                          />
                          <Input
                            label={t("currency")}
                            value={formData.currency}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                currency: e.target.value,
                              })
                            }
                          />
                        </>
                      )}
                  </div>
                </Card>

                {/* Tiers */}
                {(formData.pricingType === "variable" ||
                  formData.pricingType === "fixed") && (
                  <Card variant="outline" padding="md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        Service Tiers (Optional)
                      </h3>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addTier}
                        leftIcon={<Plus className="w-4 h-4" />}
                      >
                        Add Tier
                      </Button>
                    </div>
                    {formData.tiers.length > 0 ? (
                      <div className="space-y-4">
                        {formData.tiers.map((tier, index) => (
                          <div
                            key={tier.id}
                            className="flex items-start gap-4 p-4 rounded-xl bg-surface-50"
                          >
                            <div className="flex-1 grid sm:grid-cols-3 gap-4">
                              <Input
                                placeholder="Name (EN)"
                                value={tier.name.en}
                                onChange={(e) =>
                                  updateTier(index, "nameEn", e.target.value)
                                }
                              />
                              <Input
                                placeholder="Name (BS)"
                                value={tier.name.bs}
                                onChange={(e) =>
                                  updateTier(index, "nameBs", e.target.value)
                                }
                              />
                              <Input
                                placeholder="Price"
                                type="number"
                                step="0.01"
                                value={tier.price?.toString() || ""}
                                onChange={(e) =>
                                  updateTier(index, "price", e.target.value)
                                }
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTier(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground/60 text-sm">
                        No tiers added. Click &quot;Add Tier&quot; to create options like
                        Standard, Premium, VIP.
                      </p>
                    )}
                  </Card>
                )}

                {/* Image & Options */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Image URL"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://..."
                  />
                  <Input
                    label="Display Order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-foreground">Active</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-foreground">{t("featured")}</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                    {isEditing ? "Save Changes" : "Create Service"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export { ServiceForm };
