import { FormData, EvaluationCriteria } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useMemo, useEffect, useRef } from "react"
import { toast } from "@/components/toast/toast"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export function EvaluationCriteriaSection({ formData, updateField }: Props) {
    const criteriaList = formData.evaluation_criteria || []
    const toastShownRef = useRef(false)

    const totalWeight = useMemo(() => {
        return criteriaList.reduce((sum, item) => sum + (item.weight || 0), 0)
    }, [criteriaList])

    // Show toast warning when total weight is not 100%
    useEffect(() => {
        if (criteriaList.length > 0 && totalWeight !== 100) {
            if (!toastShownRef.current) {
                toast.warning("Total weight must be 100%", {
                    description: "Please adjust the weights.",
                })
                toastShownRef.current = true
            }
        } else {
            toastShownRef.current = false
        }
    }, [totalWeight, criteriaList.length])

    const handleCriteriaChange = (index: number, field: keyof EvaluationCriteria, value: string | number) => {
        const newCriteria: EvaluationCriteria[] = [...criteriaList]
        const currentItem = newCriteria[index] || { criteria: "", weight: 0 }
        newCriteria[index] = {
            criteria: field === "criteria" ? (value as string) : currentItem.criteria,
            weight: field === "weight" ? (value as number) : currentItem.weight,
        }
        updateField("evaluation_criteria", newCriteria)
    }

    const addCriteria = () => {
        updateField("evaluation_criteria", [
            ...criteriaList,
            { criteria: "", weight: 0 },
        ])
    }

    const removeCriteria = (index: number) => {
        const newCriteria = criteriaList.filter((_, i) => i !== index)
        updateField("evaluation_criteria", newCriteria)
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-1">Evaluation Criteria</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Define how bids will be evaluated (weights must sum to 100%).
            </p>

            <div className="space-y-4">
                {criteriaList.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Criteria Name"
                                value={item.criteria}
                                onChange={(e) => handleCriteriaChange(index, "criteria", e.target.value)}
                                className="h-10"
                            />
                        </div>
                        <div className="w-32">
                            <Input
                                type="number"
                                placeholder="Weight %"
                                value={item.weight || ""}
                                onChange={(e) => {
                                    const weight = e.target.value === "" ? 0 : Number(e.target.value)
                                    handleCriteriaChange(index, "weight", weight)
                                }}
                                min="0"
                                max="100"
                                className="h-10"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCriteria(index)}
                            className="h-10 w-10 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addCriteria}
                        className="flex items-center gap-2 hover:cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        Add Criteria
                    </Button>
                    <div className="text-sm font-medium">
                        Total:{" "}
                        <span className={totalWeight === 100 ? "text-green-600" : "text-red-500"}>
                            {totalWeight}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
