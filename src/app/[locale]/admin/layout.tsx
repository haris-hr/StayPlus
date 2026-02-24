"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-surface-200 px-4 h-14 flex items-center">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-surface-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
        <span className="ml-3 text-lg font-bold text-foreground">
          Stay<span className="text-primary-500">Plus</span>
        </span>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        user={user}
        onSignOut={handleSignOut}
        onMobileClose={() => setIsMobileOpen(false)}
        isMobile={isMobileOpen}
      />

      <main
        className={cn(
          "min-h-screen transition-all duration-300 pt-14 lg:pt-0",
          isCollapsed ? "lg:ml-20" : "lg:ml-[280px]"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-full">{children}</div>
      </main>
    </div>
  );
}
