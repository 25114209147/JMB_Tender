import { FormData } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export function ScopeOfWorkSection({ formData, updateField }: Props) {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-1">Scope of Work</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Describe the scope of work, key requirements, and any specific details.
            </p>

            <div>
                <Label htmlFor="scope_of_work" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Scope of Work <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="scope_of_work"
                    value={formData.scope_of_work}
                    onChange={(e) => updateField("scope_of_work", e.target.value)}
                    placeholder="Describe the scope of work, key requirements, and any specific details..."
                    className="w-full min-h-[240px] resize-y"
                    required
                />
            </div>
        </div>
    )
}
