"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { ServiceForm } from "@/components/admin";
import { Button, Card, Badge, Spinner, Select } from "@/components/ui";
import { getLocalizedText, getPricingDisplay } from "@/lib/utils";
import type { Service, ServiceCategory, Tenant, Locale } from "@/types";

// Mock data
const mockCategories: ServiceCategory[] = [
  { id: "free", name: { en: "Free Amenities", bs: "Besplatne Pogodnosti" }, icon: "gift", order: 1, active: true },
  { id: "transport", name: { en: "Transport", bs: "Transport" }, icon: "car", order: 2, active: true },
  { id: "tours", name: { en: "Tours & Activities", bs: "Ture i Aktivnosti" }, icon: "mountain", order: 3, active: true },
  { id: "food", name: { en: "Food & Dining", bs: "Hrana i Restorani" }, icon: "utensils", order: 4, active: true },
  { id: "special", name: { en: "Special Occasions", bs: "Posebne Prilike" }, icon: "heart", order: 5, active: true },
  { id: "convenience", name: { en: "Convenience", bs: "Pogodnosti" }, icon: "shopping", order: 6, active: true },
];

const mockTenants: Tenant[] = [
  {
    id: "demo",
    slug: "sunny-sarajevo",
    name: "Sunny Sarajevo Apartment",
    branding: {},
    contact: { email: "host@example.com" },
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockServices: Service[] = [
  {
    id: "1",
    tenantId: "demo",
    categoryId: "free",
    name: { en: "Complimentary Water", bs: "Besplatna Voda" },
    description: { en: "Fresh bottled water", bs: "Svježa flaširana voda" },
    pricingType: "free",
    currency: "EUR",
    active: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    tenantId: "demo",
    categoryId: "transport",
    name: { en: "Airport Transfer", bs: "Aerodromski Transfer" },
    description: { en: "Airport pickup & dropoff", bs: "Prevoz od/do aerodroma" },
    pricingType: "fixed",
    price: 25,
    currency: "EUR",
    active: true,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    tenantId: "demo",
    categoryId: "tours",
    name: { en: "Erma Safari", bs: "Erma Safari" },
    description: { en: "Safari adventure", bs: "Safari avantura" },
    pricingType: "variable",
    price: 45,
    currency: "EUR",
    tiers: [
      { id: "standard", name: { en: "Standard", bs: "Standard" }, price: 45 },
      { id: "premium", name: { en: "Premium", bs: "Premium" }, price: 75 },
    ],
    active: true,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ServicesPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filterTenant, setFilterTenant] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      setServices(mockServices);
      setCategories(mockCategories);
      setTenants(mockTenants);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSubmit = async (data: Partial<Service>) => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id ? { ...s, ...data, updatedAt: new Date() } : s
        )
      );
    } else {
      const newService: Service = {
        id: `service-${Date.now()}`,
        tenantId: data.tenantId!,
        categoryId: data.categoryId!,
        name: data.name!,
        description: data.description!,
        shortDescription: data.shortDescription,
        image: data.image,
        pricingType: data.pricingType!,
        price: data.price,
        currency: data.currency || "EUR",
        tiers: data.tiers,
        active: data.active ?? true,
        featured: data.featured,
        order: data.order || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setServices([...services, newService]);
    }
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

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
            Manage services available to guests
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null);
            setShowForm(true);
          }}
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
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {getLocalizedText(service.name, locale)}
                            </p>
                            {service.featured && (
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <p className="text-xs text-foreground/60 line-clamp-1">
                            {getLocalizedText(service.description, locale)}
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
                          onClick={() => handleEdit(service)}
                          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
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

      {/* Service Form Modal */}
      <ServiceForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingService(null);
        }}
        service={editingService}
        categories={categories}
        tenants={tenants}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
