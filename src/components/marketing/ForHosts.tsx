"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TrendingUp, Star, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

const ForHosts = () => {
  const t = useTranslations("home.hosts");

  const benefits = [
    { icon: TrendingUp, text: t("benefit1") },
    { icon: Star, text: t("benefit2") },
    { icon: Settings, text: t("benefit3") },
  ];

  return (
    <section id="hosts" className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-100 to-primary-100 rounded-3xl transform -rotate-3" />
            
            {/* Main card */}
            <div className="relative bg-white rounded-3xl shadow-xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Dashboard preview */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-surface-200">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Dashboard Overview
                    </h4>
                    <p className="text-sm text-foreground/60">This month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">€1,240</p>
                    <p className="text-sm text-green-600">+23% ↑</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Requests", value: "47" },
                    { label: "Completed", value: "42" },
                    { label: "Rating", value: "4.9" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-3 rounded-xl bg-surface-50"
                    >
                      <p className="text-xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-foreground/60">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Recent Requests
                  </p>
                  {[
                    { service: "Airport Transfer", guest: "John D.", status: "Completed" },
                    { service: "Grocery Pre-stock", guest: "Maria S.", status: "Pending" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-surface-50"
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {item.service}
                        </p>
                        <p className="text-xs text-foreground/60">{item.guest}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Revenue Up
                  </p>
                  <p className="text-xs text-green-600">+€320 this week</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              {t("title")}
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              {t("description")}
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-foreground font-medium">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              {t("cta")}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { ForHosts };
