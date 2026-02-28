import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface SummaryCardData {
  title: string
  value: number | string
  icon: LucideIcon
  link?: string
  iconColor?: string
  iconBoxColor?: string
}

interface SummaryCardsProps {
  data: SummaryCardData[]
  columns?: {
    base?: number
    md?: number
    lg?: number
  }
}

export default function SummaryCards({
  data,
  columns = { base: 1, md: 2, lg: 4 }
}: SummaryCardsProps) {
  const gridClasses = `grid grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-4`

  return (
    <div>
      <div className={gridClasses}>
        {data.map((card) => {
          const Icon = card.icon;

          const cardContent = (
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors",
                  card.iconBoxColor || "bg-muted/50",
                  card.iconColor || "text-foreground"
                )}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {card.title}
                  </span>
                </div>
              </div>
            </CardContent>
          )

          return (
            <Card key={card.title} className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {card.link ? (
                <Link href={card.link}>
                  {cardContent}
                </Link>
              ) : (
                cardContent
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}