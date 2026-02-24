import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./config";
import { getUserByEmail, createUser, updateUser } from "./collections";
import type { User, UserRole } from "@/types";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth) throw new Error("Auth not initialized");
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    
    // Check if user exists in our database
    let user = await getUserByEmail(firebaseUser.email!);
    
    if (!user) {
      // Create new user with default role (will need to be upgraded by super admin)
      const userId = await createUser({
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        role: "tenant_viewer", // Default role
        active: false, // Needs approval
      });
      
      user = {
        id: userId,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        role: "tenant_viewer",
        active: false,
        createdAt: new Date(),
      };
    } else {
      // Update last login
      await updateUser(user.id, {
        lastLoginAt: new Date(),
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  if (!auth) throw new Error("Auth not initialized");
  
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  if (!auth) return () => {};
  
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): FirebaseUser | null {
  if (!auth) return null;
  return auth.currentUser;
}

// Check if user has required role
export function hasRole(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user || !user.active) return false;
  return requiredRoles.includes(user.role);
}

// Check if user is super admin
export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, ["super_admin"]);
}

// Check if user can access tenant
export function canAccessTenant(user: User | null, tenantId: string): boolean {
  if (!user || !user.active) return false;
  if (user.role === "super_admin") return true;
  return user.tenantId === tenantId;
}
