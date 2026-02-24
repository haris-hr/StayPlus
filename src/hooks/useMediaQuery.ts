"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook that tracks a media query with proper SSR handling
 * Returns undefined during SSR/hydration, then the actual value
 */
export function useMediaQuery(query: string): boolean {
  // Start with a function to get the initial value only on client
  const getMatches = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState<boolean>(getMatches);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value after hydration
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  // Return false during SSR to match server render
  // This prevents hydration mismatch
  if (!isHydrated) return false;
  
  return matches;
}

// Predefined breakpoint hooks matching Tailwind defaults
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 640px)");
}

export function useIsTablet(): boolean {
  const isAboveMobile = useMediaQuery("(min-width: 640px)");
  const isAboveTablet = useMediaQuery("(min-width: 1024px)");
  return isAboveMobile && !isAboveTablet;
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
