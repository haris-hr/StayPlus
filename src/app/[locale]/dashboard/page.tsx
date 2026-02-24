"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ClipboardList, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { StatsCard, RequestsTable } from "@/components/admin";
import { Card, CardHeader, CardTitle, CardContent, Spinner } from "@/components/ui";
import type { ServiceRequest, Locale } from "@/types";
import { subscribeRequestsByTenant } from "@/lib/firebase/firestore";

// For now, hardcode the tenant ID - in production this would come from auth context
const CURRENT_TENANT_ID = "sunny-sarajevo";

export default function TenantDashboardPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to real-time requests for this tenant from Firestore
  useEffect(() => {
    const unsubscribe = subscribeRequestsByTenant(CURRENT_TENANT_ID, (updatedRequests) => {
      setRequests(updatedRequests);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard")}</h1>
        <p className="text-foreground/60 mt-1">
          View your property&apos;s service requests
        </p>
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

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("recentRequests")}</CardTitle>
          </CardHeader>
          <CardContent padding="none">
            <RequestsTable
              requests={requests}
              locale={locale}
              onViewRequest={() => {}}
              showTenant={false}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Info notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-blue-50 border border-blue-100"
      >
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> This is a read-only dashboard. To manage requests
          or update their status, please contact the StayPlus admin team.
        </p>
      </motion.div>
    </div>
  );
}
