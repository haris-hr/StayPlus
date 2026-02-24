"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Save, Globe, Bell, Palette, Shield } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";

export default function SettingsPage() {
  const t = useTranslations("admin");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("settings")}</h1>
          <p className="text-foreground/60 mt-1">
            Configure your StayPlus platform
          </p>
        </div>
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-5 h-5" />}
        >
          Save Changes
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">General</h2>
                <p className="text-sm text-foreground/60">Basic platform settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <Input
                label="Platform Name"
                defaultValue="StayPlus"
              />
              <Input
                label="Support Email"
                type="email"
                defaultValue="support@stayplus.com"
              />
              <Input
                label="Default Currency"
                defaultValue="EUR"
              />
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-foreground/60">Email and alert settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-foreground">Email on new request</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-foreground">Daily summary email</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-foreground">WhatsApp notifications</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </Card>
        </motion.div>

        {/* Branding Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Default Branding</h2>
                <p className="text-sm text-foreground/60">Default colors for new tenants</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue="#f96d4a"
                    className="w-10 h-10 rounded-lg cursor-pointer"
                  />
                  <Input defaultValue="#f96d4a" className="flex-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue="#05c7ae"
                    className="w-10 h-10 rounded-lg cursor-pointer"
                  />
                  <Input defaultValue="#05c7ae" className="flex-1" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Security</h2>
                <p className="text-sm text-foreground/60">Access and authentication</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-foreground">Require approval for new users</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-foreground">Allow Google sign-in</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
