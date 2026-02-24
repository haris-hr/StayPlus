"use client";

import { TenantEditorForm } from "@/components/admin";
import { useTenantsStore } from "@/hooks";
import { useRouter } from "@/i18n/routing";
import type { Tenant } from "@/types";

export default function NewTenantPage() {
  const router = useRouter();
  const { addTenant } = useTenantsStore();

  const handleCreate = async (data: Partial<Tenant>) => {
    const now = new Date();
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      slug: data.slug!,
      name: data.name!,
      description: data.description,
      branding: data.branding || {},
      contact: data.contact || { email: "" },
      active: data.active ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await addTenant(newTenant);
    router.push("/admin/tenants");
  };

  return <TenantEditorForm mode="create" onSubmit={handleCreate} />;
}

