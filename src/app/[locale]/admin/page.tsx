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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { ServiceRequest, Locale, RequestStatus } from "@/types";

// Mock data for development
const mockRequests: ServiceRequest[] = [
  {
    id: "req-001",
    tenantId: "demo",
    serviceId: "3",
    serviceName: { en: "Airport Transfer", bs: "Aerodromski Transfer" },
    categoryId: "transport",
    guestName: "John Smith",
    guestEmail: "john@example.com",
    status: "pending",
    currency: "EUR",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    updatedAt: new Date(),
  },
  {
    id: "req-002",
    tenantId: "demo",
    serviceId: "7",
    serviceName: { en: "Breakfast", bs: "Doručak" },
    categoryId: "food",
    guestName: "Maria Garcia",
    guestEmail: "maria@example.com",
    guestPhone: "+387 61 234 567",
    status: "confirmed",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    time: "08:00",
    currency: "EUR",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(),
  },
  {
    id: "req-003",
    tenantId: "demo",
    serviceId: "5",
    serviceName: { en: "Erma Safari", bs: "Erma Safari" },
    categoryId: "tours",
    guestName: "Alex Johnson",
    status: "completed",
    selectedTier: "Premium",
    price: 75,
    currency: "EUR",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(),
  },
  {
    id: "req-004",
    tenantId: "demo",
    serviceId: "9",
    serviceName: { en: "Romantic Setup", bs: "Romantična Priprema" },
    categoryId: "special",
    guestName: "Michael Brown",
    guestEmail: "michael@example.com",
    status: "in_progress",
    notes: "Anniversary celebration, please add extra candles",
    currency: "EUR",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    updatedAt: new Date(),
  },
];

const mockTenantNames: Record<string, string> = {
  demo: "Sunny Sarajevo Apartment",
};

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from Firebase
    // const fetchData = async () => {
    //   const requests = await getAllRequests();
    //   setRequests(requests);
    //   setIsLoading(false);
    // };
    // fetchData();

    // Mock data for development
    setTimeout(() => {
      setRequests(mockRequests);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const handleUpdateStatus = async (requestId: string, status: RequestStatus) => {
    // In production: await updateRequest(requestId, { status });
    setRequests(
      requests.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
    setSelectedRequest((prev) => (prev ? { ...prev, status } : null));
  };

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
          change={stats.pending > 0 ? "Needs attention" : "All clear"}
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
          change="+12% from last week"
          changeType="positive"
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
              <div className="text-4xl font-bold text-foreground mb-2">1</div>
              <p className="text-foreground/60 text-sm">Active tenants</p>
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
              <div className="text-4xl font-bold text-foreground mb-2">10</div>
              <p className="text-foreground/60 text-sm">Active services</p>
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
                {[
                  { name: "Airport Transfer", count: 12 },
                  { name: "Breakfast", count: 8 },
                  { name: "Day Trip", count: 5 },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-foreground">{service.name}</span>
                    <span className="text-foreground/60 text-sm">
                      {service.count} requests
                    </span>
                  </div>
                ))}
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
              tenantNames={mockTenantNames}
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
