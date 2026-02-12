import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { dashboardCardData } from "@/data/owner-dashboard-data"
import Link from "next/link"

export default function SummaryCards() {
  return (
    
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCardData.map((card) => {
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