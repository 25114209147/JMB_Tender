import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardHeader({
    title,
    description,
    primaryAction
}: {
    title: string
    description: string
    primaryAction?: {
        label: string
        icon: React.ReactNode
        href?: string
        onClick?: () => void
    }
}) {
    return (
<div className="flex flex-row gap-2 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        
        {primaryAction && (
          <div>
            {primaryAction.href ? (
              <Link href={primaryAction.href}>
                <Button variant="default" className="hover:cursor-pointer">
                  {primaryAction.icon}
                  {primaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button 
                variant="default" 
                className="hover:cursor-pointer"
                onClick={primaryAction.onClick}
              >
                {primaryAction.icon}
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    )
}