import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";

export default function DashboardBigCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Tenders</CardTitle>
                <CardDescription>Recent tenders you have created</CardDescription>
                {/* <CardAction>Card Action</CardAction> */}
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Tender Name</span>
                        <span className="text-sm text-muted-foreground">Tender Description</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}