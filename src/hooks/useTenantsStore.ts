"use client";

import { useState, useEffect, useCallback } from "react";
import type { Tenant } from "@/types";
import * as firestoreService from "@/lib/firebase/firestore";

export function useTenantsStore() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = firestoreService.subscribeTenants((updatedTenants) => {
      setTenants(updatedTenants);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getTenantById = useCallback(
    (tenantId: string) => tenants.find((t) => t.id === tenantId),
    [tenants]
  );

  const getTenantBySlug = useCallback(
    (slug: string) => tenants.find((t) => t.slug === slug),
    [tenants]
  );

  const addTenant = useCallback(async (tenant: Tenant) => {
    try {
      await firestoreService.createTenant(tenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add tenant");
      throw err;
    }
  }, []);

  const updateTenant = useCallback(async (tenantId: string, data: Partial<Tenant>) => {
    try {
      await firestoreService.updateTenant(tenantId, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tenant");
      throw err;
    }
  }, []);

  const deleteTenant = useCallback(async (tenantId: string) => {
    try {
      await firestoreService.deleteTenant(tenantId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tenant");
      throw err;
    }
  }, []);

  return {
    tenants,
    isLoading,
    error,
    getTenantById,
    getTenantBySlug,
    addTenant,
    updateTenant,
    deleteTenant,
  };
}
