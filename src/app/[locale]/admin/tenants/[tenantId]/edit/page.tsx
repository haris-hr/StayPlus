"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { TenantEditorForm } from "@/components/admin";
import { useTenantsStore } from "@/hooks";
import { Link, useRouter } from "@/i18n/routing";
import type { Tenant } from "@/types";

export default function EditTenantPage() {
  const t = useTranslations("admin");
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as string;

  const { getTenantById, updateTenant, deleteTenant } = useTenantsStore();
  const tenant = getTenantById(tenantId) || null;

  const handleSave = async (data: Partial<Tenant>) => {
    await updateTenant(tenantId, data);
    router.push("/admin/tenants");
  };

  const handleDelete = async () => {
    await deleteTenant(tenantId);
    router.push("/admin/tenants");
  };

  if (!tenant) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("tenantNotFoundTitle")}</h1>
        <p className="text-foreground/60 mb-6">
          {t("tenantNotFoundDescription")}
        </p>
        <Link href="/admin/tenants" className="text-primary-600 hover:text-primary-700 font-medium">
          ← {t("backToTenants")}
        </Link>
      </div>
    );
  }

  return (
    <TenantEditorForm
      mode="edit"
      tenant={tenant}
      onSubmit={handleSave}
      onDelete={handleDelete}
    />
  );
}

