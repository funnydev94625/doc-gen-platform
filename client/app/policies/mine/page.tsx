"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Eye, ArrowUp, ArrowDown, Trash2 } from "lucide-react"
import api from "@/lib/api"

type Policy = {
  _id: string
  template_id: string
  user_id: string
  created_at: string
  updated_at: string
  template_title: string
  template_description: string
}

type SortKey = keyof Pick<Policy, "template_title" | "template_description" | "created_at" | "updated_at">

export default function MyPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("created_at")
  const [sortAsc, setSortAsc] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await api.get("/api/policy")
        setPolicies(res.data)
      } catch (err) {
        setPolicies([])
      } finally {
        setLoading(false)
      }
    }
    fetchPolicies()
  }, [])

  const filteredPolicies = useMemo(() => {
    let filtered = policies
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
    return filtered
  }, [policies, search, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(a => !a)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await api.delete(`/api/policy/${id}`)
      setPolicies(policies => policies.filter(p => p._id !== id))
    } catch {
      // Optionally show error
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-[70%]">
        <h1 className="text-2xl font-bold mb-6">My Policies</h1>
        <div className="flex items-center justify-between mb-4">
          <Input
            type="search"
            placeholder="Search by template title or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-80"
          />
        </div>
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
              ) : filteredPolicies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No policies found.</TableCell>
                </TableRow>
              ) : (
                filteredPolicies.map(policy => (
                  <TableRow key={policy._id}>
                    <TableCell>{policy.template_title}</TableCell>
                    <TableCell>{policy.template_description}</TableCell>
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
                          onClick={() => router.push(`/policies/view/${policy._id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
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
                      {/* Custom Confirm Modal */}
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
      </div>
    </div>
  )
}