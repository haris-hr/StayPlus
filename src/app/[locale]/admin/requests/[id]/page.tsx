"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Clock, Mail, MessageSquare, Phone, Tag, User } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Select, Spinner } from "@/components/ui";
import { useRouter } from "@/i18n/routing";
import { formatDateTime, getLocalizedText } from "@/lib/utils";
import { getRequestById, updateRequestStatus } from "@/lib/firebase/firestore";
import { useTenantsStore } from "@/hooks";
import type { Locale, RequestStatus, ServiceRequest } from "@/types";

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusConfig: Record<
  RequestStatus,
  { variant: "default" | "primary" | "success" | "warning" | "danger" | "info"; label: string }
> = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "info", label: "Confirmed" },
  in_progress: { variant: "primary", label: "In Progress" },
  completed: { variant: "success", label: "Completed" },
  cancelled: { variant: "danger", label: "Cancelled" },
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-foreground/40 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-xs text-foreground/60">{label}</p>
        <p className="text-foreground break-words">{value}</p>
      </div>
    </div>
  );
}

export default function AdminRequestDetailPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  const { tenants } = useTenantsStore();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const tenantName = useMemo(() => {
    const tenant = tenants.find((x) => x.id === request?.tenantId);
    return tenant?.name;
  }, [tenants, request?.tenantId]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const found = await getRequestById(requestId);
        if (cancelled) return;
        setRequest(found);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load request");
        setRequest(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const handleStatusChange = async (next: RequestStatus) => {
    if (!request || next === request.status) return;
    setIsUpdatingStatus(true);
    try {
      await updateRequestStatus(request.id, next);
      setRequest({ ...request, status: next, updatedAt: new Date() });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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
        <div className="mt-6">
          <Button variant="secondary" onClick={() => router.push("/admin/requests")}>
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Request not found</h2>
        <p className="text-foreground/60 mb-6">The request you&apos;re looking for doesn&apos;t exist.</p>
        <Button variant="secondary" onClick={() => router.push("/admin/requests")}>
          Back to Requests
        </Button>
      </div>
    );
  }

  const status = statusConfig[request.status];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/requests")}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors mt-1"
            aria-label="Back to requests"
          >
            <ChevronLeft className="w-5 h-5 text-foreground/70" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Request #{request.id.slice(0, 8)}
              </h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="text-foreground/60 mt-1">
              {tenantName ? `${tenantName} • ` : ""}
              {formatDateTime(request.createdAt, locale)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-foreground">
                {getLocalizedText(request.serviceName, locale)}
              </p>
              {request.selectedTier && (
                <p className="text-sm text-foreground/60">Option: {request.selectedTier}</p>
              )}
              {request.price !== undefined && (
                <p className="text-sm font-medium text-primary-600">
                  {request.currency} {request.price}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                icon={Calendar}
                label="Preferred Date"
                value={request.date ? formatDateTime(request.date, locale) : null}
              />
              <InfoRow icon={Clock} label="Preferred Time" value={request.time} />
              <InfoRow icon={MessageSquare} label="Notes" value={request.notes} />
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-foreground/40 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs text-foreground/60">Status</p>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guest</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={User} label="Name" value={request.guestName} />
              <InfoRow icon={Mail} label="Email" value={request.guestEmail} />
              <InfoRow icon={Phone} label="Phone" value={request.guestPhone} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("updateStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                options={statusOptions.map((o) => ({ value: o.value, label: o.label }))}
                value={request.status}
                onChange={(e) => void handleStatusChange(e.target.value as RequestStatus)}
              />
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push("/admin/requests")}
              >
                Back to Requests
              </Button>
              {isUpdatingStatus && (
                <p className="text-xs text-foreground/60">Updating…</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

