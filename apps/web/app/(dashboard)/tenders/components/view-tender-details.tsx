"use client"

import { FormData } from "@/data/create-tender-form"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Info,
    Building2,
    ClipboardList,
    DollarSign,
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    Scale
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Props {
    formData: FormData
}

export default function ViewTenderDetails({ formData }: Props) {
    const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string | React.ReactNode; icon?: React.ElementType }) => (
        <div className="flex items-start gap-3 py-2">
            {Icon && (
                <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground">{label}:</span>
                <span className="text-sm text-muted-foreground ml-2 break-words inline-block w-full">{value}</span>
            </div>
        </div>
    )

    const formatTime = (timeValue?: string) => {
        if (!timeValue) return <span className="text-muted-foreground italic">Not set</span>
        const [hours, minutes] = timeValue.split(":")
        if (!hours || !minutes) return timeValue
        const hour = parseInt(hours, 10)
        if (isNaN(hour)) return timeValue
        const ampm = hour >= 12 ? "PM" : "AM"
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }

    const formatDate = (dateValue?: string) => {
        if (!dateValue) return <span className="text-muted-foreground italic">Not set</span>
        try {
            return format(new Date(dateValue), "MMM dd, yyyy")
        } catch {
            return dateValue
        }
    }

    const formatAddress = () => {
        const parts = [
            formData.property_address_line_1,
            formData.property_address_line_2,
            formData.property_city,
            formData.property_state,
            formData.property_postcode,
            formData.property_country
        ].filter(Boolean)
        return parts.length > 0 ? parts.join(", ") : <span className="text-muted-foreground italic">Not provided</span>
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Basic Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1 overflow-hidden">
                            <InfoRow
                                label="Title"
                                value={formData.title || <span className="text-muted-foreground italic">Not provided</span>}
                            />
                            <Separator />
                            <InfoRow
                                label="Service Type"
                                value={
                                    formData.service_type ? (
                                        <Badge variant="outline">{formData.service_type}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground italic">Not provided</span>
                                    )
                                }
                            />
                            {formData.custom_service_type && (
                                <>
                                    <Separator />
                                    <InfoRow
                                        label="Custom Service Type"
                                        value={<Badge variant="secondary">{formData.custom_service_type}</Badge>}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Property Information */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Property Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1 overflow-hidden">
                            <InfoRow
                                label="Property Name"
                                value={formData.property_name || <span className="text-muted-foreground italic">Not provided</span>}
                            />
                            <Separator />
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-foreground">Address:</span>
                                <div className="text-sm text-muted-foreground mt-1 break-words">{formatAddress()}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Scope & Requirements */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Scope & Requirements</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold mb-2">Scope of Work</p>
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap border rounded-lg p-4 bg-muted/50 min-h-[100px]">
                                {formData.scope_of_work || <span className="italic">Not provided</span>}
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Contract Period</p>
                                <p className="text-sm font-semibold">
                                    {formData.contract_period_days || "0"} days
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Start Date</p>
                                <p className="text-sm font-semibold">{formatDate(formData.contract_start_date)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">End Date</p>
                                <p className="text-sm font-semibold">{formatDate(formData.contract_end_date)}</p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-semibold mb-2">Required Licenses</p>
                            <div className="flex flex-wrap gap-2">
                                {formData.required_licenses.length > 0 ? (
                                    formData.required_licenses.map((license, index) => (
                                        <Badge key={index} variant="outline">{license}</Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground italic">None</span>
                                )}
                            </div>
                        </div>

                        {formData.custom_licenses.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm font-semibold mb-2">Custom Licenses</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.custom_licenses.map((license, index) => (
                                            <Badge key={index} variant="secondary">{license}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        <Separator />
                        <InfoRow
                            label="Tender Fee"
                            value={<span className="text-base font-semibold text-primary">RM {formData.tender_fee || "0.00"}</span>}
                        />
                    </CardContent>
                </Card>

                {/* Evaluation Criteria */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Scale className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1 overflow-hidden">
                            {formData.evaluation_criteria.length > 0 ? (
                                <div className="space-y-2">
                                    {formData.evaluation_criteria.map((c, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                            <span className="text-sm">{c.criteria}</span>
                                            <Badge variant="default" className="ml-2">{c.weight}%</Badge>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-sm font-semibold">Total Weight</span>
                                        <Badge variant={formData.evaluation_criteria.reduce((sum, c) => sum + c.weight, 0) === 100 ? "default" : "destructive"}>
                                            {formData.evaluation_criteria.reduce((sum, c) => sum + c.weight, 0)}%
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground italic">None</span>
                            )}
                        </CardContent>
                    </Card>

                    {/* Budget & Timeline */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Budget & Timeline</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1 overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Minimum Budget</p>
                                    <p className="text-base font-semibold">
                                        {formData.min_budget ? `RM ${Number(formData.min_budget).toLocaleString()}` : <span className="text-muted-foreground italic">Not set</span>}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Maximum Budget</p>
                                    <p className="text-base font-semibold">
                                        {formData.max_budget ? `RM ${Number(formData.max_budget).toLocaleString()}` : <span className="text-muted-foreground italic">Not set</span>}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Closing</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{formatDate(formData.closing_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{formatTime(formData.closing_time)}</span>
                                        </div>
                                    </div>
                                </div>

                                {(formData.site_visit_date || formData.site_visit_time) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-2">Site Visit</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{formatDate(formData.site_visit_date)}</span>
                                                </div>
                                                {formData.site_visit_time && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{formatTime(formData.site_visit_time)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Contact Information */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow
                            label="Contact Person"
                            value={formData.contact_person || <span className="text-muted-foreground italic">Not provided</span>}
                            icon={User}
                        />
                        <Separator />
                        <InfoRow
                            label="Email"
                            value={formData.contact_email || <span className="text-muted-foreground italic">Not provided</span>}
                            icon={Mail}
                        />
                        <Separator />
                        <InfoRow
                            label="Phone"
                            value={formData.contact_phone || <span className="text-muted-foreground italic">Not provided</span>}
                            icon={Phone}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
