"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Mail, Phone, MapPin, Globe } from "lucide-react"
import type { BidFormData } from "@/data/bids-form"
import type { Tender } from "@/data/tenders"

interface Props {
  formData: BidFormData
  updateField: <K extends keyof BidFormData>(field: K, value: BidFormData[K]) => void
  tender: Tender
}

export default function Step1CompanyInfo({ formData, updateField }: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Step 1: Company & Contact Information</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Provide your company details and contact information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Details
          </CardTitle>
          <CardDescription>
            Basic information about your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-sm font-medium">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => updateField("company_name", e.target.value)}
              placeholder="e.g. ABC Cleaning Services Sdn Bhd"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_registration" className="text-sm font-medium">
              SSM / ROC Registration Number (12 digits) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="company_registration"
              value={formData.company_registration}
              onChange={(e) => updateField("company_registration", e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 202301234567"
              maxLength={12}
              className="h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_address" className="text-sm font-medium flex items-center gap-2">
              Company Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="company_address"
              value={formData.company_address}
              onChange={(e) => updateField("company_address", e.target.value)}
              placeholder="e.g. 123 Business Park, Jalan Ampang, 50450 Kuala Lumpur, Malaysia"
              rows={3}
              className="resize-y"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_website" className="text-sm font-medium flex items-center gap-2">
              Company Website (Optional)
            </Label>
            <Input
              id="company_website"
              type="url"
              value={formData.company_website || ""}
              onChange={(e) => updateField("company_website", e.target.value)}
              placeholder="https://www.example.com"
              className="h-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Person Details
          </CardTitle>
          <CardDescription>
            Primary contact person for this bid
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contact_person_name" className="text-sm font-medium">
              Contact Person Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact_person_name"
              value={formData.contact_person_name}
              onChange={(e) => updateField("contact_person_name", e.target.value)}
              placeholder="e.g. Ahmad bin Hassan"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person_phone" className="text-sm font-medium flex items-center gap-2">
              Contact Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact_person_phone"
              type="tel"
              value={formData.contact_person_phone}
              onChange={(e) => updateField("contact_person_phone", e.target.value)}
              placeholder="e.g. +60123456789 or 012-345-6789"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person_email" className="text-sm font-medium flex items-center gap-2">
              Contact Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact_person_email"
              type="email"
              value={formData.contact_person_email}
              onChange={(e) => updateField("contact_person_email", e.target.value)}
              placeholder="e.g. ahmad@company.com.my"
              required
              className="h-10"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
