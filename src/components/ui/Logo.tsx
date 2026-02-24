"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  variant?: "mark" | "full";
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const fullSizeMap: Record<NonNullable<LogoProps["size"]>, { w: number; h: number; className: string }> = {
  sm: { w: 140, h: 40, className: "h-8 w-auto" },
  md: { w: 180, h: 52, className: "h-10 w-auto" },
  lg: { w: 220, h: 64, className: "h-12 w-auto" },
  xl: { w: 280, h: 80, className: "h-16 w-auto" },
};

export function Logo({
  size = "md",
  className,
  showText = false,
  variant = "mark",
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {variant === "full" ? (
        <Image
          src="/brand/stayplus-logo.jpg"
          alt="StayPlus"
          width={fullSizeMap[size].w}
          height={fullSizeMap[size].h}
          priority
          className={cn(fullSizeMap[size].className, "flex-shrink-0")}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          role="img"
          aria-label="StayPlus icon"
          className={cn(sizeMap[size], "flex-shrink-0")}
        >
          <defs>
            <linearGradient
              id="spGrad"
              x1="96"
              y1="64"
              x2="416"
              y2="448"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#FF8A00" />
              <stop offset="1" stopColor="#FF3D00" />
            </linearGradient>

            <filter
              id="softShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="8"
                floodColor="#000"
                floodOpacity="0.12"
              />
            </filter>
          </defs>

          {/* Map pin (outer) */}
          <path
            filter="url(#softShadow)"
            fill="url(#spGrad)"
            d="
              M256 40
              C168.4 40 97 111.4 97 199
              c0 116.5 128 245.7 147.2 264.3
              a18 18 0 0 0 23.6 0
              C287 444.7 415 315.5 415 199
              C415 111.4 343.6 40 256 40
              Z
            "
          />

          {/* Inner cutout */}
          <path
            fill="#fff"
            opacity="0.92"
            d="
              M256 92
              C196.1 92 147 141.1 147 201
              c0 83.7 85.2 171.6 99.3 186
              a12 12 0 0 0 19.4 0
              C279.8 372.6 365 284.7 365 201
              C365 141.1 315.9 92 256 92
              Z
            "
          />

          {/* House (simple + rounded) */}
          <g fill="url(#spGrad)">
            {/* roof */}
            <path d="M166 222 L256 154 L346 222 L324 222 L256 178 L188 222 Z" />
            {/* body */}
            <path d="M196 222 H316 V316 a14 14 0 0 1 -14 14 H210 a14 14 0 0 1 -14 -14 Z" />
            {/* window */}
            <rect
              x="238"
              y="246"
              width="36"
              height="36"
              rx="6"
              fill="#fff"
              opacity="0.95"
            />
            <rect
              x="244"
              y="252"
              width="10"
              height="10"
              rx="2"
              fill="url(#spGrad)"
            />
            <rect
              x="258"
              y="252"
              width="10"
              height="10"
              rx="2"
              fill="url(#spGrad)"
            />
            <rect
              x="244"
              y="266"
              width="10"
              height="10"
              rx="2"
              fill="url(#spGrad)"
            />
            <rect
              x="258"
              y="266"
              width="10"
              height="10"
              rx="2"
              fill="url(#spGrad)"
            />
          </g>

          {/* Plus (top-right of pin) */}
          <g transform="translate(0,0)">
            <rect
              x="372"
              y="118"
              width="84"
              height="84"
              rx="22"
              fill="url(#spGrad)"
            />
            <path
              fill="#fff"
              d="M414 136 a10 10 0 0 1 10 10v16h16a10 10 0 0 1 0 20h-16v16a10 10 0 0 1-20 0v-16h-16a10 10 0 0 1 0-20h16v-16a10 10 0 0 1 10-10Z"
            />
          </g>

          {/* Plane (small, above ring area) */}
          <path
            fill="url(#spGrad)"
            d="
              M346 96
              l34 -12
              c6 -2 12 4 10 10
              l-12 34
              -10 -10
              -14 14
              -10 -10
              14 -14
              Z
            "
          />

          {/* Small sparkle dots near plus */}
          <circle cx="460" cy="220" r="6" fill="url(#spGrad)" />
          <circle cx="442" cy="242" r="4" fill="url(#spGrad)" />
        </svg>
      )}

      {showText && variant !== "full" && (
        <span className="text-lg font-bold text-foreground">
          Stay<span className="text-primary-500">Plus</span>
        </span>
      )}
    </div>
  );
}

export function LogoText({ className }: { className?: string }) {
  return (
    <span className={cn("text-lg font-bold text-foreground", className)}>
      Stay<span className="text-primary-500">Plus</span>
    </span>
  );
}
