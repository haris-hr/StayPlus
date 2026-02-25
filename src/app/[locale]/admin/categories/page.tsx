"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react";
import { Button, Card, Badge, Spinner, Input, Modal } from "@/components/ui";
import { getLocalizedText } from "@/lib/utils";
import type { ServiceCategory, Locale } from "@/types";
import {
  subscribeCategories,
  createCategory,
  updateCategory,
  deleteCategory as deleteFirestoreCategory,
  seedCategoriesCollection,
} from "@/lib/firebase/firestore";

const iconOptions = [
  { value: "gift", label: "Gift" },
  { value: "car", label: "Car" },
  { value: "mountain", label: "Mountain" },
  { value: "utensils", label: "Utensils" },
  { value: "heart", label: "Heart" },
  { value: "shopping", label: "Shopping" },
  { value: "shopping-bag", label: "Shopping Bag" },
  { value: "wrench", label: "Wrench" },
  { value: "camera", label: "Camera" },
  { value: "sparkles", label: "Sparkles" },
];

const iconEmojis: Record<string, string> = {
  gift: "🎁",
  car: "🚗",
  mountain: "🏔️",
  utensils: "🍽️",
  heart: "❤️",
  shopping: "🛍️",
  "shopping-bag": "🛍️",
  wrench: "🔧",
  camera: "📷",
  sparkles: "✨",
};

export default function CategoriesPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImportingDefaults, setIsImportingDefaults] = useState(false);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameBs: "",
    icon: "sparkles",
    active: true,
  });

  // Subscribe to real-time categories from Firestore
  useEffect(() => {
    const unsubscribe = subscribeCategories((updatedCategories) => {
      setCategories(updatedCategories);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (category: ServiceCategory) => {
    setEditingCategory(category);
    setFormData({
      nameEn: category.name.en,
      nameBs: category.name.bs,
      icon: category.icon,
      active: category.active,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: { en: formData.nameEn, bs: formData.nameBs },
          icon: formData.icon,
          active: formData.active,
        });
      } else {
        const newCategory: ServiceCategory = {
          id: `cat-${Date.now()}`,
          name: { en: formData.nameEn, bs: formData.nameBs },
          icon: formData.icon,
          order: categories.length + 1,
          active: formData.active,
        };
        await createCategory(newCategory);
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ nameEn: "", nameBs: "", icon: "sparkles", active: true });
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm(t("deleteCategoryPrompt"))) {
      try {
        await deleteFirestoreCategory(categoryId);
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleImportDefaults = async () => {
    setIsImportingDefaults(true);
    try {
      const importedCount = await seedCategoriesCollection();
      if (importedCount === 0) {
        alert(t("categoriesAlreadyExist"));
      } else {
        alert(t("importedDefaultCategories", { count: importedCount }));
      }
    } catch (error) {
      console.error("Failed to import default categories:", error);
      alert(error instanceof Error ? error.message : t("failedToImportDefaultCategories"));
    } finally {
      setIsImportingDefaults(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("categories")}</h1>
          <p className="text-foreground/60 mt-1">
            {t("manageCategories")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {categories.length === 0 && (
            <Button
              variant="secondary"
              onClick={handleImportDefaults}
              isLoading={isImportingDefaults}
            >
              {t("importDefaultCategories")}
            </Button>
          )}
          <Button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ nameEn: "", nameBs: "", icon: "sparkles", active: true });
              setShowForm(true);
            }}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            {t("addCategory")}
          </Button>
        </div>
      </motion.div>

      {/* Categories List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="none">
          {categories.length > 0 ? (
            <div className="divide-y divide-surface-200">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-surface-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-foreground/30 cursor-grab" />
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                      <span className="text-lg">
                        {iconEmojis[category.icon] || "✨"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {getLocalizedText(category.name, locale)}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {getLocalizedText(category.name, locale === "en" ? "bs" : "en")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={category.active ? "success" : "default"}>
                      {category.active ? t("active") : t("inactive")}
                    </Badge>
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                      aria-label={`Edit ${getLocalizedText(category.name, locale)}`}
                    >
                      <Edit2 className="w-4 h-4 text-foreground/60" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${getLocalizedText(category.name, locale)}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60 mb-4">{t("noCategoriesYet")}</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button
                  variant="secondary"
                  onClick={handleImportDefaults}
                  isLoading={isImportingDefaults}
                >
                  {t("importDefaultCategories")}
                </Button>
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({ nameEn: "", nameBs: "", icon: "sparkles", active: true });
                    setShowForm(true);
                  }}
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  {t("addYourFirstCategory")}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? t("editCategory") : t("addCategory")}
      >
        <div className="space-y-4">
          <Input
            label={t("nameEnglish")}
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            placeholder="e.g., Transport"
          />
          <Input
            label={t("nameBosnian")}
            value={formData.nameBs}
            onChange={(e) => setFormData({ ...formData, nameBs: e.target.value })}
            placeholder="e.g., Transport"
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("iconLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: icon.value })}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    formData.icon === icon.value
                      ? "border-primary-500 bg-primary-50"
                      : "border-surface-200 hover:border-surface-300"
                  }`}
                >
                  <span className="text-xl">
                    {iconEmojis[icon.value] || "✨"}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-foreground">{t("active")}</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              {editingCategory ? tc("save") : t("createCategory")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
