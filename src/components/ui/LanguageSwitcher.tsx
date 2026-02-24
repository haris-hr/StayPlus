"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", label: "EN", fullLabel: "English" },
  { code: "bs", label: "BS", fullLabel: "Bosanski" },
];

export interface LanguageSwitcherProps {
  variant?: "compact" | "full";
  className?: string;
}

const LanguageSwitcher = ({
  variant = "compact",
  className,
}: LanguageSwitcherProps) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "en" | "bs" });
  };

  if (variant === "full") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Globe className="w-4 h-4 text-foreground/60" />
        <div className="flex rounded-lg bg-surface-100 p-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                locale === lang.code
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              {lang.fullLabel}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {languages.map((lang, index) => (
        <span key={lang.code} className="flex items-center">
          <button
            onClick={() => handleChange(lang.code)}
            className={cn(
              "px-2 py-1 text-sm font-medium rounded transition-colors",
              locale === lang.code
                ? "text-primary-600"
                : "text-foreground/50 hover:text-foreground"
            )}
          >
            {lang.label}
          </button>
          {index < languages.length - 1 && (
            <span className="text-foreground/30">|</span>
          )}
        </span>
      ))}
    </div>
  );
};

export { LanguageSwitcher };
