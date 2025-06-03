'use client'

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
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

type Policy = {
  _id: string;
  title: string;
  status: number;
  updatedAt: string;
  createdBy: { isAdmin: boolean; name: string };
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await api.get('/api/admin/template')
        setPolicies(response.data)
      } catch (error) {
        console.error('Error fetching policies:', error)
      }
    }
    fetchPolicies()
  }, [])

  const getStatusBadge = (status: number) => (
    <Badge
      variant="outline"
      className={
        status === 1
          ? "border-green-500 text-green-500"
          : status === 0
            ? "border-yellow-500 text-yellow-500"
            : "border-blue-500 text-blue-500"
      }
    >
      {status === 1 ? 'published' : 'draft'}
    </Badge>
  )

  const renderPolicyRow = (policy: Policy) => (
    <TableRow key={policy._id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="font-medium">{policy.title}</div>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(policy.status)}</TableCell>
      <TableCell>{policy.updatedAt}</TableCell>
      <TableCell>{policy.createdBy.isAdmin ? 'Admin' : policy.createdBy.name}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/policies/edit/${policy._id}`)}>
              Edit Policy
            </DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Archive Policy</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
          <p className="text-muted-foreground">Manage cybersecurity policies and templates</p>
        </div>
        <Link href="/policies/add">
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
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No Data
                  </TableCell>
                </TableRow>
              ) : (
                policies.map(renderPolicyRow)
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-{policies.length}</strong> of <strong>{policies.length}</strong> policies
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


