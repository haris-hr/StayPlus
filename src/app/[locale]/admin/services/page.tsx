"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Edit2, Trash2, Star, Image as ImageIcon } from "lucide-react";
import { Button, Card, Badge, Spinner, Select } from "@/components/ui";
import { getLocalizedText, getPricingDisplay } from "@/lib/utils";
import { categories as allCategories } from "@/data/categories";
import { getAllTenants } from "@/data/tenants";
import { allServices as initialServices } from "@/data/services";
import type { Service, ServiceCategory, Tenant, Locale } from "@/types";

export default function ServicesPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const router = useRouter();
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTenant, setFilterTenant] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    // Load data from the data layer
    setTimeout(() => {
      setServices(initialServices);
      setCategories(allCategories);
      setTenants(getAllTenants());
      setIsLoading(false);
    }, 300);
  }, []);

  const handleDelete = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter((s) => s.id !== serviceId));
    }
  };

  const filteredServices = services.filter((s) => {
    if (filterTenant && s.tenantId !== filterTenant) return false;
    if (filterCategory && s.categoryId !== filterCategory) return false;
    return true;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? getLocalizedText(category.name, locale) : categoryId;
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    return tenant?.name || tenantId;
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
          <h1 className="text-3xl font-bold text-foreground">{t("services")}</h1>
          <p className="text-foreground/60 mt-1">
            Manage services available to guests ({filteredServices.length} total)
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/services/new")}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          {t("addService")}
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4"
      >
        <Select
          options={[
            { value: "", label: "All Tenants" },
            ...tenants.map((t) => ({ value: t.id, label: t.name })),
          ]}
          value={filterTenant}
          onChange={(e) => setFilterTenant(e.target.value)}
          className="w-48"
        />
        <Select
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((c) => ({
              value: c.id,
              label: getLocalizedText(c.name, locale),
            })),
          ]}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-48"
        />
      </motion.div>

      {/* Services Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    Tenant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-foreground/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, index) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {/* Service Image Thumbnail */}
                        {service.image ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-100">
                            <Image
                              src={service.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-5 h-5 text-foreground/30" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {getLocalizedText(service.name, locale)}
                            </p>
                            {service.featured && (
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <p className="text-xs text-foreground/60 line-clamp-1 max-w-xs">
                            {getLocalizedText(service.shortDescription || service.description, locale)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="default">
                        {getCategoryName(service.categoryId)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-foreground/80 text-sm">
                        {getTenantName(service.tenantId)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm font-medium ${
                          service.pricingType === "free"
                            ? "text-green-600"
                            : "text-foreground"
                        }`}
                      >
                        {getPricingDisplay(
                          service.pricingType,
                          service.price,
                          service.currency,
                          locale
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={service.active ? "success" : "default"}>
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/admin/services/${service.id}/edit`)}
                          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                          title="Edit"
                          aria-label={`Edit ${getLocalizedText(service.name, locale)}`}
                        >
                          <Edit2 className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                          aria-label={`Delete ${getLocalizedText(service.name, locale)}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">No services found</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
