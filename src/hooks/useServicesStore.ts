"use client";

import { useState, useEffect, useCallback } from "react";
import type { Service } from "@/types";
import {
  subscribeServices,
  createService,
  updateService as updateServiceInDb,
  deleteService as deleteServiceInDb,
  resetDatabase,
} from "@/lib/firebase/firestore";
import {
  FIRESTORE_LISTENER_ERROR_EVENT,
  type FirestoreListenerErrorDetail,
} from "@/lib/firebase/listenerErrors";

export function useServicesStore() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeServices((updatedServices) => {
      setServices(updatedServices);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for Firestore permission/config errors from realtime listeners
  useEffect(() => {
    const handler = (event: Event) => {
      const { detail } = event as CustomEvent<FirestoreListenerErrorDetail>;
      if (!detail || detail.context !== "services") return;

      const message =
        detail.code === "permission-denied"
          ? "Firestore permission denied. Update Firestore Rules or enable real admin auth."
          : detail.message || "Failed to load services";
      setError(message);
      setIsLoading(false);
    };

    window.addEventListener(FIRESTORE_LISTENER_ERROR_EVENT, handler);
    return () => window.removeEventListener(FIRESTORE_LISTENER_ERROR_EVENT, handler);
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
      await createService(service);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service");
      throw err;
    }
  }, []);

  const updateService = useCallback(async (serviceId: string, data: Partial<Service>) => {
    try {
      await updateServiceInDb(serviceId, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service");
      throw err;
    }
  }, []);

  const deleteService = useCallback(async (serviceId: string) => {
    try {
      await deleteServiceInDb(serviceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service");
      throw err;
    }
  }, []);

  const resetToSeed = useCallback(async () => {
    try {
      await resetDatabase();
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
