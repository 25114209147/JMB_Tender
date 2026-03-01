"use client"

import { useState, useEffect } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { updateProfile } from "@/lib/auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/toast/toast"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { isContractorProfileComplete, getMissingProfileFields } from "@/lib/profile-utils"
import { useRole } from "@/contexts/role-context"
import PageHeader from "@/components/shared/page-header"

export default function ProfilePage() {
  const { user, loading, error, refetch } = useCurrentUser()
  const { role } = useRole()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    company_name: "",
    company_address: "",
    company_registration: "",
    website: "",
    bio: "",
  })

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        company_name: user.company_name || "",
        company_address: (user as any).company_address || "",
        company_registration: (user as any).company_registration || "",
        website: user.website || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    try {
      await updateProfile(formData)
      await refetch()
      toast.success("Profile updated successfully")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />
  }

  if (error || !user) {
    return (
      <ErrorMessage
        message={error || "Failed to load profile"}
        title="Error"
        onRetry={refetch}
      />
    )
  }

  const profileComplete = role === "contractor" ? isContractorProfileComplete(user) : true
  const missingFields = role === "contractor" ? getMissingProfileFields(user) : []

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl">
      <PageHeader
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </header>

      {/* Profile Completion Alert for Contractors */}
      {role === "contractor" && !profileComplete && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">Complete Your Profile to Start Bidding</div>
            <p className="text-sm">
              Please fill in the following required fields: {missingFields.join(", ")}
            </p>
          </AlertDescription>
        </Alert>
      )}

      {role === "contractor" && profileComplete && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Your profile is complete. You can now submit bids on tenders.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled
                    className="cursor-not-allowed bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number {role === "contractor" && "*"}</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    required={role === "contractor"}
                    className="cursor-text"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information (for Contractors) */}
          {role === "contractor" && (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Your company details (required for contractors)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      required
                      className="cursor-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_registration">SSM / ROC Registration Number</Label>
                    <Input
                      id="company_registration"
                      value={formData.company_registration}
                      onChange={(e) => setFormData({ ...formData, company_registration: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g. 202301234567"
                      maxLength={12}
                      className="cursor-text"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company_address">Company Address</Label>
                    <textarea
                      id="company_address"
                      value={formData.company_address}
                      onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-text"
                      placeholder="e.g. 123 Business Park, Jalan Ampang, 50450 Kuala Lumpur, Malaysia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                      className="cursor-text"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-text"
                  placeholder="Write a brief description about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
