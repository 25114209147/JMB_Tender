import { Badge } from "@/components/ui/badge"

export default function getStatusBadge(status: string) {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="border-green-700 text-green-700">
            Open
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="border-yellow-600 text-yellow-600">
            Draft
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-600">
            Closed
          </Badge>
        )
      case "awarded":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Awarded
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }