"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { RequestsTable, RequestDetailModal } from "@/components/admin";
import { Card, CardHeader, CardTitle, CardContent, Spinner, Select } from "@/components/ui";
import type { ServiceRequest, Locale, RequestStatus } from "@/types";
import { subscribeRequests, updateRequestStatus } from "@/lib/firebase/firestore";
import { useTenantsStore } from "@/hooks";
import {
  FIRESTORE_LISTENER_ERROR_EVENT,
  type FirestoreListenerErrorDetail,
} from "@/lib/firebase/listenerErrors";

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
  const { tenants } = useTenantsStore();
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");

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
          ? "Firestore permission denied. Update Firestore Rules or enable real admin auth."
          : detail.message || "Failed to load requests"
      );
      setIsLoading(false);
    };
    window.addEventListener(FIRESTORE_LISTENER_ERROR_EVENT, handler);
    return () => window.removeEventListener(FIRESTORE_LISTENER_ERROR_EVENT, handler);
  }, []);

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const handleUpdateStatus = async (requestId: string, status: RequestStatus) => {
    try {
      await updateRequestStatus(requestId, status);
      // Update local state for the modal
      setSelectedRequest((prev) => (prev ? { ...prev, status } : null));
    } catch (error) {
      console.error("Failed to update request status:", error);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  // Build tenant names map for display
  const tenantNames: Record<string, string> = {};
  tenants.forEach((t) => {
    tenantNames[t.id] = t.name;
  });

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
