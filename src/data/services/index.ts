import type { Service } from "@/types";
import { sunnySarajevoServices } from "./sunny-sarajevo";
import { mountainViewServices } from "./mountain-view";

// Create Dobrinja services as a copy of Sunny Sarajevo with different tenant ID
const dobrinjaServices: Service[] = sunnySarajevoServices.map((service) => ({
  ...service,
  id: `dobrinja-${service.id}`,
  tenantId: "dobrinja-apartments",
}));

// All services combined
export const allServices: Service[] = [
  ...sunnySarajevoServices,
  ...mountainViewServices,
  ...dobrinjaServices,
];

// Get services by tenant ID
export const getServicesByTenantId = (tenantId: string): Service[] => {
  return allServices.filter((s) => s.tenantId === tenantId && s.active);
};

// Get service by ID
export const getServiceById = (id: string): Service | undefined => {
  return allServices.find((s) => s.id === id);
};

// Get featured services for a tenant
export const getFeaturedServices = (tenantId: string): Service[] => {
  return allServices.filter((s) => s.tenantId === tenantId && s.featured && s.active);
};

// Get services by category
export const getServicesByCategory = (tenantId: string, categoryId: string): Service[] => {
  return allServices.filter(
    (s) => s.tenantId === tenantId && s.categoryId === categoryId && s.active
  );
};

// Export individual tenant services for direct access
export { sunnySarajevoServices, mountainViewServices, dobrinjaServices };
