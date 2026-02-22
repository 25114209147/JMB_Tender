import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/data/create-tender-form"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export function ContactInfoSection({formData, updateField}: Props){
    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-1">Contact Information</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Contact person for tender inquiries.
            </p>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Contact Person <span className="text-red-500">*</span>
                        </Label>
                        <Input  
                            id="contact_person"
                            type="text"
                            value={formData.contact_person}
                            onChange={(e) => updateField("contact_person", e.target.value)}
                            placeholder="Enter contact person name"
                            className="w-full h-10"
                            required
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Contact Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="contact_phone"
                            type="tel"
                            value={formData.contact_phone}
                            onChange={(e) => updateField("contact_phone", e.target.value)}
                            placeholder="e.g., +6012-3456789"
                            className="w-full h-10"
                            required
                        />
                    </div>
                </div>
                
                <div className="w-fit">
                    <Label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Contact Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => updateField("contact_email", e.target.value)}
                        placeholder="e.g., contact@example.com"
                        className="w-full min-w-[280px] sm:min-w-[320px] h-10"
                        required
                    />
                </div>
            </div>
        </div>
    )
}