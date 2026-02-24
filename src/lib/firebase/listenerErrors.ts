export const FIRESTORE_LISTENER_ERROR_EVENT = "stayplus:firestore-listener-error";

export type FirestoreListenerErrorDetail = {
  context: string;
  code?: string;
  message: string;
};

export function emitFirestoreListenerError(context: string, err: unknown) {
  if (typeof window === "undefined") return;

  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code?: unknown }).code)
      : undefined;
  const message =
    err && typeof err === "object" && "message" in err
      ? String((err as { message?: unknown }).message)
      : "Firestore listener error";

  const detail: FirestoreListenerErrorDetail = { context, code, message };
  window.dispatchEvent(new CustomEvent(FIRESTORE_LISTENER_ERROR_EVENT, { detail }));
}

