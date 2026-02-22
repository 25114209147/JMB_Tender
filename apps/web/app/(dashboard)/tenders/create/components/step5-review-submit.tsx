"use client"

import { FormData } from "@/data/create-tender-form"
import { format } from "date-fns"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export default function Step5ReviewSubmit({ formData }: Props) {
    const Label = ({ children }: { children: React.ReactNode }) => (
      <span className="font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </span>
    )

    const formatTime = (timeValue?: string) => {
      if (!timeValue) return "Not set"
      const [hours, minutes] = timeValue.split(":")
      if (!hours || !minutes) return timeValue
      const hour = parseInt(hours, 10)
      if (isNaN(hour)) return timeValue
      const ampm = hour >= 12 ? "PM" : "AM"
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }

    const formatDate = (dateValue?: string) => {
      if (!dateValue) return "Not set"
      try {
        return format(new Date(dateValue), "MMM dd, yyyy")
      } catch {
        return dateValue
      }
    }
  
    return (
      <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Review & Submit</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Please review all the information before submitting
          </p>
        </div>
  
        {/* Basic Info */}
        <section className="space-y-2">
          <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
          <div className="space-y-2 text-sm">
            <p><Label>Title:</Label> {formData.title || "Not provided"}</p>
            <p><Label>Service Type:</Label> {formData.service_type || "Not provided"}</p>
            {formData.custom_service_type && (
              <p><Label>Custom Service Type:</Label> {formData.custom_service_type}</p>
            )}
          </div>
        </section>
  
        {/* Property Info */}
        <section className="space-y-2">
          <h3 className="text-lg font-semibold mb-3">Property Information</h3>
          <div className="space-y-2 text-sm">
            <p><Label>Property Name:</Label> {formData.property_name || "Not provided"}</p>
            <p>
              <Label>Address:</Label>{" "}
              {formData.property_address_line_1 || ""} {formData.property_address_line_2 || ""}
              {formData.property_address_line_1 && ","} {formData.property_city || ""}
              {formData.property_city && ","} {formData.property_state || ""}
              {formData.property_state && ","} {formData.property_postcode || ""}
              {formData.property_postcode && ","} {formData.property_country || ""}
            </p>
          </div>
        </section>
  
        {/* Scope */}
        <section className="space-y-2">
          <h3 className="text-lg font-semibold mb-3">Scope & Requirements</h3>
  
          <div className="space-y-3 text-sm">
            <div>
              <p className="mb-1.5"><Label>Scope of Work:</Label></p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                {formData.scope_of_work || "Not provided"}
              </p>
            </div>
  
            <p><Label>Contract Period:</Label> {formData.contract_period_days || "Not set"} days</p>
            <p><Label>Start Date:</Label> {formatDate(formData.contract_start_date)}</p>
            <p><Label>End Date:</Label> {formatDate(formData.contract_end_date)}</p>
            <p>
              <Label>Required Licenses:</Label>{" "}
              {formData.required_licenses.length > 0 
                ? formData.required_licenses.join(", ") 
                : "None"}
            </p>
            {formData.custom_licenses.length > 0 && (
              <p>
                <Label>Custom Licenses:</Label> {formData.custom_licenses.join(", ")}
              </p>
            )}
            <p>
              <Label>Evaluation Criteria:</Label>{" "}
              {formData.evaluation_criteria.length > 0 
                ? formData.evaluation_criteria.map(c => `${c.criteria} (${c.weight}%)`).join(", ") 
                : "None"}
            </p>
            <p><Label>Tender Fee:</Label> RM {formData.tender_fee || "0.00"}</p>
          </div>
        </section>
  
        {/* Budget & Timeline */}
        <section className="space-y-2">
          <h3 className="text-lg font-semibold mb-3">Budget & Timeline</h3>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>
              <Label>Min Budget:</Label>{" "}
              {formData.min_budget ? `RM ${Number(formData.min_budget).toLocaleString()}` : "Not set"}
            </p>
            <p>
              <Label>Max Budget:</Label>{" "}
              {formData.max_budget ? `RM ${Number(formData.max_budget).toLocaleString()}` : "Not set"}
            </p>
            <p><Label>Closing Date:</Label> {formatDate(formData.closing_date)}</p>
            <p><Label>Closing Time:</Label> {formatTime(formData.closing_time)}</p>
            <p><Label>Site Visit Date:</Label> {formatDate(formData.site_visit_date)}</p>
            <p><Label>Site Visit Time:</Label> {formatTime(formData.site_visit_time)}</p>
          </div>
        </section>
  
        {/* Contact */}
        <section className="space-y-2">
          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <p><Label>Contact Person:</Label> {formData.contact_person || "Not provided"}</p>
            <p><Label>Contact Email:</Label> {formData.contact_email || "Not provided"}</p>
            <p><Label>Contact Phone:</Label> {formData.contact_phone || "Not provided"}</p>
          </div>
        </section>
      </div>
    )
  }
  