"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Edit2, Trash2, Star, Image as ImageIcon } from "lucide-react";
import { Button, Card, Badge, Select, Spinner } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getLocalizedText, getPricingDisplay } from "@/lib/utils";
import type { Locale, Service, ServiceCategory } from "@/types";
import { useTenantsStore } from "@/hooks";
import {
  getServicesPage,
  deleteService as deleteServiceFromDb,
  subscribeCategories,
} from "@/lib/firebase/firestore";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export default function ServicesPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  
  const { tenants } = useTenantsStore();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [filterTenant, setFilterTenant] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCursors, setPageCursors] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([null]);
  const [nextCursor, setNextCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters are applied server-side via Firestore query.
  const filteredServices = useMemo(() => services, [services]);

  const loadPage = async (cursor: QueryDocumentSnapshot<DocumentData> | null) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await getServicesPage({
        pageSize: 10,
        tenantId: filterTenant || undefined,
        categoryId: filterCategory || undefined,
        cursor,
      });
      setServices(res.services);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("failedToLoadServices"));
      setServices([]);
      setNextCursor(null);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset pagination + load first page when filters change.
  useEffect(() => {
    setPageIndex(0);
    setPageCursors([null]);
    void loadPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTenant, filterCategory]);

  // Load initial page
  useEffect(() => {
    void loadPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to categories from Firestore (source of truth for admin)
  useEffect(() => {
    const unsub = subscribeCategories(setCategories);
    return () => unsub();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteServiceFromDb(deleteTarget.id);
      const cursor = pageCursors[pageIndex] ?? null;
      await loadPage(cursor);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? getLocalizedText(category.name, locale) : categoryId;
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    return tenant?.name || tenantId;
  };

  return (
    <div className="space-y-8">
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title={t("deleteService")}
        description={
          deleteTarget ? (
            <>
              {t("deleteServiceConfirm")} <span className="font-semibold">{deleteTarget.name}</span>.
            </>
          ) : null
        }
        confirmText={t("delete")}
        cancelText={t("cancel")}
        variant="danger"
        isConfirmLoading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("services")}</h1>
          <p className="text-foreground/60 mt-1">
            {t("manageServices")} (page {pageIndex + 1})
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
            { value: "", label: t("allTenants") },
            ...tenants.map((tenant) => ({ value: tenant.id, label: tenant.name })),
          ]}
          value={filterTenant}
          onChange={(e) => setFilterTenant(e.target.value)}
          className="w-48"
        />
        <Select
          options={[
            { value: "", label: t("allCategories") },
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
          {isLoading && (
            <div className="p-6 border-b border-surface-200 bg-white">
              <div className="flex items-center gap-3 text-sm text-foreground/60">
                <Spinner size="sm" />
                {t("loadingServices")}
              </div>
            </div>
          )}
          {loadError && (
            <div className="p-6 border-b border-surface-200 bg-white">
              <p className="text-sm text-red-600">{loadError}</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    {t("service")}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    {t("category")}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    {t("tenant")}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    {t("price")}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    {t("status")}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-foreground/60">
                    {t("actions")}
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
                        {service.active ? t("active") : t("inactive")}
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
                          onClick={() =>
                            setDeleteTarget({
                              id: service.id,
                              name: getLocalizedText(service.name, locale),
                            })
                          }
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
              <p className="text-foreground/60">
                {isLoading ? tc("loading") : t("noServicesFound")}
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-surface-200 bg-white">
            <p className="text-sm text-foreground/60">
              {t("showingServices", { count: filteredServices.length })}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  if (pageIndex === 0) return;
                  const prevIndex = pageIndex - 1;
                  const cursor = pageCursors[prevIndex] ?? null;
                  setPageIndex(prevIndex);
                  await loadPage(cursor);
                }}
                disabled={pageIndex === 0 || isLoading}
              >
                {tc("back")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  if (!hasMore || !nextCursor) return;
                  const newIndex = pageIndex + 1;
                  setPageCursors((prev) => {
                    const next = [...prev];
                    next[newIndex] = nextCursor;
                    return next;
                  });
                  setPageIndex(newIndex);
                  await loadPage(nextCursor);
                }}
                disabled={!hasMore || isLoading}
              >
                {tc("next")}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
