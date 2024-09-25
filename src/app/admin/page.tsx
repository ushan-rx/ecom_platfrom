import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle } from "@/components/ui/card";
import db from "@/db/db";


async function getSalesData(){
    const data =  await db.order.aggregate({
        _sum: {pricePaidInCents : true},
        _count: true
    })

    return {
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count
    }
}

export default async function AdminDashboard(){
    const salesData = await getSalesData();
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       <DashboardCard 
            title="Products"
            description={salesData.numberOfSales}
            body={salesData.amount}></DashboardCard>
    </div>
}

type DashboardCardProps = {
    title: string,
    description: string,
    body: String
}


export function DashboardCard({title, description, body}: DashboardCardProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    {body}
                </p>
            </CardContent>
        </Card>
    )
}