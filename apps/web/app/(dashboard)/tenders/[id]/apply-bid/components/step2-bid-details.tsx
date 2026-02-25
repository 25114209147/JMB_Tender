"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Calendar, Info, Receipt, CheckCircle2, AlertOctagon, AlertTriangle } from "lucide-react"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BidFormData } from "@/data/bids-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Tender } from "@/data/tenders"

interface Props {
  formData: BidFormData
  updateField: <K extends keyof BidFormData>(field: K, value: BidFormData[K]) => void
  tender: Tender
}

const PAYMENT_TERMS_OPTIONS = [
  { value: "30 Days", label: "30 Days" },
  { value: "Progressive", label: "Progressive Payment" },
  { value: "Upon Completion", label: "Upon Completion" },
]

const VALIDITY_PERIOD_OPTIONS = [
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days (recommended)" },
  { value: 120, label: "120 days" },
  { value: 180, label: "180 days" },
]

export default function Step2BidDetails({ formData, updateField, tender }: Props) {
  const minBudget = Number(tender.min_budget)
  const maxBudget = Number(tender.max_budget)
  const proposedAmount = parseFloat(formData.proposed_amount) || 0
  const sstRate = 0.08
  const amountWithSST = proposedAmount * (1 + sstRate)
  
  const isWithinRange = proposedAmount >= minBudget && proposedAmount <= maxBudget
  const isBelowRange = proposedAmount > 0 && proposedAmount < minBudget
  const isAboveRange = proposedAmount > maxBudget

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Step 2: Financial Proposal</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Specify your proposed contract amount, payment terms, and bid validity period.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Proposed Contract Amount
          </CardTitle>
          <CardDescription>
            Your commercial offer for this tender
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="proposed_amount" className="text-sm font-medium">
              Proposed Contract Amount (RM) <span className="text-destructive">*</span>
            </Label>
            <CurrencyInput
              id="proposed_amount"
              value={formData.proposed_amount}
              onValueChange={(values) => updateField("proposed_amount", values.value || "")}
              placeholder="0.00"
              required
              className="h-10"
            />
            {proposedAmount > 0 && (
              <div className="mt-1.5 flex flex-col gap-1 text-xs">
              {isWithinRange && (
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Within range
                </div>
              )}
              {isBelowRange && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  Below RM {minBudget.toLocaleString()}
                </div>
              )}
              {isAboveRange && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <AlertOctagon className="h-3 w-3" />
                  Above RM {maxBudget.toLocaleString()}
                </div>
              )}
            </div>
            )}
            {minBudget > 0 && maxBudget > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Reference: RM {minBudget.toLocaleString()} – RM {maxBudget.toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="include_sst"
                checked={formData.include_sst}
                onCheckedChange={(checked) => updateField("include_sst", checked as boolean)}
                className="mt-1 cursor-pointer"
              />
              <div className="space-y-1 flex-1">
                <Label htmlFor="include_sst" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                  Include Service Tax (SST) <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  If checked, SST will be added to your proposed amount.
                </p>
                {formData.include_sst && proposedAmount > 0 && (
                  <div className="mt-2 p-2 bg-muted rounded-md">
                    <p className="text-xs">
                      <span className="font-medium">Base Amount:</span> RM {proposedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}<br />
                      <span className="font-medium">SST (8%):</span> RM {(proposedAmount * sstRate).toLocaleString(undefined, { minimumFractionDigits: 2 })}<br />
                      <span className="font-medium text-lg">Total Amount:</span> RM {amountWithSST.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_terms" className="text-sm font-medium">
              Payment Terms <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.payment_terms}
              onValueChange={(value) => updateField("payment_terms", value)}
            >
              <SelectTrigger id="payment_terms" className="h-10">
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TERMS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validity_period_days" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bid Validity Period <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.validity_period_days.toString()}
              onValueChange={(value) => updateField("validity_period_days", parseInt(value, 10))}
            >
              <SelectTrigger id="validity_period_days" className="h-10">
                <SelectValue placeholder="Select validity period" />
              </SelectTrigger>
              <SelectContent>
                {VALIDITY_PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The number of days your bid price remains valid.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
