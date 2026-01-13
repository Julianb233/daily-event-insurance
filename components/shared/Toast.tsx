"use client";

import { Toaster, toast } from "sonner";

/**
 * Toast Provider Component
 * Wraps the Sonner Toaster with consistent configuration
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: "0.5rem",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      }}
    />
  );
}

/**
 * Toast Helper Functions
 */

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  duration?: number;
  action?: ToastAction;
  description?: string;
}

/**
 * Show success toast
 */
export function showSuccess(message: string, options?: ToastOptions) {
  return toast.success(message, {
    duration: options?.duration || 4000,
    description: options?.description,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  });
}

/**
 * Show error toast
 */
export function showError(message: string, options?: ToastOptions) {
  return toast.error(message, {
    duration: options?.duration || 5000,
    description: options?.description,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  });
}

/**
 * Show warning toast
 */
export function showWarning(message: string, options?: ToastOptions) {
  return toast.warning(message, {
    duration: options?.duration || 4000,
    description: options?.description,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  });
}

/**
 * Show info toast
 */
export function showInfo(message: string, options?: ToastOptions) {
  return toast.info(message, {
    duration: options?.duration || 4000,
    description: options?.description,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  });
}

/**
 * Show loading toast (returns toast id for updating/dismissing)
 */
export function showLoading(message: string, options?: Omit<ToastOptions, "action">) {
  return toast.loading(message, {
    duration: options?.duration || Infinity,
    description: options?.description,
  });
}

/**
 * Dismiss a specific toast by id
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * Promise toast - shows loading, then success/error based on promise result
 */
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  },
  options?: ToastOptions
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    duration: options?.duration,
  });
}
