/**
 * Usage examples:
 * ```ts
 * import { toast } from '@/components/toast/toast'
 * 
 * toast.success('Operation completed successfully!')
 * toast.error('Something went wrong')
 * toast.info('Here is some information')
 * toast.warning('Please check your input')
 * ```
 */

import { toast as sonnerToast } from "sonner"

type ToastOptions = {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  }
  cancel?: string | {
    label: string
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  }
}

/**
 * Display a success toast notification
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    const cancelValue = typeof options?.cancel === "string" 
      ? options.cancel 
      : options?.cancel?.label
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      cancel: cancelValue,
    })
  },

  /**
   * Display an error toast notification
   */
  error: (message: string, options?: ToastOptions) => {
    const cancelValue = typeof options?.cancel === "string" 
      ? options.cancel 
      : options?.cancel?.label
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action,
      cancel: cancelValue,
    })
  },

  /**
   * Display an info toast notification
   */
  info: (message: string, options?: ToastOptions) => {
    const cancelValue = typeof options?.cancel === "string" 
      ? options.cancel 
      : options?.cancel?.label
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      cancel: cancelValue,
    })
  },

  /**
   * Display a warning toast notification
   */
  warning: (message: string, options?: ToastOptions) => {
    const cancelValue = typeof options?.cancel === "string" 
      ? options.cancel 
      : options?.cancel?.label
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      cancel: cancelValue,
    })
  },

  /**
   * Display a default toast notification
   */
  default: (message: string, options?: ToastOptions) => {
    const cancelValue = typeof options?.cancel === "string" 
      ? options.cancel 
      : options?.cancel?.label
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      cancel: cancelValue,
    })
  },

  /**
   * Display a loading toast notification
   */
  loading: (message: string, options?: Omit<ToastOptions, "action" | "cancel">) => {
    return sonnerToast.loading(message, {
      description: options?.description,
      duration: options?.duration,
    })
  },

  /**
   * Dismiss a toast by ID
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    sonnerToast.dismiss()
  },

  /**
   * Promise-based toast - shows loading, then success/error based on promise result
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: Omit<ToastOptions, "description" | "action" | "cancel">
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      duration: options?.duration,
    })
  },
}
