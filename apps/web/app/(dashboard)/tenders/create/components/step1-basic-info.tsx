import { FormData } from "@/data/create-tender-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export default function Step1Basic({formData, updateField}: Props) {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="test-xl font-bold mb-1">Step 1: Tender Details</h2>
            <p className="test-xs text-gray-500 dark:text-gray-400 mb-6">Provide the tender title and service type.</p>

            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Tender Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div>
                <Label htmlFor="service_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Service Type <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={formData.service_type}
                    >
                    <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Select service type" />
                    </SelectTrigger>

                    <SelectContent side="bottom" sideOffset={0}>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Landscaping">Landscaping</SelectItem>
                        <SelectItem value="Pest Control">Pest Control</SelectItem>
                        <SelectItem value="Waste Management">Waste Management</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
        </div>
    )
}