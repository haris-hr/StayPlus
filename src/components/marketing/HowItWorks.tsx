"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, MousePointerClick, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const t = useTranslations("home.howItWorks");

  const steps = [
    {
      icon: Search,
      key: "step1",
      number: "01",
      color: "from-primary-500 to-primary-600",
    },
    {
      icon: MousePointerClick,
      key: "step2",
      number: "02",
      color: "from-accent-500 to-accent-600",
    },
    {
      icon: CheckCircle,
      key: "step3",
      number: "03",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-surface-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-green-200 -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow relative z-10">
                  {/* Number badge */}
                  <div
                    className={`absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold shadow-lg`}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t(`${step.key}.title`)}
                  </h3>
                  <p className="text-foreground/60 leading-relaxed">
                    {t(`${step.key}.description`)}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center">
                      <span className="text-foreground/40">↓</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };
