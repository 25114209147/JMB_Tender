import { FormData, Required_Licenses } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export function RequiredLicensesSection({ formData, updateField }: Props) {
    const hasOthersSelected = formData.required_licenses.includes("Others")
    const customLicenses = formData.custom_licenses || []

    const handleLicenseToggle = (license: string, checked: boolean) => {
        if (checked) {
            updateField("required_licenses", [...formData.required_licenses, license])
            if (license === "Others" && customLicenses.length === 0) {
                updateField("custom_licenses", [""])
            }
        } else {
            const newLicenses = formData.required_licenses.filter(l => l !== license)
            updateField("required_licenses", newLicenses)
            if (license === "Others") {
                updateField("custom_licenses", [])
            }
        }
    }

    const handleCustomLicenseChange = (index: number, value: string) => {
        const newCustomLicenses = [...customLicenses]
        newCustomLicenses[index] = value
        updateField("custom_licenses", newCustomLicenses)
    }

    const addCustomLicense = () => {
        updateField("custom_licenses", [...customLicenses, ""])
    }

    const removeCustomLicense = (index: number) => {
        const newCustomLicenses = customLicenses.filter((_, i) => i !== index)
        updateField("custom_licenses", newCustomLicenses)
        if (newCustomLicenses.length === 0 && formData.required_licenses.includes("Others")) {
            updateField("required_licenses", formData.required_licenses.filter(l => l !== "Others"))
        }
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-1">Required Licenses</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Select the licenses contractors must have to qualify for this tender.
            </p>

            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Required_Licenses.map((license) => (
                        <div key={license} className="flex items-center space-x-2 hover:cursor-pointer">
                            <Checkbox
                                id={license}
                                checked={formData.required_licenses.includes(license)}
                                onCheckedChange={(checked) => handleLicenseToggle(license, checked === true)}
                                className="hover:cursor-pointer"
                            />
                            <Label 
                                htmlFor={license} 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer leading-none"
                            >
                                {license}
                            </Label>
                        </div>
                    ))}
                </div>

                {/* Custom Licenses Section */}
                {hasOthersSelected && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Custom Licenses <span className="text-red-500">*</span>
                            </Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addCustomLicense}
                                className="h-8 hover:cursor-pointer"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add License
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {customLicenses.map((customLicense, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        type="text"
                                        value={customLicense}
                                        onChange={(e) => handleCustomLicenseChange(index, e.target.value)}
                                        placeholder={`Enter custom license ${index + 1}`}
                                        className="flex-1 h-10"
                                        required={hasOthersSelected}
                                    />
                                    {customLicenses.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeCustomLicense(index)}
                                            className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
