"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { RequestsTable, RequestDetailModal } from "@/components/admin";
import { Card, CardHeader, CardTitle, CardContent, Spinner, Select } from "@/components/ui";
import type { ServiceRequest, Locale, RequestStatus } from "@/types";

// Mock data
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
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    updatedAt: new Date(),
  },
  {
    id: "req-005",
    tenantId: "demo",
    serviceId: "10",
    serviceName: { en: "Shopping Run", bs: "Kupovina" },
    categoryId: "convenience",
    guestName: "Sarah Wilson",
    guestEmail: "sarah@example.com",
    status: "cancelled",
    notes: "Guest cancelled - no longer needed",
    currency: "EUR",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(),
  },
];

const mockTenantNames: Record<string, string> = {
  demo: "Sunny Sarajevo Apartment",
};

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function RequestsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
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
    setRequests(
      requests.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
    setSelectedRequest((prev) => (prev ? { ...prev, status } : null));
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

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
          <h1 className="text-3xl font-bold text-foreground">{t("requests")}</h1>
          <p className="text-foreground/60 mt-1">
            View and manage all service requests
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4"
      >
        <Select
          options={statusOptions}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-48"
        />
      </motion.div>

      {/* Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredRequests.length} Request{filteredRequests.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent padding="none">
            <RequestsTable
              requests={filteredRequests}
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
