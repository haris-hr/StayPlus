"use client";

import { useParams } from "next/navigation";
import { TenantEditorForm } from "@/components/admin";
import { useTenantsStore } from "@/hooks";
import { Link, useRouter } from "@/i18n/routing";
import type { Tenant } from "@/types";

export default function EditTenantPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as string;

  const { getTenantById, updateTenant, deleteTenant } = useTenantsStore();
  const tenant = getTenantById(tenantId) || null;

  const handleSave = async (data: Partial<Tenant>) => {
    updateTenant(tenantId, data);
    router.push("/admin/tenants");
  };

  const handleDelete = async () => {
    deleteTenant(tenantId);
    router.push("/admin/tenants");
  };

  if (!tenant) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Tenant not found</h1>
        <p className="text-foreground/60 mb-6">
          This tenant may have been deleted or the URL is incorrect.
        </p>
        <Link href="/admin/tenants" className="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Tenants
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

