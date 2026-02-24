"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Save, Search, Globe } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";

// Sample translation keys for editing
const translationGroups = [
  {
    key: "common",
    label: "Common",
    translations: [
      { key: "appName", en: "StayPlus", bs: "StayPlus" },
      { key: "tagline", en: "Elevate Every Stay", bs: "Unaprijedite Svaki Boravak" },
      { key: "loading", en: "Loading...", bs: "Učitavanje..." },
      { key: "save", en: "Save", bs: "Sačuvaj" },
      { key: "cancel", en: "Cancel", bs: "Otkaži" },
    ],
  },
  {
    key: "guest",
    label: "Guest Portal",
    translations: [
      { key: "welcome", en: "Welcome", bs: "Dobrodošli" },
      { key: "enterName", en: "Enter Your Name", bs: "Unesite Vaše Ime" },
      { key: "browseServices", en: "Browse Services", bs: "Pregledaj Usluge" },
      { key: "requestService", en: "Request Service", bs: "Zatraži Uslugu" },
      { key: "submitRequest", en: "Submit Request", bs: "Pošalji Zahtjev" },
    ],
  },
  {
    key: "services",
    label: "Services",
    translations: [
      { key: "airportTransfer", en: "Airport Transfer", bs: "Aerodromski Transfer" },
      { key: "rentACar", en: "Rent a Car", bs: "Rent-a-Car" },
      { key: "breakfast", en: "Breakfast", bs: "Doručak" },
      { key: "romanticSetup", en: "Romantic Setup", bs: "Romantična Priprema" },
      { key: "dayTrip", en: "Day Trip", bs: "Jednodnevni Izlet" },
    ],
  },
];

export default function TranslationsPage() {
  const t = useTranslations("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("common");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const currentGroup = translationGroups.find((g) => g.key === selectedGroup);

  const filteredTranslations = currentGroup?.translations.filter(
    (t) =>
      t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("translations")}</h1>
          <p className="text-foreground/60 mt-1">
            Manage translations for English and Bosnian
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

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Groups */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="sm">
            <p className="text-sm font-medium text-foreground/60 mb-3 px-2">
              Translation Groups
            </p>
            <div className="space-y-1">
              {translationGroups.map((group) => (
                <button
                  key={group.key}
                  onClick={() => setSelectedGroup(group.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedGroup === group.key
                      ? "bg-primary-50 text-primary-600"
                      : "text-foreground/70 hover:bg-surface-100"
                  }`}
                >
                  <span className="font-medium">{group.label}</span>
                  <span className="text-xs text-foreground/50 ml-2">
                    ({group.translations.length})
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card>
            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Search translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Translations */}
            <div className="space-y-6">
              {filteredTranslations?.map((translation, index) => (
                <motion.div
                  key={translation.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 rounded-xl bg-surface-50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <code className="text-sm bg-surface-200 px-2 py-0.5 rounded">
                      {translation.key}
                    </code>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <span className="w-6 h-4 rounded bg-blue-100 flex items-center justify-center text-xs">
                          EN
                        </span>
                        English
                      </label>
                      <Input defaultValue={translation.en} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <span className="w-6 h-4 rounded bg-red-100 flex items-center justify-center text-xs">
                          BS
                        </span>
                        Bosanski
                      </label>
                      <Input defaultValue={translation.bs} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTranslations?.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60">No translations found</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
