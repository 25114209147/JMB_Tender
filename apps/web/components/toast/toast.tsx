/**
 * Usage examples:
 * ```ts
 * toast.success("Tender created!")
 * toast.error("Failed to submit")
 * toast.info("New bid received")
 * toast.warning("Weights must sum to 100%")
 * ```
 */

import { toast as sonnerToast } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";

type ToastOptions = {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  cancel?: string | {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
};

const defaultOptions = {
  duration: 5000,
};

// Custom icons for each type (optional but improves UX)
const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />,
  error: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
  info: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
  loading: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
};

// Toast styles with light, visible backgrounds in dark mode
const toastStyles = {
  success:
    "border-green-200 bg-green-50 text-green-900 ",
  error:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-400 dark:text-red-950",
  info:
    "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-400 dark:text-blue-950",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-400 dark:text-amber-950",
};


// Helper to normalize cancel option for Sonner
const normalizeCancel = (cancel?: string | { label: string; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }): string | { label: string; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void } | undefined => {
  if (!cancel) return undefined
  if (typeof cancel === "string") return cancel
  // Ensure onClick is always defined (required by Sonner)
  return {
    label: cancel.label,
    onClick: cancel.onClick || (() => {}),
  }
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      ...defaultOptions,
      icon: icons.success,
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      cancel: normalizeCancel(options?.cancel),
      className: toastStyles.success,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      ...defaultOptions,
      icon: icons.error,
      description: options?.description,
      duration: options?.duration || 6000, // longer for errors
      action: options?.action,
      cancel: normalizeCancel(options?.cancel),
      className: toastStyles.error,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      ...defaultOptions,
      icon: icons.info,
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      cancel: normalizeCancel(options?.cancel),
      className: toastStyles.info,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      ...defaultOptions,
      icon: icons.warning,
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action,
      cancel: normalizeCancel(options?.cancel),
      className: toastStyles.warning,
    });
  },

  default: (message: string, options?: ToastOptions) => {
    return sonnerToast(message, {
      ...defaultOptions,
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      cancel: normalizeCancel(options?.cancel),
      className: "border-border bg-background text-foreground shadow-md dark:bg-gray-800 dark:text-gray-100",
    });
  },

  loading: (message: string, options?: Omit<ToastOptions, "action" | "cancel">) => {
    return sonnerToast.loading(message, {
      ...defaultOptions,
      icon: icons.loading,
      description: options?.description,
      duration: options?.duration || Infinity,
      className: "border-border bg-background text-foreground shadow-md dark:bg-gray-800 dark:text-gray-100",
    });
  },

  dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),

  // Optional: promise helper with auto success/error
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    },
    options?: Omit<ToastOptions, "description" | "action" | "cancel">
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...defaultOptions,
      ...options,
    });
  },
};