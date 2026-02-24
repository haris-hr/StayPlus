"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { User } from "lucide-react";
import { LanguageSwitcher, Logo } from "@/components/ui";
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
                  <Image
                    src={logo}
                    alt={tenant?.name || "Logo"}
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                ) : (
                  <Link href="/" className="flex items-center gap-2">
                    <span className="sm:hidden">
                      <Logo size="sm" variant="mark" />
                    </span>
                    <span className="hidden sm:block">
                      <Logo size="sm" variant="full" />
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
