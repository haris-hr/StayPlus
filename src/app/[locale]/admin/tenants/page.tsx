"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { TenantForm } from "@/components/admin";
import { Button, Card, Badge, Spinner } from "@/components/ui";
import { Link } from "@/i18n/routing";
import type { Tenant } from "@/types";

// Mock data
const mockTenants: Tenant[] = [
  {
    id: "demo",
    slug: "sunny-sarajevo",
    name: "Sunny Sarajevo Apartment",
    branding: {
      primaryColor: "#f96d4a",
      accentColor: "#05c7ae",
    },
    contact: {
      email: "host@example.com",
      phone: "+387 61 123 456",
      whatsapp: "+387 61 123 456",
    },
    active: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
];

export default function TenantsPage() {
  const t = useTranslations("admin");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    // In production, fetch from Firebase
    setTimeout(() => {
      setTenants(mockTenants);
      setIsLoading(false);
    }, 500);
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("tenants")}</h1>
          <p className="text-foreground/60 mt-1">
            Manage your property tenants and their settings
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTenant(null);
            setShowForm(true);
          }}
          leftIcon={<Plus className="w-5 h-5" />}
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
                {/* Color bar */}
                <div
                  className="h-2 rounded-t-2xl -mt-6 -mx-6 mb-4"
                  style={{
                    background: `linear-gradient(to right, ${
                      tenant.branding.primaryColor || "#f96d4a"
                    }, ${tenant.branding.accentColor || "#05c7ae"})`,
                  }}
                />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {tenant.name}
                    </h3>
                    <p className="text-foreground/60 text-sm">
                      /{tenant.slug}
                    </p>
                  </div>
                  <Badge variant={tenant.active ? "success" : "default"}>
                    {tenant.active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-foreground/70 mb-6">
                  <p>{tenant.contact.email}</p>
                  {tenant.contact.phone && <p>{tenant.contact.phone}</p>}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-200">
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
                    >
                      <Edit2 className="w-4 h-4 text-foreground/60" />
                    </button>
                    <button
                      onClick={() => handleDelete(tenant.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
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
