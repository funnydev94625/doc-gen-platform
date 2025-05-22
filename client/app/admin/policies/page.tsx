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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MoreHorizontal, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

// Sample policy data
const policies = [
  {
    id: "1",
    name: "Acceptable Use Policy",
    category: "General",
    status: "Published",
    lastUpdated: "2023-05-15",
    downloads: 245,
  },
  {
    id: "2",
    name: "Password Policy",
    category: "Access Control",
    status: "Published",
    lastUpdated: "2023-05-10",
    downloads: 190,
  },
  {
    id: "3",
    name: "Data Protection Policy",
    category: "Data Security",
    status: "Published",
    lastUpdated: "2023-05-12",
    downloads: 175,
  },
  {
    id: "4",
    name: "Incident Response Policy",
    category: "Security Operations",
    status: "Published",
    lastUpdated: "2023-05-08",
    downloads: 148,
  },
  {
    id: "5",
    name: "Remote Work Policy",
    category: "General",
    status: "Published",
    lastUpdated: "2023-05-05",
    downloads: 132,
  },
  {
    id: "6",
    name: "Cloud Security Policy",
    category: "Infrastructure",
    status: "Draft",
    lastUpdated: "2023-05-18",
    downloads: 0,
  },
  {
    id: "7",
    name: "Mobile Device Policy",
    category: "Endpoint Security",
    status: "Published",
    lastUpdated: "2023-04-28",
    downloads: 98,
  },
  {
    id: "8",
    name: "Third-Party Risk Management Policy",
    category: "Vendor Management",
    status: "Review",
    lastUpdated: "2023-05-17",
    downloads: 0,
  },
  {
    id: "9",
    name: "Physical Security Policy",
    category: "Physical Security",
    status: "Published",
    lastUpdated: "2023-04-20",
    downloads: 87,
  },
  {
    id: "10",
    name: "Business Continuity Policy",
    category: "Resilience",
    status: "Published",
    lastUpdated: "2023-04-15",
    downloads: 110,
  },
]

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
          <p className="text-muted-foreground">Manage cybersecurity policies and templates</p>
        </div>
        <Link href="/admin/policies/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Policy
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Policies</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search policies..." className="pl-8" />
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
                  <DropdownMenuItem>Category</DropdownMenuItem>
                  <DropdownMenuItem>Status</DropdownMenuItem>
                  <DropdownMenuItem>Last Updated</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="font-medium">{policy.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{policy.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        policy.status === "Published"
                          ? "border-green-500 text-green-500"
                          : policy.status === "Draft"
                            ? "border-yellow-500 text-yellow-500"
                            : "border-blue-500 text-blue-500"
                      }
                    >
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{policy.lastUpdated}</TableCell>
                  <TableCell>{policy.downloads}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Policy</DropdownMenuItem>
                        <DropdownMenuItem>Edit Policy</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Archive Policy</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>12</strong> policies
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
    </div>
  )
}


