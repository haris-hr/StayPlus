"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  src?: string;
  alt?: string;
  className?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", src, alt, fallback }, ref) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    const pixelSizes = {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    };

    if (!src) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium",
            sizes[size],
            className
          )}
        >
          {fallback ? (
            fallback.charAt(0).toUpperCase()
          ) : (
            <User className={iconSizes[size]} />
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-full overflow-hidden bg-surface-100",
          sizes[size],
          className
        )}
      >
        <Image
          src={src}
          alt={alt || "Avatar"}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="object-cover"
        />
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
