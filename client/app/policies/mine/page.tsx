"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Eye, ArrowUp, ArrowDown, Trash2, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

type Policy = {
  _id: string
  template_id: string
  user_id: string
  created_at: string
  updated_at: string
  template_title: string
  template_description: string
  is_favorite: boolean
}

type SortKey = keyof Pick<Policy, "template_title" | "template_description" | "created_at" | "updated_at">

const ITEMS_PER_PAGE = 7

export default function MyPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("created_at")
  const [sortAsc, setSortAsc] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all")
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    api.get("/api/policy")
      .then(res => setPolicies(res.data))
      .catch(() => setPolicies([]))
      .finally(() => setLoading(false))
  }, [])

  // Reset to page 1 when search or tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeTab])

  const { paginatedPolicies, totalPages, totalItems } = useMemo(() => {
    let filtered = policies
    
    // Filter by tab (all or favorites)
    if (activeTab === "favorites") {
      filtered = filtered.filter(p => p.is_favorite)
    }
    
    // Filter by search
    if (search.trim()) {
      const s = search.trim().toLowerCase()
      filtered = filtered.filter(
        p =>
          p.template_title.toLowerCase().includes(s) ||
          p.template_description.toLowerCase().includes(s)
      )
    }
    filtered = [...filtered].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (sortKey === "created_at" || sortKey === "updated_at") {
        const aDate = new Date(aVal as string)
        const bDate = new Date(bVal as string)
        if (aDate < bDate) return sortAsc ? -1 : 1
        if (aDate > bDate) return sortAsc ? 1 : -1
        return 0
      }
      if (aVal < bVal) return sortAsc ? -1 : 1
      if (aVal > bVal) return sortAsc ? 1 : -1
      return 0
    })

    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedPolicies = filtered.slice(startIndex, endIndex)

    return { paginatedPolicies, totalPages, totalItems }
  }, [policies, search, sortKey, sortAsc, currentPage, activeTab])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
    setCurrentPage(1) // Reset to page 1 when sorting changes
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await api.delete(`/api/policy/${id}`)
      setPolicies(policies => policies.filter(p => p._id !== id))
    } catch {
      toast.error("Failed to delete policy")
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const handleView = async (policyId: string) => {
    const url = `/api/policy/preview/${policyId}`
    const newWindow = window.open("", "_blank")
    try {
      const res = await api.get(url, { responseType: "blob" })
      const blob = new Blob([res.data], { type: "application/pdf" })
      const blobUrl = window.URL.createObjectURL(blob)
      if (newWindow) {
        newWindow.location.href = blobUrl
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000)
      }
    } catch {
      if (newWindow) newWindow.close()
      toast.error("Failed to preview policy")
    }
  }

  const handleFavoriteToggle = async (policyId: string) => {
    setFavoriteLoading(policyId)
    try {
      const response = await api.put(`/api/policy/${policyId}/favorite`)
      const { is_favorite } = response.data
      
      // Update the policy in state
      setPolicies(prevPolicies => 
        prevPolicies.map(policy => 
          policy._id === policyId 
            ? { ...policy, is_favorite }
            : policy
        )
      )
      
      toast.success(is_favorite ? "Added to favorites" : "Removed from favorites")
    } catch {
      toast.error("Failed to update favorite status")
    } finally {
      setFavoriteLoading(null)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-1"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    )

    // First page and ellipsis if needed
    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="mr-1"
        >
          1
        </Button>
      )
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="px-2 text-gray-500">...</span>
        )
      }
    }

    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="mr-1"
        >
          {i}
        </Button>
      )
    }

    // Last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="px-2 text-gray-500">...</span>
        )
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="mr-1"
        >
          {totalPages}
        </Button>
      )
    }

    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    )

    return buttons
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-[70%]">
        <h1 className="text-2xl font-bold mb-6">My Policies</h1>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "favorites")} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="all">All Policies</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <Button
              onClick={() => router.push("/policies")}
              variant="default"
              size="sm"
            >
              + Create Policy
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Input
              type="search"
              placeholder="Search by template title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-80"
            />
          </div>

          <TabsContent value={activeTab} className="mt-4">
            {/* Results summary */}
            {!loading && (
              <div className="mb-4 text-sm text-gray-600">
                Showing {paginatedPolicies.length} of {totalItems} {activeTab === "favorites" ? "favorite " : ""}policies
                {totalItems > 0 && totalPages > 1 && (
                  <span> (Page {currentPage} of {totalPages})</span>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("template_title")}
                >
                  Template Title{" "}
                  {sortKey === "template_title" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("template_description")}
                >
                  Template Description{" "}
                  {sortKey === "template_description" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("created_at")}
                >
                  Created At{" "}
                  {sortKey === "created_at" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("updated_at")}
                >
                  Updated At{" "}
                  {sortKey === "updated_at" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : paginatedPolicies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {activeTab === "favorites" ? "No favorite policies found." : "No policies found."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPolicies.map(policy => (
                  <TableRow key={policy._id}>
                    <TableCell>{policy.template_title}</TableCell>
                    <TableCell>
                      {policy.template_description.length > 100 
                        ? `${policy.template_description.substring(0, 100)}...`
                        : policy.template_description
                      }
                    </TableCell>
                    <TableCell>{new Date(policy.created_at).toLocaleString()}</TableCell>
                    <TableCell>{new Date(policy.updated_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/policies/edit/${policy._id}`)}
                        >
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(policy._id)}
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant={policy.is_favorite ? "default" : "outline"}
                          onClick={() => handleFavoriteToggle(policy._id)}
                          disabled={favoriteLoading === policy._id}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${policy.is_favorite ? 'fill-current' : ''}`} />
                          {favoriteLoading === policy._id ? "..." : (policy.is_favorite ? "Favorited" : "Favorite")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmId(policy._id)}
                          disabled={deletingId === policy._id}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {deletingId === policy._id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                      {/* Confirm Modal */}
                      {confirmId === policy._id && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
                            <h3 className="font-bold mb-2">Delete Policy</h3>
                            <p className="mb-4">Are you sure you want to delete this policy? This action cannot be undone.</p>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setConfirmId(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(policy._id)}
                                disabled={deletingId === policy._id}
                              >
                                {deletingId === policy._id ? "Deleting..." : "Delete"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center mt-6 space-x-1">
                {renderPaginationButtons()}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}