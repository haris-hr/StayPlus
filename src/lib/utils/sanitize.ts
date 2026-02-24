/**
 * Input sanitization utilities for security
 */

/**
 * Sanitize a string by removing potentially dangerous characters
 * Use for user-provided text that will be displayed
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") return "";
  
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets to prevent HTML injection
    .slice(0, 10000); // Limit length to prevent DoS
}

/**
 * Sanitize a string for use in URLs/slugs
 */
export function sanitizeSlug(input: string): string {
  if (!input || typeof input !== "string") return "";
  
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-") // Only allow alphanumeric and hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .slice(0, 100);
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(input: string): string {
  if (!input || typeof input !== "string") return "";
  
  const trimmed = input.trim().toLowerCase();
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(trimmed) ? trimmed.slice(0, 254) : "";
}

/**
 * Sanitize phone number - keep only digits and common separators
 */
export function sanitizePhone(input: string): string {
  if (!input || typeof input !== "string") return "";
  
  return input
    .replace(/[^0-9+\-\s()]/g, "")
    .trim()
    .slice(0, 20);
}

/**
 * Validate and sanitize a URL
 */
export function sanitizeUrl(input: string): string {
  if (!input || typeof input !== "string") return "";
  
  try {
    const url = new URL(input.trim());
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }
    return url.toString();
  } catch {
    return "";
  }
}

/**
 * Escape HTML entities for safe display
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== "string") return "";
  
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  
  return input.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
