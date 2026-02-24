"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Palette, Globe, Image as ImageIcon, MapPin } from "lucide-react";
import { Button, Input, Textarea, Card, ImageUpload } from "@/components/ui";
import { slugify } from "@/lib/utils";
import type { Tenant } from "@/types";

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: Tenant | null;
  onSubmit: (data: Partial<Tenant>) => Promise<void>;
}

const TenantForm = ({ isOpen, onClose, tenant, onSubmit }: TenantFormProps) => {
  const t = useTranslations("admin");
  const isEditing = !!tenant;

  const [formData, setFormData] = useState({
    name: tenant?.name || "",
    slug: tenant?.slug || "",
    descriptionEn: tenant?.description?.en || "",
    descriptionBs: tenant?.description?.bs || "",
    email: tenant?.contact?.email || "",
    phone: tenant?.contact?.phone || "",
    whatsapp: tenant?.contact?.whatsapp || "",
    address: tenant?.contact?.address || "",
    logo: tenant?.branding?.logo || "",
    heroImage: tenant?.branding?.heroImage || "",
    primaryColor: tenant?.branding?.primaryColor || "#f96d4a",
    accentColor: tenant?.branding?.accentColor || "#05c7ae",
    hideLogo: tenant?.branding?.hideLogo || false,
    customDomain: tenant?.branding?.customDomain || "",
    active: tenant?.active ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when tenant changes
  useEffect(() => {
    setFormData({
      name: tenant?.name || "",
      slug: tenant?.slug || "",
      descriptionEn: tenant?.description?.en || "",
      descriptionBs: tenant?.description?.bs || "",
      email: tenant?.contact?.email || "",
      phone: tenant?.contact?.phone || "",
      whatsapp: tenant?.contact?.whatsapp || "",
      address: tenant?.contact?.address || "",
      logo: tenant?.branding?.logo || "",
      heroImage: tenant?.branding?.heroImage || "",
      primaryColor: tenant?.branding?.primaryColor || "#f96d4a",
      accentColor: tenant?.branding?.accentColor || "#05c7ae",
      hideLogo: tenant?.branding?.hideLogo || false,
      customDomain: tenant?.branding?.customDomain || "",
      active: tenant?.active ?? true,
    });
  }, [tenant]);

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: isEditing ? formData.slug : slugify(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: formData.name,
        slug: formData.slug,
        description: (formData.descriptionEn || formData.descriptionBs) ? {
          en: formData.descriptionEn,
          bs: formData.descriptionBs,
        } : undefined,
        contact: {
          email: formData.email,
          phone: formData.phone || undefined,
          whatsapp: formData.whatsapp || undefined,
          address: formData.address || undefined,
        },
        branding: {
          logo: formData.logo || undefined,
          heroImage: formData.heroImage || undefined,
          primaryColor: formData.primaryColor || undefined,
          accentColor: formData.accentColor || undefined,
          hideLogo: formData.hideLogo,
          customDomain: formData.customDomain || undefined,
        },
        active: formData.active,
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
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    {isEditing ? t("editTenant") : t("addTenant")}
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
                {/* Basic Info */}
                <Card variant="outline" padding="md">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-foreground">
                      Basic Information
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label={t("tenantName")}
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                    <Input
                      label={t("tenantSlug")}
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      hint="Used in URL: /apartment/your-slug"
                      required
                    />
                    <div className="sm:col-span-2">
                      <Textarea
                        label="Description (English)"
                        value={formData.descriptionEn}
                        onChange={(e) =>
                          setFormData({ ...formData, descriptionEn: e.target.value })
                        }
                        placeholder="Welcome message for your guests..."
                        rows={2}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Textarea
                        label="Description (Bosnian)"
                        value={formData.descriptionBs}
                        onChange={(e) =>
                          setFormData({ ...formData, descriptionBs: e.target.value })
                        }
                        placeholder="Poruka dobrodošlice za vaše goste..."
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>

                {/* Contact Info */}
                <Card variant="outline" padding="md">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-foreground">
                      Contact Information
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label={t("tenantEmail")}
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                    <Input
                      label={t("tenantPhone")}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    <Input
                      label={t("tenantWhatsApp")}
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      placeholder="+387 61 123 456"
                    />
                    <Input
                      label="Address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Street, City, ZIP"
                    />
                  </div>
                </Card>

                {/* Hero Image */}
                <Card variant="outline" padding="md">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-foreground">
                      Hero Banner Image
                    </h3>
                  </div>
                  <ImageUpload
                    value={formData.heroImage}
                    onChange={(value) => setFormData({ ...formData, heroImage: value })}
                    hint="Recommended: 1600x600px or larger. Use a photo of your apartment or scenic view."
                    previewHeight="h-32"
                    previewOverlay={
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-3 text-white text-sm font-medium">
                          {formData.name || "Tenant Name"}
                        </div>
                      </>
                    }
                  />
                </Card>

                {/* Branding */}
                <Card variant="outline" padding="md">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-foreground">
                      {t("branding")}
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label={t("logo")}
                      value={formData.logo}
                      onChange={(e) =>
                        setFormData({ ...formData, logo: e.target.value })
                      }
                      placeholder="https://..."
                      hint="Your logo image URL"
                    />
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("primaryColor")}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.primaryColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                primaryColor: e.target.value,
                              })
                            }
                            className="w-10 h-10 rounded-lg cursor-pointer border border-surface-200"
                          />
                          <Input
                            value={formData.primaryColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                primaryColor: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("accentColor")}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.accentColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accentColor: e.target.value,
                              })
                            }
                            className="w-10 h-10 rounded-lg cursor-pointer border border-surface-200"
                          />
                          <Input
                            value={formData.accentColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accentColor: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* Color Preview */}
                    <div className="sm:col-span-2">
                      <div 
                        className="h-3 rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${formData.primaryColor}, ${formData.accentColor})`,
                        }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hideLogo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hideLogo: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <span className="text-foreground">{t("hideLogo")}</span>
                          <p className="text-xs text-foreground/50">
                            Enable white-label mode - removes all StayPlus branding
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </Card>

                {/* Custom Domain */}
                <Card variant="outline" padding="md">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-foreground">
                      {t("customDomain")}
                    </h3>
                  </div>
                  <Input
                    value={formData.customDomain}
                    onChange={(e) =>
                      setFormData({ ...formData, customDomain: e.target.value })
                    }
                    placeholder="services.yourdomain.com"
                    hint="Optional: Point your domain to this tenant"
                  />
                </Card>

                {/* Active status */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-foreground font-medium">
                    {t("activeTenant")}
                  </span>
                </label>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                    {isEditing ? "Save Changes" : "Create Tenant"}
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

export { TenantForm };
