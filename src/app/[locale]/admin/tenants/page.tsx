"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Trash2, ExternalLink, Image as ImageIcon, Edit2 } from "lucide-react";
import Image from "next/image";
import { Button, Card, Badge } from "@/components/ui";
import { Link, useRouter } from "@/i18n/routing";
import { useTenantsStore } from "@/hooks";

export default function TenantsPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const { tenants, deleteTenant } = useTenantsStore();

  const handleDelete = async (tenantId: string) => {
    if (confirm("Are you sure you want to delete this tenant?")) {
      await deleteTenant(tenantId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("tenants")}</h1>
          <p className="text-foreground/60 mt-1 text-sm sm:text-base">
            {t("manageTenants")} ({tenants.length} {t("total")})
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/tenants/new")}
          leftIcon={<Plus className="w-5 h-5" />}
          className="w-full sm:w-auto"
        >
          {t("addTenant")}
        </Button>
      </motion.div>

      {/* Tenants Grid */}
      {tenants.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant, index) => {
            // NOTE: TS toolchain is currently not recognizing `heroImage` on TenantBranding
            // even though it exists in `src/types/index.ts`. Use a typed accessor to avoid blocking.
            const heroImage = (tenant.branding as { heroImage?: string }).heroImage;
            const hasHeroImage = Boolean(heroImage);

            return (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  hover 
                  className="group relative h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-surface-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                  onClick={() => router.push(`/admin/tenants/${tenant.id}/edit`)}
                  role="link"
                  tabIndex={0}
                  aria-label={`Edit ${tenant.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/admin/tenants/${tenant.id}/edit`);
                    }
                  }}
                >
                  {/* Hover / focus hint */}
                  <div className="pointer-events-none absolute right-4 top-4 z-20 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <div
                      className={
                        hasHeroImage
                          ? "inline-flex items-center gap-1 rounded-full bg-black/40 text-white px-2.5 py-1 text-xs font-medium backdrop-blur border border-white/20"
                          : "inline-flex items-center gap-1 rounded-full bg-white/80 text-foreground px-2.5 py-1 text-xs font-medium backdrop-blur border border-surface-200 shadow-sm"
                      }
                    >
                      <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Click to edit</span>
                    </div>
                  </div>

                  {/* Hero Image or Color Bar */}
                  {heroImage ? (
                    <div className="relative h-32 -mt-6 -mx-6 mb-4 overflow-hidden rounded-t-2xl">
                      <Image
                        src={heroImage}
                        alt={tenant.name}
                        fill
                        className="object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                      />
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="font-semibold text-white text-lg drop-shadow">
                          {tenant.name}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Color bar fallback */}
                      <div
                        className="h-2 rounded-t-2xl -mt-6 -mx-6 mb-4 overflow-hidden"
                        style={{
                          background: `linear-gradient(to right, ${
                            tenant.branding.primaryColor || "#f96d4a"
                          }, ${tenant.branding.accentColor || "#05c7ae"})`,
                        }}
                      />
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground text-lg">
                          {tenant.name}
                        </h3>
                      </div>
                    </>
                  )}

                {/* Slug and Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <p className="text-foreground/60 text-sm">
                    /{tenant.slug}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {tenant.branding.hideLogo && (
                      <Badge variant="warning" className="text-xs whitespace-nowrap">
                        White-label
                      </Badge>
                    )}
                    <Badge variant={tenant.active ? "success" : "default"} className="whitespace-nowrap">
                      {tenant.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1.5 text-sm text-foreground/70 mb-4">
                  <p className="truncate">{tenant.contact.email}</p>
                  {tenant.contact.phone && <p>{tenant.contact.phone}</p>}
                  {tenant.contact.address && (
                    <p className="text-xs text-foreground/50 truncate">{tenant.contact.address}</p>
                  )}
                </div>

                {/* Hero Image Status */}
                <div className="flex items-center gap-2 text-xs text-foreground/50 mb-4">
                  <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {heroImage ? "Hero image set" : "No hero image"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-surface-200 gap-2">
                  <Link
                    href={`/apartment/${tenant.slug}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Portal
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tenant.id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                    aria-label={`Delete ${tenant.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </Card>
            </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-foreground/60 mb-4">No tenants yet</p>
          <Button
            onClick={() => router.push("/admin/tenants/new")}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add Your First Tenant
          </Button>
        </Card>
      )}
    </div>
  );
}
