"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { TenantForm } from "@/components/admin";
import { Button, Card, Badge, Spinner } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { getAllTenants } from "@/data/tenants";
import type { Tenant } from "@/types";

export default function TenantsPage() {
  const t = useTranslations("admin");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    // Load from data layer
    setTimeout(() => {
      setTenants(getAllTenants());
      setIsLoading(false);
    }, 300);
  }, []);

  const handleSubmit = async (data: Partial<Tenant>) => {
    if (editingTenant) {
      // Update existing tenant
      setTenants(
        tenants.map((t) =>
          t.id === editingTenant.id ? { ...t, ...data, updatedAt: new Date() } : t
        )
      );
    } else {
      // Create new tenant
      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        slug: data.slug!,
        name: data.name!,
        description: data.description,
        branding: data.branding || {},
        contact: data.contact!,
        active: data.active ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTenants([...tenants, newTenant]);
    }
    setEditingTenant(null);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setShowForm(true);
  };

  const handleDelete = async (tenantId: string) => {
    if (confirm("Are you sure you want to delete this tenant?")) {
      setTenants(tenants.filter((t) => t.id !== tenantId));
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
            Manage your property tenants ({tenants.length} total)
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTenant(null);
            setShowForm(true);
          }}
          leftIcon={<Plus className="w-5 h-5" />}
          className="w-full sm:w-auto"
        >
          {t("addTenant")}
        </Button>
      </motion.div>

      {/* Tenants Grid */}
      {tenants.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant, index) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                {/* Hero Image or Color Bar */}
                {tenant.branding.heroImage ? (
                  <div className="relative h-32 -mt-6 -mx-6 mb-4 overflow-hidden rounded-t-2xl">
                    <img
                      src={tenant.branding.heroImage}
                      alt={tenant.name}
                      className="w-full h-full object-cover"
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
                    {tenant.branding.heroImage ? "Hero image set" : "No hero image"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-surface-200 gap-2">
                  <Link
                    href={`/apartment/${tenant.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Portal
                  </Link>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(tenant)}
                      className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                      title="Edit"
                      aria-label={`Edit ${tenant.name}`}
                    >
                      <Edit2 className="w-4 h-4 text-foreground/60" />
                    </button>
                    <button
                      onClick={() => handleDelete(tenant.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                      aria-label={`Delete ${tenant.name}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-foreground/60 mb-4">No tenants yet</p>
          <Button
            onClick={() => setShowForm(true)}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add Your First Tenant
          </Button>
        </Card>
      )}

      {/* Tenant Form Modal */}
      <TenantForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTenant(null);
        }}
        tenant={editingTenant}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
