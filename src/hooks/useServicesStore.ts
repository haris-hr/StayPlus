"use client";

import { useState, useEffect, useCallback } from "react";
import type { Service } from "@/types";
import * as firestoreService from "@/lib/firebase/firestore";

export function useServicesStore() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = firestoreService.subscribeServices((updatedServices) => {
      setServices(updatedServices);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getServiceById = useCallback(
    (serviceId: string) => services.find((s) => s.id === serviceId),
    [services]
  );

  const getServicesByTenantId = useCallback(
    (tenantId: string) => services.filter((s) => s.tenantId === tenantId),
    [services]
  );

  const addService = useCallback(async (service: Service) => {
    try {
      await firestoreService.createService(service);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service");
      throw err;
    }
  }, []);

  const updateService = useCallback(async (serviceId: string, data: Partial<Service>) => {
    try {
      await firestoreService.updateService(serviceId, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service");
      throw err;
    }
  }, []);

  const deleteService = useCallback(async (serviceId: string) => {
    try {
      await firestoreService.deleteService(serviceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service");
      throw err;
    }
  }, []);

  const resetToSeed = useCallback(async () => {
    try {
      await firestoreService.resetDatabase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset database");
      throw err;
    }
  }, []);

  return {
    services,
    isLoading,
    error,
    getServiceById,
    getServicesByTenantId,
    addService,
    updateService,
    deleteService,
    resetToSeed,
  };
}
