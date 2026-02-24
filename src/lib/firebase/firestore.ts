import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  writeBatch,
  Timestamp,
  type Unsubscribe,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { getDb } from "./config";
import type { Tenant, Service, ServiceCategory, ServiceRequest, RequestStatus } from "@/types";
import { tenants as seedTenantsRecord } from "@/data/tenants";
import { allServices as seedServices } from "@/data/services";
import { categories as seedCategoriesData } from "@/data/categories";
import { emitFirestoreListenerError } from "./listenerErrors";

// Convert tenants record to array
const seedTenants = Object.values(seedTenantsRecord);

// Collection names
const TENANTS_COLLECTION = "tenants";
const SERVICES_COLLECTION = "services";
const CATEGORIES_COLLECTION = "categories";
const REQUESTS_COLLECTION = "requests";

// Helper to convert Firestore timestamps to Dates
function convertTimestamps<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data };
  for (const key in result) {
    const value = result[key];
    if (value instanceof Timestamp) {
      (result as Record<string, unknown>)[key] = value.toDate();
    }
  }
  return result;
}

// Helper to convert Dates to Firestore timestamps and remove `undefined` values (Firestore rejects undefined)
function prepareForFirestore<T>(data: T): T {
  const transform = (value: unknown): unknown => {
    if (value === undefined) return undefined;
    if (value instanceof Date) return Timestamp.fromDate(value);
    if (value instanceof Timestamp) return value;

    if (Array.isArray(value)) {
      // Firestore arrays cannot contain `undefined` either
      return value
        .map((v) => transform(v))
        .filter((v) => v !== undefined);
    }

    if (value !== null && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(obj)) {
        const v = transform(obj[k]);
        if (v !== undefined) out[k] = v;
      }
      return out;
    }

    return value;
  };

  return transform(data) as T;
}

// ==================== TENANTS ====================

export async function getAllTenants(): Promise<Tenant[]> {
  const db = await getDb();
  const snapshot = await getDocs(collection(db, TENANTS_COLLECTION));
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Tenant);
}

export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  const db = await getDb();
  const docRef = doc(db, TENANTS_COLLECTION, tenantId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return convertTimestamps({ ...snapshot.data(), id: snapshot.id }) as Tenant;
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const db = await getDb();
  const q = query(collection(db, TENANTS_COLLECTION), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return convertTimestamps({ ...doc.data(), id: doc.id }) as Tenant;
}

export async function createTenant(tenant: Tenant): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, TENANTS_COLLECTION, tenant.id);
  await setDoc(docRef, prepareForFirestore(tenant as unknown as Record<string, unknown>));
}

export async function updateTenant(tenantId: string, data: Partial<Tenant>): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, TENANTS_COLLECTION, tenantId);
  await updateDoc(docRef, prepareForFirestore({ ...data, updatedAt: new Date() } as unknown as Record<string, unknown>));
}

export async function deleteTenant(tenantId: string): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, TENANTS_COLLECTION, tenantId);
  await deleteDoc(docRef);
}

export function subscribeTenants(callback: (tenants: Tenant[]) => void): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    const q = query(collection(db, TENANTS_COLLECTION), orderBy("createdAt", "desc"));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tenants = snapshot.docs.map(
          (doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Tenant
        );
        callback(tenants);
      },
      (error) => {
        emitFirestoreListenerError("tenants", error);
        callback([]);
      }
    );
  }).catch((error) => {
    emitFirestoreListenerError("tenants", error);
    callback([]);
  });
  
  return () => unsubscribe();
}

// ==================== SERVICES ====================

export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  const snapshot = await getDocs(collection(db, SERVICES_COLLECTION));
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Service);
}

