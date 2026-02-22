import { FormData } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export default function Step2PropertyInfo({formData, updateField}: Props) {
    return (
        <div className="space-y-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Step 2: Property Information</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Provide the property name and address.
                </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="property_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Property Name <span className="text-red-500">*</span>
                        </Label>
                    <Input
                        id="property_name"
                        type="text"
                        value={formData.property_name}
                        onChange={(e) => updateField("property_name", e.target.value)}
                        className="w-full h-10"
                        required
                    />
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Address Line 1 <span className="text-red-500">*</span>
                        </Label>
                    <Input
                        id="property_address_line_1"
                        type="text"
                        value={formData.property_address_line_1}
                        onChange={(e) => updateField("property_address_line_1", e.target.value)}
                        className="w-full h-10"
                        required
                    />
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Address Line 2
                        </Label>
                    <Input
                        id="property_address_line_2"
                        type="text"
                        value={formData.property_address_line_2}
                        onChange={(e) => updateField("property_address_line_2", e.target.value)}
                        className="w-full h-10"
                    />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Postcode <span className="text-red-500">*</span>
                            </Label>
                    <Input
                        id="property_postcode"
                        type="text"
                        value={formData.property_postcode}
                        onChange={(e) => updateField("property_postcode", e.target.value)}
                        className="w-full h-10"
                            required
                        />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                City <span className="text-red-500">*</span>
                            </Label>
                        <Input
                            id="property_city"
                            type="text"
                            value={formData.property_city}
                            onChange={(e) => updateField("property_city", e.target.value)}
                            className="w-full h-10"
                            required
                        />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            State <span className="text-red-500">*</span>
                        </Label>
                    <Select
                        value={formData.property_state && formData.property_state.trim() !== "" ? formData.property_state : undefined}
                        onValueChange={(value) => updateField("property_state", value)}
                    >
                        <SelectTrigger className="w-full h-10">
                            <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent side="bottom" sideOffset={4}>
                            <SelectItem value="Johor">Johor</SelectItem>
                            <SelectItem value="Kedah">Kedah</SelectItem>
                            <SelectItem value="Kelantan">Kelantan</SelectItem>
                            <SelectItem value="Melaka">Melaka</SelectItem>
                            <SelectItem value="Negeri Sembilan">Negeri Sembilan</SelectItem>
                            <SelectItem value="Pahang">Pahang</SelectItem>
                            <SelectItem value="Perak">Perak</SelectItem>
                            <SelectItem value="Perlis">Perlis</SelectItem>
                            <SelectItem value="Sabah">Sabah</SelectItem>
                            <SelectItem value="Sarawak">Sarawak</SelectItem>
                            <SelectItem value="Selangor">Selangor</SelectItem>
                            <SelectItem value="Terengganu">Terengganu</SelectItem>
                            <SelectItem value="W.P. Kuala Lumpur">W.P. Kuala Lumpur</SelectItem>
                            <SelectItem value="W.P. Labuan">W.P. Labuan</SelectItem>
                            <SelectItem value="W.P. Putrajaya">W.P. Putrajaya</SelectItem>
                            {/* Also support full name for backward compatibility */}
                            <SelectItem value="Wilayah Persekutuan Kuala Lumpur">Wilayah Persekutuan Kuala Lumpur</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Country <span className="text-red-500">*</span>
                        </Label>
                    <Input
                        id="property_country"
                        type="text"
                        value={formData.property_country}
                        onChange={(e) => updateField("property_country", e.target.value)}
                        className="w-full h-10"
                        disabled
                    />
                    </div>
                </div>
            </div>
        </div>
    )
}