"use client";

import { useState, useEffect, useCallback } from "react";
import type { Tenant } from "@/types";
import {
  subscribeTenants,
  createTenant,
  updateTenant as updateTenantInDb,
  deleteTenant as deleteTenantInDb,
} from "@/lib/firebase/firestore";
import {
  FIRESTORE_LISTENER_ERROR_EVENT,
  type FirestoreListenerErrorDetail,
} from "@/lib/firebase/listenerErrors";

export function useTenantsStore() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeTenants((updatedTenants) => {
      setTenants(updatedTenants);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for Firestore permission/config errors from realtime listeners
  useEffect(() => {
    const handler = (event: Event) => {
      const { detail } = event as CustomEvent<FirestoreListenerErrorDetail>;
      if (!detail || detail.context !== "tenants") return;

      const message =
        detail.code === "permission-denied"
          ? "Firestore permission denied. Update Firestore Rules or enable real admin auth."
          : detail.message || "Failed to load tenants";
      setError(message);
      setIsLoading(false);
    };

    window.addEventListener(FIRESTORE_LISTENER_ERROR_EVENT, handler);
    return () => window.removeEventListener(FIRESTORE_LISTENER_ERROR_EVENT, handler);
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
      await createTenant(tenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add tenant");
      throw err;
    }
  }, []);

  const updateTenant = useCallback(async (tenantId: string, data: Partial<Tenant>) => {
    try {
      await updateTenantInDb(tenantId, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tenant");
      throw err;
    }
  }, []);

  const deleteTenant = useCallback(async (tenantId: string) => {
    try {
      await deleteTenantInDb(tenantId);
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
