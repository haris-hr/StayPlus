"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

// Mock auth for development - replace with Firebase auth
const mockUser = {
  displayName: "Admin User",
  email: "admin@stayplus.com",
  photoURL: undefined as string | undefined,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<typeof mockUser | null>(null);

  useEffect(() => {
    // In production, this would check Firebase auth
    // const unsubscribe = onAuthChange(async (firebaseUser) => {
    //   if (firebaseUser) {
    //     const dbUser = await getUserByEmail(firebaseUser.email!);
    //     if (dbUser && dbUser.role === 'super_admin' && dbUser.active) {
    //       setUser(dbUser);
    //     } else {
    //       router.push('/');
    //     }
    //   } else {
    //     router.push('/');
    //   }
    //   setIsLoading(false);
    // });
    // return () => unsubscribe();

    // Mock auth for development
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 500);
  }, [router]);

  const handleSignOut = async () => {
    // In production: await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        user={user}
        onSignOut={handleSignOut}
      />
      <main
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-[280px]"
        )}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
