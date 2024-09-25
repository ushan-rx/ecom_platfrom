import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";


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

async function getUserData(){
    const [userCount, orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum: { pricePaidInCents: true },
        }),
    ])

    return {
        userCount,
        averageValuePerUser: userCount === 0 ? 0 : 
        (orderData._sum.pricePaidInCents || 0) /userCount / 100
    }
}

export default async function AdminDashboard(){
    const [salesData, userData] = await Promise.all([
        getSalesData(),
        getUserData()
    ])
    
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       <DashboardCard 
            title="Products"
            description={formatNumber(salesData.numberOfSales)}
            body={formatCurrency(salesData.amount)}
        />
        <DashboardCard 
            title="Customer"
            description={`${formatNumber(userData.averageValuePerUser)} Average Value`}
            body={formatCurrency(userData.userCount)}
        />
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