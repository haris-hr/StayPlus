"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Copy, Eye, MoreVertical } from "lucide-react";
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
  const [openMenuForId, setOpenMenuForId] = useState<string | null>(null);
  const [justCopiedId, setJustCopiedId] = useState<string | null>(null);
  const menuRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenuForId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuForId(null);
    };
    const onMouseDown = (e: MouseEvent) => {
      const el = menuRootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setOpenMenuForId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [openMenuForId]);

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">{t("noRequests")}</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {requests.map((request, index) => {
          const status = statusConfig[request.status];
          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-surface-200 p-4"
              onClick={() => onViewRequest(request)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar fallback={request.guestName} size="sm" />
                  <div>
                    <p className="font-medium text-foreground">
                      {request.guestName}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {formatRelativeTime(request.createdAt, locale)}
                    </p>
                  </div>
                </div>
                <Badge variant={status.variant} size="sm">{status.label}</Badge>
              </div>
              <p className="text-sm text-foreground mb-1">
                {getLocalizedText(request.serviceName, locale)}
              </p>
              {showTenant && (
                <p className="text-xs text-foreground/60">
                  {tenantNames[request.tenantId] || request.tenantId}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto" ref={menuRootRef}>
        <table className="w-full min-w-[600px]">
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
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuForId((prev) => (prev === request.id ? null : request.id))
                          }
                          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                          aria-haspopup="menu"
                          aria-expanded={openMenuForId === request.id}
                          title="More actions"
                        >
                        <MoreVertical className="w-4 h-4 text-foreground/60" />
                        </button>

                        {openMenuForId === request.id && (
                          <div
                            role="menu"
                            className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-surface-200 bg-white shadow-lg overflow-hidden z-20"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuForId(null);
                                onViewRequest(request);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-surface-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4 text-foreground/60" />
                              View details
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(request.id);
                                  setJustCopiedId(request.id);
                                  window.setTimeout(() => {
                                    setJustCopiedId((prev) => (prev === request.id ? null : prev));
                                  }, 1200);
                                } catch {
                                  // Fallback if clipboard is blocked
                                  window.prompt("Copy request id:", request.id);
                                } finally {
                                  setOpenMenuForId(null);
                                }
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-surface-50 flex items-center gap-2"
                            >
                              {justCopiedId === request.id ? (
                                <Check className="w-4 h-4 text-foreground/60" />
                              ) : (
                                <Copy className="w-4 h-4 text-foreground/60" />
                              )}
                              {justCopiedId === request.id ? "Copied" : "Copy ID"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export { RequestsTable };
