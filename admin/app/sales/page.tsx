import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, Filter, Download } from "lucide-react"

// Sample sales data
const sales = [
  {
    id: "INV001",
    customer: "John Smith",
    email: "john@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-20",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-19",
    paymentMethod: "PayPal",
  },
  {
    id: "INV003",
    customer: "Michael Brown",
    email: "michael@example.com",
    amount: "$999.00",
    status: "Processing",
    date: "2023-05-18",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV004",
    customer: "Emily Davis",
    email: "emily@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-17",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV005",
    customer: "Robert Wilson",
    email: "robert@example.com",
    amount: "$999.00",
    status: "Failed",
    date: "2023-05-16",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV006",
    customer: "Jennifer Taylor",
    email: "jennifer@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-15",
    paymentMethod: "PayPal",
  },
  {
    id: "INV007",
    customer: "David Martinez",
    email: "david@example.com",
    amount: "$999.00",
    status: "Refunded",
    date: "2023-05-14",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV008",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-13",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV009",
    customer: "James Thomas",
    email: "james@example.com",
    amount: "$999.00",
    status: "Completed",
    date: "2023-05-12",
    paymentMethod: "PayPal",
  },
  {
    id: "INV010",
    customer: "Patricia White",
    email: "patricia@example.com",
    amount: "$999.00",
    status: "Processing",
    date: "2023-05-11",
    paymentMethod: "Credit Card",
  },
]

// Sample data for analytics
const monthlySalesData = [
  { month: "January", revenue: "$15,000", count: 15 },
  { month: "February", revenue: "$23,000", count: 23 },
  { month: "March", revenue: "$32,000", count: 32 },
  { month: "April", revenue: "$45,000", count: 45 },
  { month: "May", revenue: "$38,000", count: 38 },
  { month: "June", revenue: "$50,000", count: 50 },
  { month: "July", revenue: "$60,000", count: 60 },
]

const paymentMethodData = [
  { method: "Credit Card", percentage: "75%", count: 93 },
  { method: "PayPal", percentage: "20%", count: 25 },
  { method: "Bank Transfer", percentage: "5%", count: 6 },
]

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Manage transactions and revenue</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,500.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 mr-1">↑ 18%</span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sales Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500 mr-1">↓ 5%</span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$999.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 mr-1">↑ 0%</span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>All Transactions</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search transactions..." className="pl-8" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Status</DropdownMenuItem>
                      <DropdownMenuItem>Date</DropdownMenuItem>
                      <DropdownMenuItem>Payment Method</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
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
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
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
                        <Badge
                          variant="outline"
                          className={
                            sale.status === "Completed"
                              ? "border-green-500 text-green-500"
                              : sale.status === "Processing"
                                ? "border-yellow-500 text-yellow-500"
                                : sale.status === "Refunded"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-red-500 text-red-500"
                          }
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Issue Refund</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>124</strong> transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue breakdown by month</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySalesData.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>{item.revenue}</TableCell>
                        <TableCell>{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paymentMethodData.map((item) => (
                    <div key={item.method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              item.method === "Credit Card"
                                ? "bg-blue-500"
                                : item.method === "PayPal"
                                  ? "bg-purple-500"
                                  : "bg-green-500"
                            }`}
                          ></div>
                          <span className="font-medium">{item.method}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.count} transactions</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className={`h-2 rounded-full ${
                            item.method === "Credit Card"
                              ? "bg-blue-500"
                              : item.method === "PayPal"
                                ? "bg-purple-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: item.percentage }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.percentage} of total sales</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
