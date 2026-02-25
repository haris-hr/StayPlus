"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  TrendingUp,
  Building2,
  Layers,
} from "lucide-react";
import { StatsCard, RequestsTable, RequestDetailModal } from "@/components/admin";
import { Card, CardHeader, CardTitle, CardContent, Spinner } from "@/components/ui";
import type { ServiceRequest, Locale, RequestStatus } from "@/types";
import { subscribeRequests, updateRequestStatus } from "@/lib/firebase/firestore";
import { useTenantsStore, useServicesStore } from "@/hooks";
import {
  FIRESTORE_LISTENER_ERROR_EVENT,
  type FirestoreListenerErrorDetail,
} from "@/lib/firebase/listenerErrors";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  
  const { tenants } = useTenantsStore();
  const { services } = useServicesStore();
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Subscribe to real-time requests from Firestore
  useEffect(() => {
    const unsubscribe = subscribeRequests((updatedRequests) => {
      setRequests(updatedRequests);
      setIsLoading(false);
      setLoadError(null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const { detail } = event as CustomEvent<FirestoreListenerErrorDetail>;
      if (!detail || detail.context !== "requests") return;
      setLoadError(
        detail.code === "permission-denied"
          ? t("firestorePermissionDenied")
          : detail.message || t("failedToLoadRequests")
      );
      setIsLoading(false);
    };
    window.addEventListener(FIRESTORE_LISTENER_ERROR_EVENT, handler);
    return () => window.removeEventListener(FIRESTORE_LISTENER_ERROR_EVENT, handler);
  }, [t]);

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const handleUpdateStatus = async (requestId: string, status: RequestStatus) => {
    try {
      await updateRequestStatus(requestId, status);
      setSelectedRequest((prev) => (prev ? { ...prev, status } : null));
    } catch (error) {
      console.error("Failed to update request status:", error);
    }
  };

  // Build tenant names map for display
  const tenantNames: Record<string, string> = {};
  tenants.forEach((t) => {
    tenantNames[t.id] = t.name;
  });

  // Calculate stats - memoized to avoid recalculating on every render
  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      completed: requests.filter((r) => r.status === "completed").length,
      thisWeek: requests.filter((r) => r.createdAt.getTime() > weekAgo).length,
    };
  }, [requests]);

  // Calculate popular services
  const popularServices = useMemo(() => {
    const serviceCounts: Record<string, { name: string; count: number }> = {};
    requests.forEach((r) => {
      const name = r.serviceName.en;
      if (!serviceCounts[r.serviceId]) {
        serviceCounts[r.serviceId] = { name, count: 0 };
      }
      serviceCounts[r.serviceId].count++;
    });
    return Object.values(serviceCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [requests]);

  // Count active tenants and services
  const activeTenants = tenants.filter((t) => t.active).length;
  const activeServices = services.filter((s) => s.active).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600 font-medium">{t("common.error")}</p>
        <p className="text-foreground/60 mt-2">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard")}</h1>
        <p className="text-foreground/60 mt-1">{t("overview")}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t("totalRequests")}
          value={stats.total}
          icon={ClipboardList}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          delay={0}
        />
        <StatsCard
          title={t("pendingRequests")}
          value={stats.pending}
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          change={stats.pending > 0 ? t("needsAttention") : t("allClear")}
          changeType={stats.pending > 0 ? "negative" : "positive"}
          delay={0.1}
        />
        <StatsCard
          title={t("completedRequests")}
          value={stats.completed}
          icon={CheckCircle}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          delay={0.2}
        />
        <StatsCard
          title={t("thisWeek")}
          value={stats.thisWeek}
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          delay={0.3}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                {t("tenants")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">{activeTenants}</div>
              <p className="text-foreground/60 text-sm">{t("activeTenantsLabel")}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary-600" />
                {t("services")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">{activeServices}</div>
              <p className="text-foreground/60 text-sm">{t("activeServicesLabel")}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("popularServices")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularServices.length > 0 ? (
                  popularServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-foreground">{service.name}</span>
                      <span className="text-foreground/60 text-sm">
                        {service.count} request{service.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-foreground/60 text-sm">{t("noRequests")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("recentRequests")}</CardTitle>
          </CardHeader>
          <CardContent padding="none">
            <RequestsTable
              requests={requests.slice(0, 5)}
              locale={locale}
              onViewRequest={handleViewRequest}
              showTenant
              tenantNames={tenantNames}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Request Detail Modal */}
      <RequestDetailModal
        isOpen={showRequestModal}
        onClose={() => {
          setShowRequestModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        locale={locale}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
