"use client";

import { forwardRef, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = "md", src, alt, fallback, ...props }, ref) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
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
      <img
        ref={ref}
        src={src}
        alt={alt || "Avatar"}
        className={cn(
          "rounded-full object-cover bg-surface-100",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
