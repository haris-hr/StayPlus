"use client";

import { useCallback, useMemo } from "react";
import type { Service, ServiceTier } from "@/types";
import { allServices as seedServices } from "@/data/services";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const STORAGE_KEY = "stayplus.services.v1";

function reviveDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

function reviveTier(value: unknown): ServiceTier | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const id = v.id;
  const name = v.name;
  if (typeof id !== "string" || !name || typeof name !== "object") return null;

  return {
    id,
    name: name as ServiceTier["name"],
    price: typeof v.price === "number" ? v.price : undefined,
    description: v.description as ServiceTier["description"],
  };
}

function reviveService(value: unknown): Service | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;

  const id = v.id;
  const tenantId = v.tenantId;
  const categoryId = v.categoryId;
  const name = v.name;
  const description = v.description;
  const pricingType = v.pricingType;
  const currency = v.currency;

  if (
    typeof id !== "string" ||
    typeof tenantId !== "string" ||
    typeof categoryId !== "string" ||
    !name ||
    typeof name !== "object" ||
    !description ||
    typeof description !== "object" ||
    typeof pricingType !== "string" ||
    typeof currency !== "string"
  ) {
    return null;
  }

  const tiersRaw = v.tiers;
  const tiers = Array.isArray(tiersRaw)
    ? tiersRaw.map(reviveTier).filter((t): t is ServiceTier => Boolean(t))
    : undefined;

  const createdAt = reviveDate(v.createdAt);
  const updatedAt = reviveDate(v.updatedAt);

  return {
    id,
    tenantId,
    categoryId,
    name: name as Service["name"],
    description: description as Service["description"],
    shortDescription: v.shortDescription as Service["shortDescription"],
    image: typeof v.image === "string" ? v.image : undefined,
    icon: typeof v.icon === "string" ? v.icon : undefined,
    pricingType: pricingType as Service["pricingType"],
    price: typeof v.price === "number" ? v.price : undefined,
    currency,
    tiers: tiers && tiers.length > 0 ? tiers : undefined,
    active: Boolean(v.active),
    featured: typeof v.featured === "boolean" ? v.featured : undefined,
    order: typeof v.order === "number" ? v.order : 0,
    createdAt,
    updatedAt,
  };
}

function reviveServices(value: unknown): Service[] {
  if (!Array.isArray(value)) return [];
  return value.map(reviveService).filter((s): s is Service => Boolean(s));
}

export function useServicesStore() {
  const initialServices = useMemo(() => seedServices, []);
  const [rawServices, setRawServices] = useLocalStorage<unknown>(
    STORAGE_KEY,
    initialServices
  );

  const services = useMemo(() => {
    const revived = reviveServices(rawServices);
    return revived.length > 0 ? revived : initialServices;
  }, [rawServices, initialServices]);

  const getServiceById = useCallback(
    (serviceId: string) => services.find((s) => s.id === serviceId),
    [services]
  );

  const getServicesByTenantId = useCallback(
    (tenantId: string) => services.filter((s) => s.tenantId === tenantId),
    [services]
  );

  const addService = useCallback(
    (service: Service) => {
      setRawServices((prev: unknown) => {
        const prevServices = reviveServices(prev);
        return [...prevServices, service];
      });
    },
    [setRawServices]
  );

  const updateService = useCallback(
    (serviceId: string, patch: Partial<Service>) => {
      setRawServices((prev: unknown) => {
        const prevServices = reviveServices(prev);
        return prevServices.map((s) =>
          s.id === serviceId ? { ...s, ...patch, updatedAt: new Date() } : s
        );
      });
    },
    [setRawServices]
  );

  const deleteService = useCallback(
    (serviceId: string) => {
      setRawServices((prev: unknown) =>
        reviveServices(prev).filter((s) => s.id !== serviceId)
      );
    },
    [setRawServices]
  );

  const resetToSeed = useCallback(() => {
    setRawServices(initialServices);
  }, [setRawServices, initialServices]);

  return {
    services,
    getServiceById,
    getServicesByTenantId,
    addService,
    updateService,
    deleteService,
    resetToSeed,
  };
}

