import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"
import Link from "next/link"

export interface SummaryCardData {
  title: string
  value: number
  icon: LucideIcon
  link: string
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
          return (
            <Card key={card.title} className="cursor-pointer hover:bg-muted">
              <Link href={card.link}>
                <CardHeader>
                  <Icon className="w-4 h-4" />
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.value}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}