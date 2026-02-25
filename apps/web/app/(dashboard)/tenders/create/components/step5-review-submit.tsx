import ViewTenderDetails from "../../components/view-tender-details"    
import { FormData } from "@/data/create-tender-form"

export default function Step5ReviewSubmit({ formData }: { formData: FormData }) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 pb-4">
                <h2 className="text-2xl font-bold">Review & Submit</h2>
                <p className="text-sm text-muted-foreground">
                    Please review all information carefully before submitting your tender
                </p>
            </div>  

            <ViewTenderDetails formData={formData} />
        </div>
    )
}               