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
import type { Tenant, Service } from "@/types";
import { tenants as seedTenantsRecord } from "@/data/tenants";
import { allServices as seedServices } from "@/data/services";

// Convert tenants record to array
const seedTenants = Object.values(seedTenantsRecord);

// Collection names
const TENANTS_COLLECTION = "tenants";
const SERVICES_COLLECTION = "services";

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

// Helper to convert Dates to Firestore timestamps for storage
function prepareForFirestore<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data };
  for (const key in result) {
    const value = result[key];
    if (value instanceof Date) {
      (result as Record<string, unknown>)[key] = Timestamp.fromDate(value);
    }
  }
  return result;
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
    unsubscribe = onSnapshot(q, (snapshot) => {
      const tenants = snapshot.docs.map((doc) => 
        convertTimestamps({ ...doc.data(), id: doc.id }) as Tenant
      );
      callback(tenants);
    });
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
    unsubscribe = onSnapshot(collection(db, SERVICES_COLLECTION), (snapshot) => {
      const services = snapshot.docs.map((doc) => 
        convertTimestamps({ ...doc.data(), id: doc.id }) as Service
      );
      callback(services);
    });
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
    unsubscribe = onSnapshot(q, (snapshot) => {
      const services = snapshot.docs.map((doc) => 
        convertTimestamps({ ...doc.data(), id: doc.id }) as Service
      );
      callback(services);
    });
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
