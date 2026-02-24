"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { Button, Input, Textarea, Select, Card, Spinner, ImageUpload } from "@/components/ui";
import { categories as allCategories } from "@/data/categories";
import type { Service, ServiceCategory, PricingType, ServiceTier } from "@/types";
import { useTenantsStore } from "@/hooks";
import { createService } from "@/lib/firebase";

const pricingTypes: { value: PricingType; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "fixed", label: "Fixed Price" },
  { value: "variable", label: "Variable (From price)" },
  { value: "quote", label: "Request Quote" },
];

export default function NewServicePage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const { tenants } = useTenantsStore();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tenantId: "",
    categoryId: "",
    nameEn: "",
    nameBs: "",
    descriptionEn: "",
    descriptionBs: "",
    shortDescriptionEn: "",
    shortDescriptionBs: "",
    image: "",
    pricingType: "fixed" as PricingType,
    price: "",
    currency: "EUR",
    tiers: [] as ServiceTier[],
    active: true,
    featured: false,
    order: "0",
  });

  useEffect(() => {
    setTimeout(() => {
      setCategories(allCategories);
      setIsLoading(false);
    }, 200);
  }, []);

  const addTier = () => {
    setFormData({
      ...formData,
      tiers: [
        ...formData.tiers,
        {
          id: `tier-${Date.now()}`,
          name: { en: "", bs: "" },
          description: { en: "", bs: "" },
          price: undefined,
          image: "",
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
    } else if (field === "descEn") {
      newTiers[index] = {
        ...newTiers[index],
        description: { ...(newTiers[index].description || { en: "", bs: "" }), en: value },
      };
    } else if (field === "descBs") {
      newTiers[index] = {
        ...newTiers[index],
        description: { ...(newTiers[index].description || { en: "", bs: "" }), bs: value },
      };
    } else if (field === "price") {
      newTiers[index] = {
        ...newTiers[index],
        price: value ? parseFloat(value) : undefined,
      };
    } else if (field === "image") {
      newTiers[index] = {
        ...newTiers[index],
        image: value || undefined,
      };
    }
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date();
      
      // Clean up tiers - remove undefined values from each tier
      const cleanedTiers: ServiceTier[] = formData.tiers.map(tier => {
        const cleanTier: ServiceTier = {
          id: tier.id,
          name: { en: tier.name.en || "", bs: tier.name.bs || "" },
        };
        // Only add description if it has content
        if (tier.description?.en || tier.description?.bs) {
          cleanTier.description = { 
            en: tier.description?.en || "", 
            bs: tier.description?.bs || "" 
          };
        }
        // Only add price if defined
        if (tier.price !== undefined && tier.price !== null) {
          cleanTier.price = tier.price;
        }
        // Only add image if it has a value
        if (tier.image) {
          cleanTier.image = tier.image;
        }
        return cleanTier;
      });

      const newService: Service = {
        id: `service-${Date.now()}`,
        tenantId: formData.tenantId,
        categoryId: formData.categoryId,
        name: { en: formData.nameEn, bs: formData.nameBs },
        description: { en: formData.descriptionEn, bs: formData.descriptionBs },
        ...(formData.shortDescriptionEn && {
          shortDescription: { en: formData.shortDescriptionEn, bs: formData.shortDescriptionBs }
        }),
        ...(formData.image && { image: formData.image }),
        pricingType: formData.pricingType,
        ...(formData.price && { price: parseFloat(formData.price) }),
        currency: formData.currency,
        tiers: cleanedTiers, // Always send array (empty or with items)
        active: formData.active,
        featured: formData.featured,
        order: parseInt(formData.order) || 0,
        createdAt: now,
        updatedAt: now,
      };

      await createService(newService);
      router.push("/admin/services");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3"
      >
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="p-2 rounded-lg hover:bg-surface-100 transition-colors mt-1"
          aria-label="Back to services"
        >
          <ChevronLeft className="w-5 h-5 text-foreground/70" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("addService")}
          </h1>
          <p className="text-foreground/60 mt-1">
            Create a new service for guests to request
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Tenant & Category */}
        <Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label={t("tenant")}
              options={tenants.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
              value={formData.tenantId}
              onChange={(e) =>
                setFormData({ ...formData, tenantId: e.target.value })
              }
              placeholder="Select tenant"
              required
            />
            <Select
              label={t("serviceCategory")}
              options={categories.map((c) => ({
                value: c.id,
                label: c.name.en,
              }))}
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              placeholder="Select category"
              required
            />
          </div>
        </Card>

        {/* Name */}
        <Card>
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

        {/* Short Description */}
        <Card>
          <h3 className="font-semibold text-foreground mb-4">
            Short Description (shown in cards)
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="English"
              value={formData.shortDescriptionEn}
              onChange={(e) =>
                setFormData({ ...formData, shortDescriptionEn: e.target.value })
              }
              placeholder="Brief summary..."
            />
            <Input
              label="Bosanski"
              value={formData.shortDescriptionBs}
              onChange={(e) =>
                setFormData({ ...formData, shortDescriptionBs: e.target.value })
              }
              placeholder="Kratak opis..."
            />
          </div>
        </Card>

        {/* Full Description */}
        <Card>
          <h3 className="font-semibold text-foreground mb-4">
            {t("serviceDescription")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Textarea
              label="English"
              value={formData.descriptionEn}
              onChange={(e) =>
                setFormData({ ...formData, descriptionEn: e.target.value })
              }
              placeholder="Full description of the service..."
              rows={4}
              required
            />
            <Textarea
              label="Bosanski"
              value={formData.descriptionBs}
              onChange={(e) =>
                setFormData({ ...formData, descriptionBs: e.target.value })
              }
              placeholder="Puni opis usluge..."
              rows={4}
              required
            />
          </div>
        </Card>

        {/* Pricing */}
        <Card>
          <h3 className="font-semibold text-foreground mb-4">
            {t("pricingType")}
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Select
              label="Type"
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
                      setFormData({ ...formData, currency: e.target.value })
                    }
                  />
                </>
              )}
          </div>
        </Card>

        {/* Tiers */}
        {(formData.pricingType === "variable" ||
          formData.pricingType === "fixed") && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">
                  Service Tiers
                </h3>
                <p className="text-sm text-foreground/60">
                  Optional pricing options like Standard, Premium, VIP
                </p>
              </div>
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
                    className="p-4 rounded-xl bg-surface-50 border border-surface-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground/60">
                        Tier {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTier(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <Input
                        placeholder="Name (English) e.g. Standard"
                        value={tier.name.en}
                        onChange={(e) =>
                          updateTier(index, "nameEn", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Name (Bosanski)"
                        value={tier.name.bs}
                        onChange={(e) =>
                          updateTier(index, "nameBs", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <Input
                        placeholder="Description (English) e.g. Comfortable sedan"
                        value={tier.description?.en || ""}
                        onChange={(e) =>
                          updateTier(index, "descEn", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Description (Bosanski)"
                        value={tier.description?.bs || ""}
                        onChange={(e) =>
                          updateTier(index, "descBs", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={tier.price?.toString() || ""}
                        onChange={(e) =>
                          updateTier(index, "price", e.target.value)
                        }
                      />
                      <div className="sm:col-span-2">
                        <ImageUpload
                          label="Tier image"
                          value={tier.image || ""}
                          onChange={(value) => updateTier(index, "image", value)}
                          hint="Optional: upload a photo or paste a URL"
                          previewHeight="h-24"
                          defaultObjectFit="cover"
                          showFitToggle={false}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/50 text-sm py-4 text-center border-2 border-dashed border-surface-200 rounded-xl">
                No tiers added yet. Add tiers like &quot;Standard&quot;, &quot;Premium&quot;, &quot;Luxury&quot; with different prices and vehicle photos.
              </p>
            )}
          </Card>
        )}

        {/* Image */}
        <Card>
          <h3 className="font-semibold text-foreground mb-4">Service Image</h3>
          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData({ ...formData, image: value })}
            hint="Recommended: 800x600px or larger. Upload will be saved as a data URL for now (we can switch to Firebase Storage later)."
            previewHeight="h-48"
            defaultObjectFit="cover"
          />
        </Card>

        {/* Options */}
        <Card>
          <h3 className="font-semibold text-foreground mb-4">Options</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Display Order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
              hint="Lower numbers appear first"
            />
          </div>
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
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/services")}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Service
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
