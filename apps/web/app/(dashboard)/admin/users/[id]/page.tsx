"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, Calendar, Building, Globe, Briefcase, FileText } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import PageHeader from "@/components/shared/page-header"

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const userId = parseInt(id)
  const router = useRouter()
  const { user, loading, error, refetch } = useUser(userId)

  if (loading) {
    return <LoadingSpinner message="Loading user profile..." />
  }

  if (error || !user) {
    return (
      <ErrorMessage
        message={error || "User not found"}
        title="Failed to load user"
        onRetry={refetch}
      />
    )
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "JMB":
        return "default"
      case "contractor":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-5xl">
      <PageHeader
        backHref="/admin/users"
        backLabel="Back to All Users"
      />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user.name || user.email.split('@')[0]}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant={getRoleBadgeVariant(user.role)} className="text-sm">
          {user.role}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>

            {user.phone_number && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{user.phone_number}</p>
                </div>
              </div>
            )}

            {user.created_at && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company/Professional Information */}
        {(user.company_name || user.website || user.experience_years) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.company_name && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p className="text-sm">{user.company_name}</p>
                  </div>
                </div>
              )}

              {user.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Website</p>
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                </div>
              )}

              {user.experience_years && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Experience</p>
                    <p className="text-sm">{user.experience_years} years</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bio */}
        {user.bio && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Activity Summary (placeholder for future expansion) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mr-2" />
              <p>Activity tracking coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
