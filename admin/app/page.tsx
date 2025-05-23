import { Users, FileText, DollarSign, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data for recent sales
const recentSales = [
  {
    id: "INV001",
    customer: "John Smith",
    email: "john@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-20",
  },
  {
    id: "INV002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-19",
  },
  {
    id: "INV003",
    customer: "Michael Brown",
    email: "michael@example.com",
    amount: "$999.00",
    status: "Processing",
    date: "2023-05-18",
  },
  {
    id: "INV004",
    customer: "Emily Davis",
    email: "emily@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-17",
  },
  {
    id: "INV005",
    customer: "Robert Wilson",
    email: "robert@example.com",
    amount: "$999.00",
    status: "Failed",
    date: "2023-05-16",
  },
]

// Sample data for popular policies
const popularPolicies = [
  {
    name: "Acceptable Use Policy",
    downloads: 245,
    percentage: 28,
  },
  {
    name: "Password Policy",
    downloads: 190,
    percentage: 21,
  },
  {
    name: "Data Protection Policy",
    downloads: 175,
    percentage: 19,
  },
  {
    name: "Incident Response Policy",
    downloads: 148,
    percentage: 17,
  },
  {
    name: "Remote Work Policy",
    downloads: 132,
    percentage: 15,
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your cybersecurity policy platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="mr-1 text-green-500">↑ 12%</span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="mr-1 text-green-500">↑ 0%</span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,500</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="mr-1 text-green-500">↑ 18%</span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sales This Month</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="mr-1 text-red-500">↓ 5%</span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sale.customer}</div>
                        <div className="text-sm text-muted-foreground">{sale.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{sale.amount}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          sale.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : sale.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sale.status}
                      </div>
                    </TableCell>
                    <TableCell>{sale.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Popular Policies</CardTitle>
            <CardDescription>Most downloaded policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularPolicies.map((policy) => (
                <div key={policy.name} className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{policy.name}</span>
                      <span className="text-sm text-muted-foreground">{policy.downloads}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: `${policy.percentage}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
