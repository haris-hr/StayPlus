"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Eye, MoreVertical } from "lucide-react";
import { Badge, Avatar } from "@/components/ui";
import { formatRelativeTime, getLocalizedText } from "@/lib/utils";
import type { ServiceRequest, Locale, RequestStatus } from "@/types";

interface RequestsTableProps {
  requests: ServiceRequest[];
  locale: Locale;
  onViewRequest: (request: ServiceRequest) => void;
  showTenant?: boolean;
  tenantNames?: Record<string, string>;
}

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

const RequestsTable = ({
  requests,
  locale,
  onViewRequest,
  showTenant = false,
  tenantNames = {},
}: RequestsTableProps) => {
  const t = useTranslations("admin");

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">{t("noRequests")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
              {t("guestName")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
              {t("service")}
            </th>
            {showTenant && (
              <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                {t("tenant")}
              </th>
            )}
            <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
              {t("requestDate")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-foreground/60">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => {
            const status = statusConfig[request.status];
            return (
              <motion.tr
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={request.guestName} size="sm" />
                    <div>
                      <p className="font-medium text-foreground">
                        {request.guestName}
                      </p>
                      {request.guestEmail && (
                        <p className="text-xs text-foreground/60">
                          {request.guestEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="font-medium text-foreground">
                    {getLocalizedText(request.serviceName, locale)}
                  </p>
                  {request.selectedTier && (
                    <p className="text-xs text-foreground/60">
                      {request.selectedTier}
                    </p>
                  )}
                </td>
                {showTenant && (
                  <td className="py-4 px-4">
                    <p className="text-foreground/80">
                      {tenantNames[request.tenantId] || request.tenantId}
                    </p>
                  </td>
                )}
                <td className="py-4 px-4">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </td>
                <td className="py-4 px-4">
                  <p className="text-foreground/60 text-sm">
                    {formatRelativeTime(request.createdAt, locale)}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewRequest(request)}
                      className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                      title={t("viewDetails")}
                    >
                      <Eye className="w-4 h-4 text-foreground/60" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                      <MoreVertical className="w-4 h-4 text-foreground/60" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export { RequestsTable };
