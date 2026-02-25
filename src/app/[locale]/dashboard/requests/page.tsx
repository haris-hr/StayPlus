"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, Spinner, Select, Badge } from "@/components/ui";
import { formatDateTime, getLocalizedText } from "@/lib/utils";
import type { ServiceRequest, Locale, RequestStatus } from "@/types";
import { subscribeRequestsByTenant } from "@/lib/firebase/firestore";

// For now, hardcode the tenant ID - in production this would come from auth context
const CURRENT_TENANT_ID = "sunny-sarajevo";

const statusConfig: Record<RequestStatus, { variant: "default" | "primary" | "success" | "warning" | "danger" | "info" }> = {
  pending: { variant: "warning" },
  confirmed: { variant: "info" },
  in_progress: { variant: "primary" },
  completed: { variant: "success" },
  cancelled: { variant: "danger" },
};

export default function TenantRequestsPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const tg = useTranslations("guest");
  const ts = useTranslations("status");
  const locale = useLocale() as Locale;

  const statusLabel: Record<RequestStatus, string> = {
    pending: ts("pending"),
    confirmed: ts("confirmed"),
    in_progress: ts("inProgress"),
    completed: ts("completed"),
    cancelled: ts("cancelled"),
  };

  const statusOptions = [
    { value: "", label: `${tc("all")} ${t("status")}` },
    { value: "pending", label: statusLabel.pending },
    { value: "confirmed", label: statusLabel.confirmed },
    { value: "in_progress", label: statusLabel.in_progress },
    { value: "completed", label: statusLabel.completed },
    { value: "cancelled", label: statusLabel.cancelled },
  ];
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Subscribe to real-time requests for this tenant from Firestore
  useEffect(() => {
    const unsubscribe = subscribeRequestsByTenant(CURRENT_TENANT_ID, (updatedRequests) => {
      setRequests(updatedRequests);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      >
        <h1 className="text-3xl font-bold text-foreground">{t("requests")}</h1>
        <p className="text-foreground/60 mt-1">
          All service requests for your property
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Select
          options={statusOptions}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-48"
        />
      </motion.div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                hover
                className="cursor-pointer"
                onClick={() => setSelectedRequest(
                  selectedRequest?.id === request.id ? null : request
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {getLocalizedText(request.serviceName, locale)}
                      </h3>
                      <Badge variant={statusConfig[request.status].variant}>
                        {statusLabel[request.status]}
                      </Badge>
                    </div>
                    <p className="text-foreground/60 text-sm">
                      {t("guestTitle")}: {request.guestName}
                      {request.guestEmail && ` • ${request.guestEmail}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground/60">
                      {formatDateTime(request.createdAt, locale)}
                    </p>
                    {request.price && (
                      <p className="font-semibold text-primary-600">
                        {request.currency} {request.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {selectedRequest?.id === request.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-surface-200"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      {request.selectedTier && (
                        <div>
                          <p className="text-foreground/60">{t("optionLabel")}</p>
                          <p className="font-medium">{request.selectedTier}</p>
                        </div>
                      )}
                      {request.date && (
                        <div>
                          <p className="text-foreground/60">{tg("preferredDate")}</p>
                          <p className="font-medium">
                            {formatDateTime(request.date, locale)}
                          </p>
                        </div>
                      )}
                      {request.time && (
                        <div>
                          <p className="text-foreground/60">{tg("preferredTime")}</p>
                          <p className="font-medium">{request.time}</p>
                        </div>
                      )}
                      {request.guestPhone && (
                        <div>
                          <p className="text-foreground/60">{tg("phone")}</p>
                          <p className="font-medium">{request.guestPhone}</p>
                        </div>
                      )}
                      {request.notes && (
                        <div className="sm:col-span-2">
                          <p className="text-foreground/60">{tg("additionalNotes")}</p>
                          <p className="font-medium">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="text-center py-12">
            <p className="text-foreground/60">{t("noRequests")}</p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
