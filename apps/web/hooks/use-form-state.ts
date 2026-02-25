import { useState, useCallback } from "react"

/**
 * Generic form state management hook
 * 
 * @param initialData - Initial form data
 * @returns Form state and update functions
 * 
 * @example
 * ```tsx
 * const { formData, updateField, setFormData, resetForm } = useFormState(defaultBidFormValues)
 * 
 * <Input value={formData.company_name} onChange={(e) => updateField("company_name", e.target.value)} />
 * ```
 */
export function useFormState<T extends Record<string, any>>(initialData: T) {
  const [formData, setFormData] = useState<T>(initialData)

  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const resetForm = useCallback(() => {
    setFormData(initialData)
  }, [initialData])

  const loadData = useCallback((data: T) => {
    setFormData(data)
  }, [])

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    loadData,
  }
}
