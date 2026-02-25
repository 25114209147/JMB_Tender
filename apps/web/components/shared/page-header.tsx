import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ReactNode } from "react"

interface PageHeaderProps {
  backHref: string
  backLabel?: string
  title?: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({
  backHref,
  backLabel = "Back",
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Back Button & Actions Row */}
      <div className="flex items-center justify-between">
        <Link
          href={backHref}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground border border-gray-200 dark:border-gray-800 rounded-md px-4 py-2 bg-gray-50 dark:bg-gray-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {backLabel}
        </Link>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Title & Description */}
      {(title || description) && (
        <div>
          {title && <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  )
}
