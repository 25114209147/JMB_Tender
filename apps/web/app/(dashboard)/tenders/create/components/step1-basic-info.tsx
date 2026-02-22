import { FormData } from "@/data/create-tender-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input" 
import { Textarea } from "@/components/ui/textarea";

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export default function Step1Basic({formData, updateField}: Props) {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-1">Step 1: Tender Details</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Provide the tender title and service type.</p>

            <div className="space-y-6">
                <div>
                    <Label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Tender Title <span className="text-red-500">*</span>
                    </Label>
                    <Textarea   
                        id="title"
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Enter tender title"
                        className="w-full min-h-[40px] resize-y"
                        required
                    />  
                </div>
                <div>
                <Label htmlFor="service_type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Service Type <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={formData.service_type || undefined}
                    onValueChange={(value) => {
                        updateField("service_type", value)
                        // Clear custom_service_type if not "Other"
                        if (value !== "Other") {
                            updateField("custom_service_type" as keyof FormData, "")
                        }
                    }}
                >
                    <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select service type" />
                    </SelectTrigger>

                    <SelectContent side="bottom" sideOffset={4}>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Landscaping">Landscaping</SelectItem>
                        <SelectItem value="Pest Control">Pest Control</SelectItem>
                        <SelectItem value="Waste Management">Waste Management</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {formData.service_type === "Other" && (
                    <div className="mt-4">
                        <Label htmlFor="custom_service_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Specify Service Type <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="custom_service_type"
                            type="text"
                            value={formData.custom_service_type || ""}
                            onChange={(e) => updateField("custom_service_type" as keyof FormData, e.target.value)}
                            placeholder="Enter custom service type"
                            className="w-full h-10"
                            required
                        />
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}