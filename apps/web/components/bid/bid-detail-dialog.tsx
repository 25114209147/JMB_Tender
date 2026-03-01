/**
 * Bid Detail Dialog Component
 * 
 * Displays full bid details in a dialog/modal
 */

"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Building2, DollarSign, Calendar, Clock, FileText, Mail, Phone, Globe, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import type { Bid } from "@/data/bids/bid-types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BidDetailDialogProps {
  bid: Bid
  trigger?: React.ReactNode
}

export function BidDetailDialog({ bid, trigger }: BidDetailDialogProps) {
  const statusColors = {
    submitted: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    awarded: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    withdrawn: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700",
  }

  const statusIcons = {
    submitted: Clock,
    awarded: CheckCircle2,
    rejected: XCircle,
    withdrawn: AlertCircle,
  }

  const StatusIcon = statusIcons[bid.status] || Clock

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="w-9 sm:w-auto px-0 sm:px-3 gap-1.5 cursor-pointer">
            <Eye className="h-3.5 w-3.5 " />
            <span className="hidden sm:inline">View Details</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                statusColors[bid.status] || statusColors.submitted,
                "shrink-0 text-xs px-2 py-0.5 font-medium w-fit flex items-center gap-1"
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {bid.status.toUpperCase()}
            </Badge>
            <DialogTitle className="flex-1 line-clamp-2">{bid.tender_title}</DialogTitle>
          </div>
          <DialogDescription>
            Bid submitted by {bid.company_name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Company Name</p>
                <p className="text-base break-words">{bid.company_name || <span className="text-muted-foreground italic">Not provided</span>}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Registration Number</p>
                <p className="text-base break-words">{bid.company_registration || <span className="text-muted-foreground italic">Not provided</span>}</p>
              </div>
              <div className="md:col-span-2 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Company Address</p>
                <p className="text-base break-words">{bid.company_address || <span className="text-muted-foreground italic">Not provided</span>}</p>
              </div>
              {bid.company_website && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Website
                  </p>
                  <a 
                    href={bid.company_website.startsWith("http") ? bid.company_website : `https://${bid.company_website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-primary hover:underline break-all cursor-pointer"
                  >
                    {bid.company_website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Contact Person</p>
                <p className="text-base break-words">{bid.contact_person_name || <span className="text-muted-foreground italic">Not provided</span>}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                  <Phone className="h-4 w-4 shrink-0" />
                  Phone
                </p>
                <p className="text-base break-words">{bid.contact_person_phone || <span className="text-muted-foreground italic">Not provided</span>}</p>
              </div>
              <div className="md:col-span-2 min-w-0">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                  <Mail className="h-4 w-4 shrink-0" />
                  Email
                </p>
                <p className="text-base break-words">{bid.contact_person_email || <span className="text-muted-foreground italic">Not provided</span>}</p>
              </div>
            </div>
          </div>

          {/* Bid Details */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Bid Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Proposed Amount</p>
                <p className="text-2xl font-bold break-words">
                  RM {bid.proposed_amount.toLocaleString()}
                  {bid.include_sst && <span className="text-sm text-muted-foreground ml-1">(incl. SST)</span>}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                  <Calendar className="h-4 w-4 shrink-0" />
                  Submitted Date
                </p>
                <p className="text-base font-semibold break-words">
                  {format(new Date(bid.created_at), "MMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
              {bid.proposed_timeline && (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                    <Clock className="h-4 w-4 shrink-0" />
                    Proposed Timeline
                  </p>
                  <p className="text-base font-semibold break-words">{bid.proposed_timeline}</p>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Payment Terms</p>
                <p className="text-base break-words">{bid.payment_terms || <span className="text-muted-foreground italic">Not specified</span>}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Validity Period</p>
                <p className="text-base break-words">{bid.validity_period_days || 0} days</p>
              </div>
            </div>
          </div>

          {/* Methodology */}
          {bid.methodology && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Methodology
              </h3>
              <p className="text-base whitespace-pre-wrap break-words">{bid.methodology}</p>
            </div>
          )}

          {/* Supporting Documents */}
          {bid.supporting_documents && bid.supporting_documents.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Supporting Documents
              </h3>
              <div className="space-y-2">
                {bid.supporting_documents.map((doc, index) => {
                  // Check if doc is a URL
                  const isUrl = doc.startsWith("http://") || doc.startsWith("https://") || doc.startsWith("www.")
                  const docUrl = isUrl 
                    ? (doc.startsWith("www.") ? `https://${doc}` : doc)
                    : null

                  return (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded hover:bg-accent transition-colors">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      {docUrl ? (
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex-1 cursor-pointer break-all"
                        >
                          {doc}
                        </a>
                      ) : (
                        <span className="text-sm flex-1">{doc}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Link href={`/tenders/${bid.tender_id}`}>
              <Button variant="outline" className="cursor-pointer">
                View Tender
              </Button>
            </Link>
            {bid.updated_at && (
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(bid.updated_at), "MMM dd, yyyy")}
              </p>
            )}
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
