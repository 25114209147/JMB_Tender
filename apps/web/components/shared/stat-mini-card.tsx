"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatMiniCardProps {
  label: string
  value: string | number
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow" | "teal"
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  purple: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  orange: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  red: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  yellow: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  teal: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
}

export function StatMiniCard({ label, value, color }: StatMiniCardProps) {
  return (
    <Card className="border-muted/60">
      <CardContent className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </p>
        <p className={cn("text-lg font-extrabold truncate", colorClasses[color])}>
          {value || "—"}
        </p>
      </CardContent>
    </Card>
  )
}
