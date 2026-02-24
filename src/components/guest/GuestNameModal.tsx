"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { User, ArrowRight } from "lucide-react";
import { Button, Input } from "@/components/ui";

interface GuestNameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  tenantName?: string;
}

const GuestNameModal = ({ isOpen, onSubmit, tenantName }: GuestNameModalProps) => {
  const t = useTranslations("guest");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("enterName"));
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-primary-500/90 to-accent-600/90 backdrop-blur-sm"
          />

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-3xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full"
            />
          </div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <User className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t("welcome")}
                  {tenantName && (
                    <span className="block text-lg font-normal text-foreground/60 mt-1">
                      {tenantName}
                    </span>
                  )}
                </h2>
                <p className="text-foreground/60">{t("enterName")}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder={t("namePlaceholder")}
                  error={error}
                  leftIcon={<User className="w-5 h-5" />}
                  autoFocus
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {t("continue")}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { GuestNameModal };
