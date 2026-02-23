"use client"

import { FormData } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export function TimelineSection({formData, updateField}: Props) {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-1">Timeline</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Set the closing date and optional site visit.
            </p>
            
            <div className="space-y-6">
                <div>
                    <Label htmlFor="closing" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Closing Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <DatePicker
                                id="closing_date"
                                value={formData.closing_date}
                                onChange={(value) => updateField("closing_date", value)}
                                placeholder="Select closing date"
                                required
                            />
                        </div>
                        <TimePicker
                            id="closing_time"
                            value={formData.closing_time}
                            onChange={(value) => updateField("closing_time", value)}
                            placeholder="Select closing time"
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="site_visit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Site Visit Date & Time <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <DatePicker
                                id="site_visit_date"
                                value={formData.site_visit_date}
                                onChange={(value) => updateField("site_visit_date", value)}
                                placeholder="Select site visit date"
                            />
                        </div>
                        <TimePicker
                            id="site_visit_time"
                            value={formData.site_visit_time || ""}
                            onChange={(value) => updateField("site_visit_time", value)}
                            placeholder="Select site visit time"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}