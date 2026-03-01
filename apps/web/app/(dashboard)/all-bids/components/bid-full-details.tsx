"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DollarSign, Calendar, Clock, FileText, Mail, Phone, Globe } from "lucide-react"
import { format } from "date-fns"
import type { Bid } from "@/data/bids/bid-types"

interface BidFullDetailsProps {
  bid: Bid
}

export function BidFullDetails({ bid }: BidFullDetailsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Complete Bid Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Company Name</p>
              <p className="text-sm">{bid.company_name || <span className="text-muted-foreground italic">Not provided</span>}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Registration Number</p>
              <p className="text-sm">{bid.company_registration || <span className="text-muted-foreground italic">Not provided</span>}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">Company Address</p>
              <p className="text-sm">{bid.company_address || <span className="text-muted-foreground italic">Not provided</span>}</p>
            </div>
            {bid.company_website && (
              <div className="md:col-span-2">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Website
                </p>
                <a 
                  href={bid.company_website.startsWith("http") ? bid.company_website : `https://${bid.company_website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {bid.company_website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 pt-3 border-t">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Contact Person</p>
              <p className="text-sm">{bid.contact_person_name || <span className="text-muted-foreground italic">Not provided</span>}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Phone
              </p>
              <p className="text-sm">{bid.contact_person_phone || <span className="text-muted-foreground italic">Not provided</span>}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email
              </p>
              <p className="text-sm">{bid.contact_person_email || <span className="text-muted-foreground italic">Not provided</span>}</p>
            </div>
          </div>
        </div>

        {/* Bid Details */}
        <div className="space-y-3 pt-3 border-t">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Bid Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Proposed Amount</p>
              <p className="text-base font-semibold">
                RM {bid.proposed_amount.toLocaleString()}
                {bid.include_sst && <span className="text-xs text-muted-foreground ml-1">(incl. SST)</span>}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Submitted Date
              </p>
              <p className="text-sm font-semibold">
                {format(new Date(bid.created_at), "MMM dd, yyyy 'at' h:mm a")}
              </p>
            </div>
            {bid.proposed_timeline && (
              <div>
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Proposed Timeline
                </p>
                <p className="text-sm font-semibold">{bid.proposed_timeline}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground">Payment Terms</p>
              <p className="text-sm">{bid.payment_terms || <span className="text-muted-foreground italic">Not specified</span>}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Validity Period</p>
              <p className="text-sm">{bid.validity_period_days || 0} days</p>
            </div>
          </div>
        </div>

        {/* Methodology */}
        {bid.methodology && (
          <div className="space-y-3 pt-3 border-t">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Methodology
            </h4>
            <p className="text-sm whitespace-pre-wrap pl-6">{bid.methodology}</p>
          </div>
        )}

        {/* Supporting Documents */}
        {bid.supporting_documents && bid.supporting_documents.length > 0 && (
          <div className="space-y-3 pt-3 border-t">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Supporting Documents
            </h4>
            <div className="space-y-2 pl-6">
              {bid.supporting_documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.startsWith("http") ? doc : `#`}
                  target={doc.startsWith("http") ? "_blank" : undefined}
                  rel={doc.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2 p-2 border rounded text-sm hover:bg-accent transition-colors"
                >
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <span className="text-primary hover:underline">{doc}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
