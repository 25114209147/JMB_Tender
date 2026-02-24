"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Link as LinkIcon, Info, X, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { BidFormData } from "@/data/bids-form"
import type { Tender } from "@/data/tenders"

interface Props {
  formData: BidFormData
  updateField: <K extends keyof BidFormData>(field: K, value: BidFormData[K]) => void
  tender: Tender
}

export default function Step3Proposal({ formData, updateField }: Props) {
  const [newDocumentUrl, setNewDocumentUrl] = useState("")
  const methodologyLength = formData.methodology?.length || 0
  const minLength = 100
  const maxLength = 800
  const isMethodologyValid = methodologyLength >= minLength && methodologyLength <= maxLength

  const hasDocuments = formData.supporting_documents.length > 0
  const hasMethodology = formData.methodology && formData.methodology.trim().length >= minLength

  const addDocument = () => {
    if (newDocumentUrl.trim() && !formData.supporting_documents.includes(newDocumentUrl.trim())) {
      updateField("supporting_documents", [...formData.supporting_documents, newDocumentUrl.trim()])
      setNewDocumentUrl("")
    }
  }

  const removeDocument = (index: number) => {
    const updated = formData.supporting_documents.filter((_, i) => i !== index)
    updateField("supporting_documents", updated)
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Step 3: Technical Proposal</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Provide supporting documents OR describe your methodology and timeline.
        </p>
      </div>

      {/* Supporting Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Supporting Documents
          </CardTitle>
          <CardDescription>
            Upload links to SSM certificate, insurance, references, licenses and other relevant documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document_url" className="text-sm font-medium flex items-center gap-2">
              Document Link
            </Label>
            <div className="flex gap-2">
              <Input
                id="document_url"
                type="url"
                value={newDocumentUrl}
                onChange={(e) => setNewDocumentUrl(e.target.value)}
                placeholder="https://drive.google.com/... or https://dropbox.com/..."
                className="h-10 flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addDocument()
                  }
                }}
              />
              <Button
                type="button"
                onClick={addDocument}
                disabled={!newDocumentUrl.trim()}
                size="sm"
                className="h-10 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ensure links have view access.
            </p>
          </div>

          {formData.supporting_documents.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Added Documents ({formData.supporting_documents.length})</Label>
              <div className="space-y-2">
                {formData.supporting_documents.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded-md"
                  >
                    <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex-1 truncate"
                    >
                      {url}
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="h-8 w-8 p-0 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasDocuments && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                If you don't have supporting documents ready, you can provide a methodology description below instead.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* OR Divider */}
      {hasDocuments && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>
      )}

      {/* Methodology & Timeline Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Methodology & Timeline
          </CardTitle>
          <CardDescription>
            Describe your approach, methodology, and proposed timeline (required if no documents provided)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="methodology" className="text-sm font-medium">
                Methodology & Approach
                {!hasDocuments && <span className="text-destructive ml-1">*</span>}
              </Label>
              <span
                className={`text-xs ${
                  isMethodologyValid
                    ? "text-green-600 dark:text-green-400"
                    : methodologyLength > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground"
                }`}
              >
                {methodologyLength} / {minLength}-{maxLength} characters
              </span>
            </div>
            <Textarea
              id="methodology"
              value={formData.methodology || ""}
              onChange={(e) => updateField("methodology", e.target.value)}
              placeholder="Describe your approach, key advantages, relevant experience, proposed team, methodology, equipment, and any other factors that make your bid competitive..."
              rows={8}
              className="resize-y min-h-[200px]"
              maxLength={maxLength}
            />
            {methodologyLength > 0 && !isMethodologyValid && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {methodologyLength < minLength
                  ? `Please provide at least ${minLength} characters for a comprehensive proposal`
                  : `Please keep the description under ${maxLength} characters`}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Include: your approach, relevant experience, team qualifications, equipment and competitive advantages.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposed_timeline" className="text-sm font-medium">
              Proposed Timeline / Commencement Date
            </Label>
            <Textarea
              id="proposed_timeline"
              value={formData.proposed_timeline || ""}
              onChange={(e) => updateField("proposed_timeline", e.target.value)}
              placeholder="e.g. Ready to commence within 10 working days; 6-month contract execution period"
              rows={3}
              className="resize-y"
            />
          </div>

          {!hasDocuments && !hasMethodology && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Please provide either supporting documents above OR a methodology description (minimum {minLength} characters).
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
