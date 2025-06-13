'use client'

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search, Filter, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react"
import api from "@/lib/api"

const PAGE_SIZE = 10

function getStatus(user: any) {
  if (user.status === 0) return "Pending"
  if (user.status === 2) return "Suspended"
  if (user.status === 1) return "Active"
  return user.isVerified ? "Active" : "Inactive"
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "suspended">("all")
  const [sortKey, setSortKey] = useState<"name" | "createdAt" | "status" | "policies">("createdAt")
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    api.get("/api/admin/users")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = useMemo(() => {
    let filtered = users

    if (search.trim()) {
      const s = search.trim().toLowerCase()
      filtered = filtered.filter(
        u =>
          u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s)
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(u => (roleFilter === "admin" ? u.isAdmin : !u.isAdmin))
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(u => getStatus(u).toLowerCase() === statusFilter)
    }

    filtered = [...filtered].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (sortKey === "createdAt") {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }
      if (sortKey === "status") {
        aVal = getStatus(a)
        bVal = getStatus(b)
      }
      if (sortKey === "policies") {
        aVal = a.policies?.length || 0
        bVal = b.policies?.length || 0
      }
      if (aVal < bVal) return sortAsc ? -1 : 1
      if (aVal > bVal) return sortAsc ? 1 : -1
      return 0
    })

    return filtered
  }, [users, search, roleFilter, statusFilter, sortKey, sortAsc])

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)
  const pagedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleChangeUserState = async (userId: string, status: number) => {
    try {
      await api.post("/api/admin/change-user-state", { userId, status })
      setUsers(prev =>
        prev.map(user => (user._id === userId ? { ...user, status } : user))
      )
    } catch {}
  }

  const handleResetPassword = async (email: string) => {
    try {
      await api.post(`/api/admin/reset-password`, { email })
      alert("Password reset link sent to the user's email.")
    } catch {}
  }

  const renderSortableHeader = (
    label: string,
    key: "name" | "createdAt" | "status" | "policies"
  ) => (
    <TableHead
      className="cursor-pointer select-none"
      onClick={() => {
        if (sortKey === key) setSortAsc(asc => !asc)
        else {
          setSortKey(key)
          setSortAsc(true)
        }
      }}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === key ? (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : null}
      </span>
    </TableHead>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem
                    onClick={() => {
                      setRoleFilter("all")
                      setPage(1)
                    }}
                    className={roleFilter === "all" ? "font-bold" : ""}
                  >
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setRoleFilter("admin")
                      setPage(1)
                    }}
                    className={roleFilter === "admin" ? "font-bold" : ""}
                  >
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setRoleFilter("user")
                      setPage(1)
                    }}
                    className={roleFilter === "user" ? "font-bold" : ""}
                  >
                    User
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("all")
                      setPage(1)
                    }}
                    className={statusFilter === "all" ? "font-bold" : ""}
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("active")
                      setPage(1)
                    }}
                    className={statusFilter === "active" ? "font-bold" : ""}
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("pending")
                      setPage(1)
                    }}
                    className={statusFilter === "pending" ? "font-bold" : ""}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("suspended")
                      setPage(1)
                    }}
                    className={statusFilter === "suspended" ? "font-bold" : ""}
                  >
                    Suspended
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {renderSortableHeader("User", "name")}
                <TableHead>Role</TableHead>
                {renderSortableHeader("Status", "status")}
                {renderSortableHeader("Created At", "createdAt")}
                {renderSortableHeader("Policies", "policies")}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : pagedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                pagedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${user.name?.charAt(0) || "U"}`} />
                          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isAdmin ? "default" : "outline"}>
                        {user.isAdmin ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          getStatus(user) === "Active"
                            ? "border-green-500 text-green-500"
                            : getStatus(user) === "Pending"
                            ? "border-yellow-500 text-yellow-500"
                            : getStatus(user) === "Suspended"
                            ? "border-red-500 text-red-500"
                            : "border-gray-500 text-gray-500"
                        }
                      >
                        {getStatus(user)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{user.policies?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleChangeUserState(user._id, 1)}
                            disabled={user.status === 1}
                          >
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleChangeUserState(user._id, 2)}
                            disabled={user.status === 2}
                          >
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                            Reset Password
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
