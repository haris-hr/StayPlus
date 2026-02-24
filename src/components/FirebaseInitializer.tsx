"use client";

import { useEffect, useState } from "react";
import { seedDatabase } from "@/lib/firebase/firestore";

/**
 * This component initializes Firebase and seeds the database if empty.
 * It should be placed in the root layout.
 */
export function FirebaseInitializer() {
  const [status, setStatus] = useState<"idle" | "seeding" | "done" | "error">("idle");

  useEffect(() => {
    const init = async () => {
      try {
        setStatus("seeding");
        const result = await seedDatabase();
        if (result.tenants > 0 || result.services > 0) {
          console.log(`✅ Database seeded: ${result.tenants} tenants, ${result.services} services`);
        }
        setStatus("done");
      } catch (error) {
        console.error("Failed to seed database:", error);
        setStatus("error");
      }
    };

    init();
  }, []);

  // This component doesn't render anything visible
  // It just handles the seeding logic
  if (process.env.NODE_ENV === "development" && status === "seeding") {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-50 animate-pulse">
        Initializing database...
      </div>
    );
  }

  return null;
}
