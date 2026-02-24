"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, ChevronLeft, Globe, Image as ImageIcon, MapPin, Palette } from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { slugify } from "@/lib/utils";
import type { Tenant } from "@/types";
import { useRouter } from "@/i18n/routing";

interface TenantEditorFormProps {
  tenant?: Tenant | null;
  mode: "create" | "edit";
  onSubmit: (data: Partial<Tenant>) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}

export function TenantEditorForm({ tenant, mode, onSubmit, onDelete }: TenantEditorFormProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const isEditing = mode === "edit";

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
  const [isDeleting, setIsDeleting] = useState(false);

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
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name,
        slug: formData.slug,
        description:
          formData.descriptionEn || formData.descriptionBs
            ? { en: formData.descriptionEn, bs: formData.descriptionBs }
            : undefined,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    const ok = confirm("Are you sure you want to delete this tenant?");
    if (!ok) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/tenants")}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            aria-label="Back to tenants"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 text-foreground/70" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {mode === "edit" ? t("editTenant") : t("addTenant")}
            </h1>
            <p className="text-foreground/60 mt-1 text-sm sm:text-base">
              {mode === "edit"
                ? "Update tenant branding, contact info, and portal settings."
                : "Create a new tenant with branding, contact info, and portal settings."}
            </p>
          </div>
        </div>

        {mode === "edit" && onDelete && (
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card variant="outline" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">Basic Information</h2>
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
              onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
              hint="Used in URL: /apartment/your-slug"
              required
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Description (English)"
                value={formData.descriptionEn}
                onChange={(e) => setFormData((p) => ({ ...p, descriptionEn: e.target.value }))}
                placeholder="Welcome message for your guests..."
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Description (Bosnian)"
                value={formData.descriptionBs}
                onChange={(e) => setFormData((p) => ({ ...p, descriptionBs: e.target.value }))}
                placeholder="Poruka dobrodošlice za vaše goste..."
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card variant="outline" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">Contact Information</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <Input
              label="Contact Phone"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            />
            <Input
              label="WhatsApp"
              value={formData.whatsapp}
              onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
              placeholder="+387 61 123 456"
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
              placeholder="Street, City, ZIP"
            />
          </div>
        </Card>

        {/* Hero Image */}
        <Card variant="outline" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">Hero Banner Image</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Hero Image URL"
              value={formData.heroImage}
              onChange={(e) => setFormData((p) => ({ ...p, heroImage: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              hint="Recommended: 1600x600px or larger, landscape orientation"
            />
            {formData.heroImage && (
              <div className="relative rounded-lg overflow-hidden h-40 bg-surface-100">
                <img
                  src={formData.heroImage}
                  alt="Hero preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3 text-white text-sm font-medium">
                  {formData.name || "Tenant Name"}
                </div>
              </div>
            )}
            <p className="text-xs text-foreground/50">
              Tip: Use a photo of your apartment, building exterior, or a scenic view. This will be displayed at the top of the guest portal.
            </p>
          </div>
        </Card>

        {/* Branding */}
        <Card variant="outline" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">{t("branding")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label={t("logo")}
              value={formData.logo}
              onChange={(e) => setFormData((p) => ({ ...p, logo: e.target.value }))}
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
                    onChange={(e) => setFormData((p) => ({ ...p, primaryColor: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-surface-200"
                    aria-label="Primary color picker"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData((p) => ({ ...p, primaryColor: e.target.value }))}
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
                    onChange={(e) => setFormData((p) => ({ ...p, accentColor: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-surface-200"
                    aria-label="Accent color picker"
                  />
                  <Input
                    value={formData.accentColor}
                    onChange={(e) => setFormData((p) => ({ ...p, accentColor: e.target.value }))}
                  />
                </div>
              </div>
            </div>
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
                  onChange={(e) => setFormData((p) => ({ ...p, hideLogo: e.target.checked }))}
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
            <Globe className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">{t("customDomain")}</h2>
          </div>
          <Input
            value={formData.customDomain}
            onChange={(e) => setFormData((p) => ({ ...p, customDomain: e.target.value }))}
            placeholder="services.yourdomain.com"
            hint="Optional: Point your domain to this tenant"
          />
        </Card>

        {/* Active status */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData((p) => ({ ...p, active: e.target.checked }))}
            className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-foreground font-medium">{t("activeTenant")}</span>
        </label>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-surface-200">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/tenants")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
            {mode === "edit" ? "Save Changes" : "Create Tenant"}
          </Button>
        </div>
      </form>
    </div>
  );
}

