import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Tenant,
  Service,
  ServiceCategory,
  ServiceRequest,
  User,
} from "@/types";

// Collection names
export const COLLECTIONS = {
  TENANTS: "tenants",
  SERVICES: "services",
  SERVICE_CATEGORIES: "serviceCategories",
  REQUESTS: "requests",
  USERS: "users",
} as const;

// Helper to convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData): DocumentData => {
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// ============ TENANTS ============

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  if (!db) return null;
  
  const q = query(
    collection(db, COLLECTIONS.TENANTS),
    where("slug", "==", slug),
    where("active", "==", true),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...convertTimestamp(doc.data()) } as Tenant;
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  if (!db) return null;
  
  const docRef = doc(db, COLLECTIONS.TENANTS, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...convertTimestamp(snapshot.data()) } as Tenant;
}

export async function getAllTenants(): Promise<Tenant[]> {
  if (!db) return [];
  
  const q = query(
    collection(db, COLLECTIONS.TENANTS),
    orderBy("name", "asc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamp(doc.data()),
  })) as Tenant[];
}

export async function createTenant(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = await addDoc(collection(db, COLLECTIONS.TENANTS), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  return docRef.id;
}

export async function updateTenant(id: string, data: Partial<Tenant>): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, COLLECTIONS.TENANTS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteTenant(id: string): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, COLLECTIONS.TENANTS, id);
  await deleteDoc(docRef);
}

// ============ SERVICE CATEGORIES ============

export async function getAllCategories(): Promise<ServiceCategory[]> {
  if (!db) return [];
  
  const q = query(
    collection(db, COLLECTIONS.SERVICE_CATEGORIES),
    where("active", "==", true),
    orderBy("order", "asc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ServiceCategory[];
}

export async function createCategory(data: Omit<ServiceCategory, "id">): Promise<string> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = await addDoc(collection(db, COLLECTIONS.SERVICE_CATEGORIES), data);
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<ServiceCategory>): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, COLLECTIONS.SERVICE_CATEGORIES, id);
  await updateDoc(docRef, data);
}

export async function deleteCategory(id: string): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, COLLECTIONS.SERVICE_CATEGORIES, id);
  await deleteDoc(docRef);
}

// ============ SERVICES ============

export async function getServicesByTenant(tenantId: string): Promise<Service[]> {
  if (!db) return [];
  
  const q = query(
    collection(db, COLLECTIONS.SERVICES),
    where("tenantId", "==", tenantId),
    where("active", "==", true),
    orderBy("order", "asc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamp(doc.data()),
  })) as Service[];
}

export async function getServiceById(id: string): Promise<Service | null> {
  if (!db) return null;
  
  const docRef = doc(db, COLLECTIONS.SERVICES, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...convertTimestamp(snapshot.data()) } as Service;
}

export async function getAllServices(): Promise<Service[]> {
  if (!db) return [];
  
  const q = query(
    collection(db, COLLECTIONS.SERVICES),
    orderBy("tenantId", "asc"),
    orderBy("order", "asc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamp(doc.data()),
  })) as Service[];
}

export async function createService(data: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  return docRef.id;
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, COLLECTIONS.SERVICES, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteService(id: string): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, COLLECTIONS.SERVICES, id);
  await deleteDoc(docRef);
}

// ============ REQUESTS ============

export async function getRequestsByTenant(tenantId: string, constraints?: QueryConstraint[]): Promise<ServiceRequest[]> {
  if (!db) return [];
  
  const baseConstraints = [
    where("tenantId", "==", tenantId),
    orderBy("createdAt", "desc"),
  ];
  
  const q = query(
    collection(db, COLLECTIONS.REQUESTS),
    ...baseConstraints,
    ...(constraints || [])
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamp(doc.data()),
  })) as ServiceRequest[];
}

export async function getAllRequests(constraints?: QueryConstraint[]): Promise<ServiceRequest[]> {
  if (!db) return [];
  
  const baseConstraints = [orderBy("createdAt", "desc")];
  
  const q = query(
    collection(db, COLLECTIONS.REQUESTS),
    ...baseConstraints,
    ...(constraints || [])
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamp(doc.data()),
  })) as ServiceRequest[];
}

export async function getRequestById(id: string): Promise<ServiceRequest | null> {
  if (!db) return null;
  
  const docRef = doc(db, COLLECTIONS.REQUESTS, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...convertTimestamp(snapshot.data()) } as ServiceRequest;
}

export async function createRequest(data: Omit<ServiceRequest, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = await addDoc(collection(db, COLLECTIONS.REQUESTS), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  return docRef.id;
}

export async function updateRequest(id: string, data: Partial<ServiceRequest>): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, COLLECTIONS.REQUESTS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ============ USERS ============

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!db) return null;
  
  const q = query(
    collection(db, COLLECTIONS.USERS),
    where("email", "==", email),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...convertTimestamp(userDoc.data()) } as User;
}

export async function getUserById(id: string): Promise<User | null> {
  if (!db) return null;
  
  const docRef = doc(db, COLLECTIONS.USERS, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...convertTimestamp(snapshot.data()) } as User;
}

export async function createUser(data: Omit<User, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
    ...data,
    createdAt: Timestamp.now(),
  });
  
  return docRef.id;
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
  if (!db) throw new Error("Database not initialized");
  
  const docRef = doc(db, COLLECTIONS.USERS, id);
  await updateDoc(docRef, data);
}