export async function getServiceById(serviceId: string): Promise<Service | null> {
  const db = await getDb();
  const docRef = doc(db, SERVICES_COLLECTION, serviceId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return convertTimestamps({ ...snapshot.data(), id: snapshot.id }) as Service;
}

export async function getServicesByTenantId(tenantId: string): Promise<Service[]> {
  const db = await getDb();
  const q = query(
    collection(db, SERVICES_COLLECTION),
    where("tenantId", "==", tenantId),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Service);
}

export async function getServicesPage(params: {
  pageSize?: number;
  tenantId?: string;
  categoryId?: string;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<{
  services: Service[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const db = await getDb();
  const pageSize = params.pageSize ?? 10;

  const constraints = [];
  if (params.tenantId) constraints.push(where("tenantId", "==", params.tenantId));
  if (params.categoryId) constraints.push(where("categoryId", "==", params.categoryId));

  // Stable ordering for pagination
  constraints.push(orderBy("createdAt", "desc"));

  if (params.cursor) {
    constraints.push(startAfter(params.cursor));
  }

  // Fetch one extra doc to know if there's another page.
  constraints.push(limit(pageSize + 1));

  const q = query(collection(db, SERVICES_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;

  const hasMore = docs.length > pageSize;
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;
  const nextCursor = hasMore ? pageDocs[pageDocs.length - 1] : null;

  const services = pageDocs.map((d) =>
    convertTimestamps({ ...d.data(), id: d.id }) as Service
  );

  return { services, nextCursor, hasMore };
}

export async function createService(service: Service): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, SERVICES_COLLECTION, service.id);
  await setDoc(docRef, prepareForFirestore(service as unknown as Record<string, unknown>));
}

export async function updateService(serviceId: string, data: Partial<Service>): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, SERVICES_COLLECTION, serviceId);
  await updateDoc(docRef, prepareForFirestore({ ...data, updatedAt: new Date() } as unknown as Record<string, unknown>));
}

export async function deleteService(serviceId: string): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, SERVICES_COLLECTION, serviceId);
  await deleteDoc(docRef);
}

export function subscribeServices(callback: (services: Service[]) => void): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    unsubscribe = onSnapshot(
      collection(db, SERVICES_COLLECTION),
      (snapshot) => {
        const services = snapshot.docs.map(
          (doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Service
        );
        callback(services);
      },
      (error) => {
        emitFirestoreListenerError("services", error);
        callback([]);
      }
    );
  }).catch((error) => {
    emitFirestoreListenerError("services", error);
    callback([]);
  });
  
  return () => unsubscribe();
}

export function subscribeServicesByTenant(
  tenantId: string,
  callback: (services: Service[]) => void
): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    const q = query(
      collection(db, SERVICES_COLLECTION),
      where("tenantId", "==", tenantId),
      orderBy("order", "asc")
    );
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const services = snapshot.docs.map(
          (doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Service
        );
        callback(services);
      },
      (error) => {
        emitFirestoreListenerError("services", error);
        callback([]);
      }
    );
  }).catch((error) => {
    emitFirestoreListenerError("services", error);
    callback([]);
  });
  
  return () => unsubscribe();
}

// ==================== SEEDING ====================

export async function seedDatabase(): Promise<{ tenants: number; services: number }> {
  const db = await getDb();
  
  // Check if already seeded
  const tenantsSnapshot = await getDocs(collection(db, TENANTS_COLLECTION));
  if (!tenantsSnapshot.empty) {
    return { tenants: 0, services: 0 };
  }
  
  // Seed tenants
  const tenantsBatch = writeBatch(db);
  for (const tenant of seedTenants) {
    const docRef = doc(db, TENANTS_COLLECTION, tenant.id);
    tenantsBatch.set(docRef, prepareForFirestore(tenant as unknown as Record<string, unknown>));
  }
  await tenantsBatch.commit();
  
  // Seed services (in batches of 500 - Firestore limit)
  const serviceChunks = [];
  for (let i = 0; i < seedServices.length; i += 500) {
    serviceChunks.push(seedServices.slice(i, i + 500));
  }
  
  for (const chunk of serviceChunks) {
    const servicesBatch = writeBatch(db);
    for (const service of chunk) {
      const docRef = doc(db, SERVICES_COLLECTION, service.id);
      servicesBatch.set(docRef, prepareForFirestore(service as unknown as Record<string, unknown>));
    }
    await servicesBatch.commit();
  }
  
  return { tenants: seedTenants.length, services: seedServices.length };
}

