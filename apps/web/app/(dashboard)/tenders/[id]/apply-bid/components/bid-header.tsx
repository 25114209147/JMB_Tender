import PageHeader from "@/components/shared/page-header"
import type { Tender } from "@/data/tenders"

interface Props {
  tender: Tender
}

export default function BidHeader({ tender }: Props) {
  return (
    <PageHeader
      backHref={`/tenders/${tender.id}`}
      backLabel="Back to Tender"
    />
  )
}
