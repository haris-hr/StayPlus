"use client";

import { Link } from "@/i18n/routing";
import { Sparkles, User } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui";
import type { Tenant } from "@/types";

interface GuestHeaderProps {
  tenant?: Tenant | null;
  guestName?: string;
}

const GuestHeader = ({ tenant, guestName }: GuestHeaderProps) => {
  const hideBranding = tenant?.branding?.hideLogo === true;
  const logo = tenant?.branding?.logo;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            {hideBranding ? (
              // White-labeled: Show only tenant name, no StayPlus branding
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {tenant?.name}
                </span>
              </div>
            ) : (
              // Show StayPlus branding
              <>
                {logo ? (
                  <img
                    src={logo}
                    alt={tenant?.name || "Logo"}
                    className="h-8 w-auto"
                  />
                ) : (
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-foreground hidden sm:block">
                      Stay<span className="text-primary-500">Plus</span>
                    </span>
                  </Link>
                )}
                {tenant?.name && !logo && (
                  <span className="text-foreground/60 text-sm hidden sm:block">
                    {tenant.name}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {guestName && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100">
                <User className="w-4 h-4 text-foreground/60" />
                <span className="text-sm font-medium text-foreground">
                  {guestName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { GuestHeader };
