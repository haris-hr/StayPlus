import { notFound } from "next/navigation";

/**
 * TEMPORARILY DISABLED
 * --------------------
 * We keep the "Settings" nav item visible (but disabled) so users know it exists,
 * however the route is restricted until we implement real persistence (Firestore)
 * and permissions.
 *
 * Re-enable by restoring the previous settings UI and wiring it to a stored config.
 */
export default function SettingsPage() {
  notFound();
}