export async function resetDatabase(): Promise<void> {
  const db = await getDb();
  
  // Delete all tenants
  const tenantsSnapshot = await getDocs(collection(db, TENANTS_COLLECTION));
  const tenantsBatch = writeBatch(db);
  tenantsSnapshot.docs.forEach((doc) => tenantsBatch.delete(doc.ref));
  await tenantsBatch.commit();
  
  // Delete all services (in batches)
  const servicesSnapshot = await getDocs(collection(db, SERVICES_COLLECTION));
  const serviceChunks = [];
  const serviceDocs = servicesSnapshot.docs;
  for (let i = 0; i < serviceDocs.length; i += 500) {
    serviceChunks.push(serviceDocs.slice(i, i + 500));
  }
  
  for (const chunk of serviceChunks) {
    const servicesBatch = writeBatch(db);
    chunk.forEach((doc) => servicesBatch.delete(doc.ref));
    await servicesBatch.commit();
  }
  
  // Re-seed
  await seedDatabase();
}

// ==================== CATEGORIES ====================

export async function getAllCategories(): Promise<ServiceCategory[]> {
  const db = await getDb();
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as ServiceCategory);
}

export async function getCategoryById(categoryId: string): Promise<ServiceCategory | null> {
  const db = await getDb();
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), id: snapshot.id } as ServiceCategory;
}

export async function createCategory(category: ServiceCategory): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
  await setDoc(docRef, category);
}

export async function updateCategory(categoryId: string, data: Partial<ServiceCategory>): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await updateDoc(docRef, data as Record<string, unknown>);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await deleteDoc(docRef);
}

export function subscribeCategories(callback: (categories: ServiceCategory[]) => void): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("order", "asc"));
    unsubscribe = onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map((doc) => 
        ({ ...doc.data(), id: doc.id }) as ServiceCategory
      );
      callback(categories);
    });
  });
  
  return () => unsubscribe();
}

export async function seedCategoriesCollection(): Promise<number> {
  const db = await getDb();
  
  // Check if already seeded
  const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
  if (!snapshot.empty) {
    return 0;
  }
  
  const batch = writeBatch(db);
  for (const category of seedCategoriesData) {
    const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
    batch.set(docRef, category);
  }
  await batch.commit();
  
  return seedCategoriesData.length;
}

// ==================== REQUESTS ====================

export async function getAllRequests(): Promise<ServiceRequest[]> {
  const db = await getDb();
  const q = query(collection(db, REQUESTS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as ServiceRequest);
}

export async function getRequestById(requestId: string): Promise<ServiceRequest | null> {
  const db = await getDb();
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return convertTimestamps({ ...snapshot.data(), id: snapshot.id }) as ServiceRequest;
}

export async function getRequestsByTenantId(tenantId: string): Promise<ServiceRequest[]> {
  const db = await getDb();
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    where("tenantId", "==", tenantId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as ServiceRequest);
}

export async function getRequestsByStatus(status: RequestStatus): Promise<ServiceRequest[]> {
  const db = await getDb();
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as ServiceRequest);
}

export async function createRequest(request: ServiceRequest): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, REQUESTS_COLLECTION, request.id);
  await setDoc(docRef, prepareForFirestore(request as unknown as Record<string, unknown>));
}

export async function updateRequest(requestId: string, data: Partial<ServiceRequest>): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, prepareForFirestore({ ...data, updatedAt: new Date() } as unknown as Record<string, unknown>));
}

export async function updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
  return updateRequest(requestId, { status });
}

export async function deleteRequest(requestId: string): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  await deleteDoc(docRef);
}

