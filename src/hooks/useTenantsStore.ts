"use client";

import { useCallback, useMemo } from "react";
import type { Tenant } from "@/types";
import { getAllTenants } from "@/data/tenants";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const STORAGE_KEY = "stayplus.tenants.v1";

function reviveDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

function reviveTenant(value: unknown): Tenant | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;

  const id = v.id;
  const slug = v.slug;
  const name = v.name;
  if (typeof id !== "string" || typeof slug !== "string" || typeof name !== "string") {
    return null;
  }

  const description = v.description;
  const branding = v.branding;
  const contact = v.contact;
  const active = v.active;
  const createdAt = v.createdAt;
  const updatedAt = v.updatedAt;

  return {
    id,
    slug,
    name,
    description: description as Tenant["description"],
    branding: (branding ?? {}) as Tenant["branding"],
    contact: (contact ?? { email: "" }) as Tenant["contact"],
    active: Boolean(active),
    createdAt: reviveDate(createdAt),
    updatedAt: reviveDate(updatedAt),
  };
}

function reviveTenants(value: unknown): Tenant[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(reviveTenant)
    .filter((t): t is Tenant => Boolean(t));
}

export function useTenantsStore() {
  const initialTenants = useMemo(() => getAllTenants(), []);
  const [rawTenants, setRawTenants] = useLocalStorage<unknown>(
    STORAGE_KEY,
    initialTenants
  );

  const tenants = useMemo(() => {
    const revived = reviveTenants(rawTenants);
    // If storage is empty/corrupt, fall back to initial data.
    return revived.length > 0 ? revived : initialTenants;
  }, [rawTenants, initialTenants]);

  const getTenantById = useCallback(
    (tenantId: string) => tenants.find((t) => t.id === tenantId),
    [tenants]
  );

  const getTenantBySlug = useCallback(
    (slug: string) => tenants.find((t) => t.slug === slug),
    [tenants]
  );

  const addTenant = useCallback(
    (tenant: Tenant) => {
      setRawTenants((prev: unknown) => {
        const prevTenants = reviveTenants(prev);
        return [...prevTenants, tenant];
      });
    },
    [setRawTenants]
  );

  const updateTenant = useCallback(
    (tenantId: string, patch: Partial<Tenant>) => {
      setRawTenants((prev: unknown) => {
        const prevTenants = reviveTenants(prev);
        return prevTenants.map((t) =>
          t.id === tenantId ? { ...t, ...patch, updatedAt: new Date() } : t
        );
      });
    },
    [setRawTenants]
  );

  const deleteTenant = useCallback(
    (tenantId: string) => {
      setRawTenants((prev: unknown) =>
        reviveTenants(prev).filter((t) => t.id !== tenantId)
      );
    },
    [setRawTenants]
  );

  const resetToSeed = useCallback(() => {
    setRawTenants(initialTenants);
  }, [setRawTenants, initialTenants]);

  return {
    tenants,
    getTenantById,
    getTenantBySlug,
    addTenant,
    updateTenant,
    deleteTenant,
    resetToSeed,
  };
}

