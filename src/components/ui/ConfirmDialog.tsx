"use client";

import { ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isConfirmLoading?: boolean;
  variant?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirmLoading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      description={typeof description === "string" ? description : undefined}
      closeOnOverlayClick={!isConfirmLoading}
    >
      {description && typeof description !== "string" ? (
        <div className="text-sm text-foreground/70">{description}</div>
      ) : null}

      <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isConfirmLoading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          isLoading={isConfirmLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

