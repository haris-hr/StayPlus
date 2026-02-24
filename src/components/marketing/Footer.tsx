"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui";

const Footer = () => {
  const t = useTranslations();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: t("categories.transport"), href: "#" },
      { label: t("categories.food"), href: "#" },
      { label: t("categories.tours"), href: "#" },
      { label: t("categories.special"), href: "#" },
    ],
    company: [
      { label: t("nav.about"), href: "#" },
      { label: t("nav.contact"), href: "#" },
      { label: t("footer.privacy"), href: "#" },
      { label: t("footer.terms"), href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Stay<span className="text-primary-400">Plus</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm mb-4">
              {t("common.tagline")}
            </p>
            <LanguageSwitcher variant="compact" className="text-white/60" />
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t("nav.services")}</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("nav.contact")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-4 h-4" />
                <span>hello@stayplus.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-4 h-4" />
                <span>+387 61 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Sarajevo, Bosnia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {currentYear} StayPlus. {t("footer.rights")}.
          </p>
          <div className="flex items-center gap-4">
            {/* Social links placeholder */}
            <div className="flex items-center gap-3">
              {["instagram", "facebook", "twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-white/60 rounded-sm" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
