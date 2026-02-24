"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import type { Tenant, Locale } from "@/types";
import { getLocalizedText } from "@/lib/utils";

interface HeroBannerProps {
  tenant: Tenant;
  locale: Locale;
  guestName?: string;
}

export function HeroBanner({ tenant, locale, guestName }: HeroBannerProps) {
  const description = getLocalizedText(tenant.description, locale);
  const primaryColor = tenant.branding?.primaryColor || "#f96d4a";
  const accentColor = tenant.branding?.accentColor || "#333";
  const heroLayout = tenant.branding?.heroLayout || "fullwidth";
  
  // Generate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (locale === "bs") {
      if (hour < 12) return "Dobro jutro";
      if (hour < 18) return "Dobar dan";
      return "Dobro veče";
    }
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Contact pills component (reused in both layouts)
  const ContactPills = ({ dark = false }: { dark?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-wrap items-center gap-3"
    >
      {tenant.contact.address && (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(tenant.contact.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
            dark 
              ? "bg-surface-100 text-foreground/80 hover:bg-surface-200" 
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>{tenant.contact.address}</span>
        </a>
      )}
      
      {tenant.contact.phone && (
        <a
          href={`tel:${tenant.contact.phone}`}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
            dark 
              ? "bg-surface-100 text-foreground/80 hover:bg-surface-200" 
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
          aria-label={`Call ${tenant.contact.phone}`}
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          <span>{tenant.contact.phone}</span>
        </a>
      )}

      {tenant.contact.whatsapp && (
        <a
          href={`https://wa.me/${tenant.contact.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 rounded-full text-sm text-white hover:bg-green-600 transition-colors"
          aria-label="Contact via WhatsApp"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      )}

      {tenant.contact.email && (
        <a
          href={`mailto:${tenant.contact.email}`}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
            dark 
              ? "bg-surface-100 text-foreground/80 hover:bg-surface-200" 
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
          aria-label={`Email ${tenant.contact.email}`}
        >
          <Mail className="w-4 h-4" aria-hidden="true" />
          <span>{tenant.contact.email}</span>
        </a>
      )}
    </motion.div>
  );

  // Split Layout: Text on left, square image on right
  if (heroLayout === "split") {
    return (
      <div 
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${accentColor}10 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              {/* Greeting */}
              {guestName && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl mb-2"
                  style={{ color: primaryColor }}
                >
                  {getGreeting()}, <span className="font-semibold">{guestName}</span>! 👋
                </motion.p>
              )}

              {/* Tenant Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-4"
              >
                {tenant.name}
              </motion.h1>

              {/* Description */}
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-xl"
                >
                  {description}
                </motion.p>
              )}

              {/* Contact Info Pills */}
              <ContactPills dark />
            </motion.div>

            {/* Right: Image */}
            {tenant.branding?.heroImage && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full flex justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-[420px] lg:max-w-[460px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-surface-100">
                  <Image
                    src={tenant.branding.heroImage}
                    alt={tenant.name}
                    fill
                    className="object-cover scale-[1.02]"
                    priority
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full Width Layout (default): Banner with overlay
  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      {tenant.branding?.heroImage ? (
        <div className="absolute inset-0">
          <Image
            src={tenant.branding.heroImage}
            alt={tenant.name}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)`,
            }}
          />
          {/* Colored accent overlay */}
          <div 
            className="absolute inset-0 mix-blend-multiply opacity-30"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
      ) : (
        // Fallback gradient if no hero image
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          {/* Greeting */}
          {guestName && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-white/90 mb-2"
            >
              {getGreeting()}, <span className="font-semibold">{guestName}</span>! 👋
            </motion.p>
          )}

          {/* Tenant Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg"
          >
            {tenant.name}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 drop-shadow"
            >
              {description}
            </motion.p>
          )}

          {/* Contact Info Pills */}
          <div className="flex justify-center">
            <ContactPills />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