export function subscribeRequests(callback: (requests: ServiceRequest[]) => void): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    const q = query(collection(db, REQUESTS_COLLECTION), orderBy("createdAt", "desc"));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map(
          (doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as ServiceRequest
        );
        callback(requests);
      },
      (error) => {
        emitFirestoreListenerError("requests", error);
        callback([]);
      }
    );
  }).catch((error) => {
    emitFirestoreListenerError("requests", error);
    callback([]);
  });
  
  return () => unsubscribe();
}

export function subscribeRequestsByTenant(
  tenantId: string,
  callback: (requests: ServiceRequest[]) => void
): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    const q = query(
      collection(db, REQUESTS_COLLECTION),
      where("tenantId", "==", tenantId),
      orderBy("createdAt", "desc")
    );
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map(
          (doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as ServiceRequest
        );
        callback(requests);
      },
      (error) => {
        emitFirestoreListenerError("requests", error);
        callback([]);
      }
    );
  }).catch((error) => {
    emitFirestoreListenerError("requests", error);
    callback([]);
  });
  
  return () => unsubscribe();
}

// Seed sample requests for demo purposes
export async function seedRequests(): Promise<number> {
  const db = await getDb();
  
  // Check if already seeded
  const snapshot = await getDocs(collection(db, REQUESTS_COLLECTION));
  if (!snapshot.empty) {
    return 0;
  }
  
  const sampleRequests: ServiceRequest[] = [
    {
      id: "req-001",
      tenantId: "sunny-sarajevo",
      serviceId: "sunny-sarajevo-airport-transfer",
      serviceName: { en: "Airport Transfer", bs: "Aerodromski Transfer" },
      categoryId: "transport",
      guestName: "John Smith",
      guestEmail: "john@example.com",
      status: "pending",
      currency: "EUR",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date(),
    },
    {
      id: "req-002",
      tenantId: "sunny-sarajevo",
      serviceId: "sunny-sarajevo-breakfast",
      serviceName: { en: "Breakfast", bs: "Doručak" },
      categoryId: "food",
      guestName: "Maria Garcia",
      guestEmail: "maria@example.com",
      guestPhone: "+387 61 234 567",
      status: "confirmed",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      time: "08:00",
      currency: "EUR",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      updatedAt: new Date(),
    },
    {
      id: "req-003",
      tenantId: "sunny-sarajevo",
      serviceId: "sunny-sarajevo-erma-safari",
      serviceName: { en: "Erma Safari", bs: "Erma Safari" },
      categoryId: "tours",
      guestName: "Alex Johnson",
      status: "completed",
      selectedTier: "Premium",
      price: 75,
      currency: "EUR",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      updatedAt: new Date(),
    },
    {
      id: "req-004",
      tenantId: "sunny-sarajevo",
      serviceId: "sunny-sarajevo-romantic-setup",
      serviceName: { en: "Romantic Setup", bs: "Romantična Priprema" },
      categoryId: "special",
      guestName: "Michael Brown",
      guestEmail: "michael@example.com",
      status: "in_progress",
      notes: "Anniversary celebration, please add extra candles",
      currency: "EUR",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      updatedAt: new Date(),
    },
    {
      id: "req-005",
      tenantId: "sunny-sarajevo",
      serviceId: "sunny-sarajevo-shopping-run",
      serviceName: { en: "Shopping Run", bs: "Kupovina" },
      categoryId: "convenience",
      guestName: "Sarah Wilson",
      guestEmail: "sarah@example.com",
      status: "cancelled",
      notes: "Guest cancelled - no longer needed",
      currency: "EUR",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      updatedAt: new Date(),
    },
  ];
  
  const batch = writeBatch(db);
  for (const request of sampleRequests) {
    const docRef = doc(db, REQUESTS_COLLECTION, request.id);
    batch.set(docRef, prepareForFirestore(request as unknown as Record<string, unknown>));
  }
  await batch.commit();
  
  return sampleRequests.length;
}
