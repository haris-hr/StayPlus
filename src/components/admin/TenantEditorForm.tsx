"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, ChevronLeft, Globe, Image as ImageIcon, LayoutTemplate, MapPin, Palette } from "lucide-react";
import { Button, Card, Input, Textarea, ImageUpload } from "@/components/ui";
import { slugify } from "@/lib/utils";
import type { Tenant, HeroLayout } from "@/types";
import { useRouter } from "@/i18n/routing";

interface TenantEditorFormProps {
  tenant?: Tenant | null;
  mode: "create" | "edit";
  onSubmit: (data: Partial<Tenant>) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}

export function TenantEditorForm({ tenant, mode, onSubmit, onDelete }: TenantEditorFormProps) {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
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
    heroLayout: (tenant?.branding?.heroLayout || "fullwidth") as HeroLayout,
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
      heroLayout: (tenant?.branding?.heroLayout || "fullwidth") as HeroLayout,
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
          heroLayout: formData.heroLayout,
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
    const ok = confirm(t("deleteTenantPrompt"));
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
            aria-label={t("backToTenants")}
            title={tc("back")}
          >
            <ChevronLeft className="w-5 h-5 text-foreground/70" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {mode === "edit" ? t("editTenant") : t("addTenant")}
            </h1>
            <p className="text-foreground/60 mt-1 text-sm sm:text-base">
              {mode === "edit"
                ? t("tenantUpdateSubtitle")
                : t("tenantCreateSubtitle")}
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
            {tc("delete")}
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card variant="outline" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">{t("basicInformationTitle")}</h2>
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
              hint={t("tenantSlugHint")}
              required
            />
            <div className="sm:col-span-2">
              <Textarea
                label={t("tenantDescriptionEnglish")}
                value={formData.descriptionEn}
                onChange={(e) => setFormData((p) => ({ ...p, descriptionEn: e.target.value }))}
                placeholder={t("tenantWelcomeMessagePlaceholder")}
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label={t("tenantDescriptionBosnian")}
                value={formData.descriptionBs}
                onChange={(e) => setFormData((p) => ({ ...p, descriptionBs: e.target.value }))}
                placeholder={t("tenantWelcomeMessagePlaceholder")}
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card variant="outline" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">{t("contactInformationTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label={t("tenantEmail")}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <Input
              label={t("tenantPhone")}
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            />
            <Input
              label={t("tenantWhatsApp")}
              value={formData.whatsapp}
              onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
              placeholder="+387 61 123 456"
            />
            <Input
              label={t("tenantAddress")}
              value={formData.address}
              onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
              placeholder={t("tenantAddressPlaceholder")}
            />
          </div>
        </Card>

        {/* Hero Layout */}
        <Card variant="outline" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <LayoutTemplate className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">{t("heroLayoutTitle")}</h2>
          </div>
          <p className="text-sm text-foreground/60 mb-4">
            {t("heroLayoutSubtitle")}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Full Width Option */}
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, heroLayout: "fullwidth" }))}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                formData.heroLayout === "fullwidth"
                  ? "border-primary-500 bg-primary-50"
                  : "border-surface-200 hover:border-surface-300"
              }`}
            >
              {/* Layout Preview */}
              <div className="aspect-video bg-surface-200 rounded-lg mb-3 overflow-hidden relative">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${formData.primaryColor}40 0%, ${formData.accentColor}40 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-1 bg-white/80 rounded mx-auto mb-1" />
                    <div className="w-24 h-1.5 bg-white rounded mx-auto mb-1" />
                    <div className="w-20 h-1 bg-white/60 rounded mx-auto" />
                  </div>
                </div>
              </div>
              <div className="font-medium text-foreground">{t("heroLayoutFullWidthTitle")}</div>
              <p className="text-xs text-foreground/60 mt-1">
                {t("heroLayoutFullWidthDescription")}
              </p>
              {formData.heroLayout === "fullwidth" && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            {/* Split Layout Option */}
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, heroLayout: "split" }))}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                formData.heroLayout === "split"
                  ? "border-primary-500 bg-primary-50"
                  : "border-surface-200 hover:border-surface-300"
              }`}
            >
              {/* Layout Preview */}
              <div className="aspect-video bg-surface-100 rounded-lg mb-3 overflow-hidden relative">
                <div className="absolute inset-0 flex">
                  {/* Left side - text */}
                  <div className="flex-1 p-3 flex flex-col justify-center">
                    <div className="w-8 h-1 bg-surface-400 rounded mb-1" />
                    <div className="w-12 h-1.5 bg-surface-500 rounded mb-1" />
                    <div className="w-10 h-1 bg-surface-300 rounded" />
                  </div>
                  {/* Right side - square image */}
                  <div 
                    className="w-1/2 m-2 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${formData.primaryColor}60 0%, ${formData.accentColor}60 100%)`,
                    }}
                  />
                </div>
              </div>
              <div className="font-medium text-foreground">{t("heroLayoutSplitTitle")}</div>
              <p className="text-xs text-foreground/60 mt-1">
                {t("heroLayoutSplitDescription")}
              </p>
              {formData.heroLayout === "split" && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </Card>

        {/* Hero Image */}
        <Card variant="outline" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">{t("heroBannerImageTitle")}</h2>
          </div>
          <ImageUpload
            value={formData.heroImage}
            onChange={(value) => setFormData((p) => ({ ...p, heroImage: value }))}
            hint={
              formData.heroLayout === "fullwidth"
                ? t("heroImageHintFullWidth")
                : t("heroImageHintSplit")
            }
            previewOverlay={
              formData.heroLayout === "fullwidth" ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white text-sm font-medium">
                    {formData.name || t("tenantNameFallback")}
                  </div>
                </>
              ) : undefined
            }
          />
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
              hint={t("tenantLogoHint")}
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
                    aria-label={t("primaryColorPickerAria")}
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
                    aria-label={t("accentColorPickerAria")}
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
                    {t("whiteLabelModeDescription")}
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
            hint={t("tenantCustomDomainHint")}
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
            {tc("cancel")}
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
            {mode === "edit" ? t("saveChanges") : t("createTenant")}
          </Button>
        </div>
      </form>
    </div>
  );
}

