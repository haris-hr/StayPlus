"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Settings, ChevronLeft } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useRouter } from "@/i18n/routing";

/**
 * TEMPORARILY DISABLED
 * --------------------
 * Settings UI isn't wired to persistence/permissions yet.
 * This page intentionally renders a safe placeholder (instead of throwing `notFound()`)
 * to avoid dev/client-navigation runtime crashes.
 */
export default function SettingsPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("settings")}</h1>
          <p className="text-foreground/60 mt-1">{t("settingsDisabledDescription")}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center">
          <Settings className="w-6 h-6 text-foreground/50" aria-hidden="true" />
        </div>
      </motion.div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-foreground/70">
            {t("settingsDisabledDescription")}
          </p>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin")}
            leftIcon={<ChevronLeft className="w-5 h-5" />}
          >
            {tc("back")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
