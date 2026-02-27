/**
 * Standardized Empty State Component
 * 
 * Usage:
 * ```tsx
 * import { EmptyState } from "@/components/ui/empty-state"
 * 
 * if (data.length === 0) {
 *   return <EmptyState 
 *     icon={FileText}
 *     title="No tenders yet"
 *     description="Get started by creating your first tender"
 *     action={<Button>Create Tender</Button>}
 *   />
 * }
 * ```
 */

import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed ${className}`}>
      <Icon className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  )
}
