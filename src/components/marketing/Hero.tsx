"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui";
import { Link } from "@/i18n/routing";

const Hero = () => {
  const t = useTranslations("home.hero");

  const stats = [
    { icon: Star, value: "4.9", label: "Rating" },
    { icon: Users, value: "2K+", label: "Guests" },
    { icon: Zap, value: "50+", label: "Services" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />
      
      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-16 h-16 bg-primary-400/20 rounded-2xl rotate-12"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-1/5 w-12 h-12 bg-accent-400/20 rounded-full"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-sm font-medium text-foreground/80">
                {t("subtitle")}
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {t("title").split(" ").map((word, i) => (
                <span key={i}>
                  {i === 2 ? (
                    <span className="text-gradient">{word} </span>
                  ) : (
                    `${word} `
                  )}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0">
              {t("description")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/apartment/sunny-sarajevo">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  {t("cta")}
                </Button>
              </Link>
              <Link href="#for-hosts">
                <Button variant="outline" size="lg">
                  {t("ctaSecondary")}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <stat.icon className="w-4 h-4 text-primary-500" />
                    <span className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-sm text-foreground/60">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl blur-2xl opacity-20 transform rotate-3" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Service cards preview */}
                <div className="space-y-4">
                  {[
                    { icon: "🚗", title: "Airport Transfer", price: "€25" },
                    { icon: "🍳", title: "Breakfast", price: "€15" },
                    { icon: "🏔️", title: "Day Trip", price: "€45" },
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.icon}</span>
                        <span className="font-medium text-foreground">
                          {service.title}
                        </span>
                      </div>
                      <span className="font-semibold text-primary-600">
                        {service.price}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom action */}
                <div className="mt-6 pt-6 border-t border-surface-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">
                      50+ services available
                    </span>
                    <Button size="sm">Browse All</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Request Confirmed
                </p>
                <p className="text-xs text-foreground/60">Just now</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
