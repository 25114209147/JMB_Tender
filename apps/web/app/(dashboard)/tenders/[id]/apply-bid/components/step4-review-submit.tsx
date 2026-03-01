"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, DollarSign, Calendar, FileText, AlertCircle, Receipt } from "lucide-react"
import type { BidFormData } from "@/data/bids-form"
import type { Tender } from "@/data/tenders"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface Props {
  formData: BidFormData
  updateField: <K extends keyof BidFormData>(field: K, value: BidFormData[K]) => void
  tender: Tender
}

export default function Step4ReviewSubmit({ formData, updateField, tender }: Props) {
  const proposedAmount = parseFloat(formData.proposed_amount) || 0
  const sstRate = 0.06
  const sstAmount = proposedAmount * sstRate
  const totalAmount = formData.include_sst ? proposedAmount + sstAmount : proposedAmount
  const minBudget = Number(tender.min_budget)
  const maxBudget = Number(tender.max_budget)

  // Budget compliance check
  const isWithinBudget = proposedAmount >= minBudget && proposedAmount <= maxBudget
  const budgetStatus = proposedAmount < minBudget ? "low" : proposedAmount > maxBudget ? "high" : "good"

  const isFormValid =
    formData.company_name.trim() &&
    formData.company_address.trim() &&
    formData.contact_person_name.trim() &&
    formData.contact_person_phone.trim() &&
    formData.contact_person_email.trim() &&
    formData.proposed_amount &&
    proposedAmount > 0 &&
    formData.payment_terms &&
    formData.validity_period_days &&
    (formData.supporting_documents.length > 0 || (formData.methodology && formData.methodology.length >= 100)) &&
    formData.agree_to_terms

  // Missing fields check
  const missingFields = []
  if (!formData.company_name.trim()) missingFields.push("Company Name")
  if (!formData.company_address.trim()) missingFields.push("Company Address")
  if (!formData.contact_person_name.trim()) missingFields.push("Contact Person Name")
  if (!formData.contact_person_phone.trim()) missingFields.push("Contact Phone")
  if (!formData.contact_person_email.trim()) missingFields.push("Contact Email")
  if (!formData.proposed_amount || proposedAmount <= 0) missingFields.push("Proposed Amount")
  if (!formData.payment_terms) missingFields.push("Payment Terms")
  if (!formData.validity_period_days) missingFields.push("Validity Period")
  if (formData.supporting_documents.length === 0 && (!formData.methodology || formData.methodology.length < 100)) {
    missingFields.push("Technical Proposal (Documents or Methodology)")
  }
  if (!formData.agree_to_terms) missingFields.push("Terms & Conditions Agreement")

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Step 4: Review & Submit</h2>
        <p className="text-sm text-muted-foreground">
          Please carefully review all information before submitting your bid.
        </p>
      </div>

      {/* Budget Range Alert */}
      {minBudget > 0 && maxBudget > 0 && budgetStatus !== "good" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {budgetStatus === "low" 
              ? `Your bid (RM ${proposedAmount.toLocaleString()}) is below the range (RM ${minBudget.toLocaleString()} - ${maxBudget.toLocaleString()}).`
              : `Your bid (RM ${proposedAmount.toLocaleString()}) exceeds the range (RM ${minBudget.toLocaleString()} - ${maxBudget.toLocaleString()}).`
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Company & Contact Combined */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company & Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Company Column */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Company</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  <span className="font-medium">{formData.company_name || "—"}</span>
                </div>
                {formData.company_registration && (
                  <div>
                    <span className="text-muted-foreground">SSM:</span>{" "}
                    <span className="font-medium font-mono text-xs">{formData.company_registration}</span>
                  </div>
                )}
                {formData.company_address && (
                  <div>
                    <span className="text-muted-foreground">Address:</span>{" "}
                    <span className="font-medium">{formData.company_address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Column */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Contact Person</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  <span className="font-medium">{formData.contact_person_name || "—"}</span>
                </div>
                {formData.contact_person_phone && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    <a href={`tel:${formData.contact_person_phone}`} className="font-medium hover:text-primary">
                      {formData.contact_person_phone}
                    </a>
                  </div>
                )}
                {formData.contact_person_email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <a href={`mailto:${formData.contact_person_email}`} className="font-medium hover:text-primary truncate block">
                      {formData.contact_person_email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Proposal & Tender Reference Side by Side */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Financial Proposal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Proposal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Pricing Summary */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Proposed Amount</span>
                  <span className="font-bold">RM {proposedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {formData.include_sst && (
                  <>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>SST (6%)</span>
                      <span>RM {sstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">RM {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Terms in compact grid */}
              <div className="grid gap-2 sm:grid-cols-2 text-sm">
                {formData.payment_terms && (
                  <div>
                    <span className="text-xs text-muted-foreground">Payment Terms</span>
                    <p className="font-medium">{formData.payment_terms}</p>
                  </div>
                )}
                {formData.validity_period_days && (
                  <div>
                    <span className="text-xs text-muted-foreground">Validity</span>
                    <p className="font-medium">{formData.validity_period_days} days</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tender Reference */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tender Reference
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Tender Title</span>
                <p className="font-medium">{tender.title}</p>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground">Service Type</span>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs">{tender.service_type}</Badge>
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground">Property</span>
                <p className="font-medium">{tender.property_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Proposal - Full Width */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Technical Proposal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Documents */}
          {formData.supporting_documents.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Supporting Documents</span>
                <Badge variant="secondary" className="text-xs">
                  {formData.supporting_documents.length} file{formData.supporting_documents.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-4">
                {formData.supporting_documents.map((url, index) => {
                  const fileName = url.split('/').pop() || `Document ${index + 1}`
                  const fileExt = fileName.split('.').pop()?.toUpperCase() || 'FILE'
                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary transition-all group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{fileExt}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">Click to view</p>
                      </div>
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>
                  )
                })}
              </div>
            </div>
          ) : (
            <Alert variant="default" className="bg-amber-50 border-amber-200 dark:bg-amber-950/20">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-600 dark:text-amber-400">
                Please upload at least one supporting document or provide a methodology.
              </AlertDescription>
            </Alert>
          )}

          {/* Methodology & Timeline */}
          <div className="grid gap-4">
            {/* Methodology */}
            {formData.methodology && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Methodology</span>
                  <span className="text-xs text-muted-foreground">{formData.methodology.length} chars</span>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30 text-xs text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {formData.methodology}
                </div>
              </div>
            )}

            {/* Proposed Timeline */}
            {formData.proposed_timeline && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Proposed Timeline</span>
                <div className="p-3 rounded-lg border bg-card">
                  <p className="text-sm">{formData.proposed_timeline}</p>
                </div>
              </div>
            )}
          </div>

          {/* Missing Technical Proposal Warning */}
          {!formData.supporting_documents.length && !formData.methodology && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm">Missing Technical Proposal</AlertTitle>
              <AlertDescription className="text-xs">
                Please provide either supporting documents or a methodology (minimum 100 characters) to proceed with your bid submission.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card className={cn(
        "border-2 transition-colors",
        formData.agree_to_terms ? "border-primary/50 bg-primary/5" : "border-destructive/50 bg-destructive/5"
      )}>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree_to_terms"
              checked={formData.agree_to_terms}
              onCheckedChange={(checked) => updateField("agree_to_terms", checked as boolean)}
              className="mt-0.5 cursor-pointer"
            />
            <label
              htmlFor="agree_to_terms"
              className="text-xs leading-relaxed cursor-pointer select-none flex-1"
            >
              <span className="font-semibold">Declaration and Agreement *</span>
              <br />
              I confirm that all information provided is true and accurate. I understand that
              providing false or misleading information may result in disqualification.
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Validation Alert */}
      {!isFormValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm">Cannot Submit Bid</AlertTitle>
          <AlertDescription className="text-xs">
            <p className="mb-1">Please complete the following:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
