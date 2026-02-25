"use client";

import { Link } from "@/i18n/routing";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui";
import { useTranslations } from "next-intl";

export default function ApartmentNotFound() {
  const t = useTranslations("guest");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-primary-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {t("apartmentNotFoundTitle")}
        </h1>
        <p className="text-foreground/60 mb-8">
          {t("apartmentNotFoundDescription")}
        </p>
        <Link href="/">
          <Button leftIcon={<Home className="w-5 h-5" />}>
            {t("backToHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
