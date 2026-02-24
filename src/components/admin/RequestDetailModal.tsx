"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  Tag,
} from "lucide-react";
import { Button, Badge, Select } from "@/components/ui";
import { formatDateTime, getLocalizedText } from "@/lib/utils";
import type { ServiceRequest, Locale, RequestStatus } from "@/types";

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  locale: Locale;
  onUpdateStatus: (requestId: string, status: RequestStatus) => Promise<void>;
}

const statusOptions = [
  { value: "", label: "Select new status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusConfig: Record<
  RequestStatus,
  { variant: "default" | "primary" | "success" | "warning" | "danger" | "info" }
> = {
  pending: { variant: "warning" },
  confirmed: { variant: "info" },
  in_progress: { variant: "primary" },
  completed: { variant: "success" },
  cancelled: { variant: "danger" },
};

const RequestDetailModal = ({
  isOpen,
  onClose,
  request,
  locale,
  onUpdateStatus,
}: RequestDetailModalProps) => {
  const t = useTranslations("admin");
  const [newStatus, setNewStatus] = useState<RequestStatus | "">("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!request) return null;

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === request.status) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(request.id, newStatus);
      setNewStatus("");
    } finally {
      setIsUpdating(false);
    }
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value?: string | null;
  }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-foreground/40 mt-0.5" />
        <div>
          <p className="text-xs text-foreground/60">{label}</p>
          <p className="text-foreground">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {t("viewDetails")}
                    </h2>
                    <p className="text-sm text-foreground/60 mt-1">
                      Request #{request.id.slice(0, 8)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Service info */}
                <div className="p-4 rounded-xl bg-surface-50">
                  <h3 className="font-semibold text-foreground mb-1">
                    {getLocalizedText(request.serviceName, locale)}
                  </h3>
                  {request.selectedTier && (
                    <p className="text-sm text-foreground/60">
                      Option: {request.selectedTier}
                    </p>
                  )}
                  {request.price && (
                    <p className="text-sm font-medium text-primary-600 mt-2">
                      {request.currency} {request.price}
                    </p>
                  )}
                </div>

                {/* Guest info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
                    Guest Information
                  </h4>
                  <InfoRow icon={User} label="Name" value={request.guestName} />
                  <InfoRow icon={Mail} label="Email" value={request.guestEmail} />
                  <InfoRow icon={Phone} label="Phone" value={request.guestPhone} />
                </div>

                {/* Request details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
                    Request Details
                  </h4>
                  <InfoRow
                    icon={Calendar}
                    label="Preferred Date"
                    value={request.date ? formatDateTime(request.date, locale) : null}
                  />
                  <InfoRow icon={Clock} label="Preferred Time" value={request.time} />
                  <InfoRow icon={MessageSquare} label="Notes" value={request.notes} />
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-foreground/40 mt-0.5" />
                    <div>
                      <p className="text-xs text-foreground/60">Status</p>
                      <Badge variant={statusConfig[request.status].variant}>
                        {request.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Update status */}
                <div className="pt-4 border-t border-surface-200">
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    {t("updateStatus")}
                  </h4>
                  <div className="flex gap-3">
                    <Select
                      options={statusOptions}
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as RequestStatus)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={!newStatus || newStatus === request.status}
                      isLoading={isUpdating}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-surface-200 bg-surface-50">
                <p className="text-xs text-foreground/60">
                  Created: {formatDateTime(request.createdAt, locale)}
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export { RequestDetailModal };
