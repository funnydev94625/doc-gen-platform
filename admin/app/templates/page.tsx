"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Eye, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

type Template = {
  _id: string
  title: string
  description: string
  created_at: string
  updated_at: string
  docx?: string
}

type SortKey = keyof Pick<Template, "title" | "description" | "created_at" | "updated_at">

export default function TemplateTablePage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("created_at")
  const [sortAsc, setSortAsc] = useState(false)
  const [alertMsg, setAlertMsg] = useState<string | null>(null)
  const [alertType, setAlertType] = useState<"default" | "destructive">("default")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/api/template")
        setTemplates(res.data)
      } catch (err) {
        setTemplates([])
        setAlertMsg("Failed to fetch templates.")
        setAlertType("destructive")
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  const handleEdit = (id: string) => {
    router.push(`/templates/edit/${id}`)
  }

  const handlePreview = (docx?: string) => {
    if (docx) {
      window.open(`/uploads/templates/${docx}`, "_blank")
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/api/admin/template/${deleteId}`)
      setTemplates(templates => templates.filter(t => t._id !== deleteId))
      setAlertMsg("Template deleted successfully.")
      setAlertType("default")
    } catch (err) {
      setAlertMsg("Failed to delete template.")
      setAlertType("destructive")
    } finally {
      setDeleteId(null)
    }
  }

  // Search and sort logic
  const filteredTemplates = useMemo(() => {
    let filtered = templates
    if (search.trim()) {
      const s = search.trim().toLowerCase()
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(s) ||
          t.description.toLowerCase().includes(s)
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
  }, [templates, search, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(a => !a)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Templates</h1>
      {alertMsg && (
        <Alert variant={alertType} className="mb-4">
          <AlertTitle>{alertType === "destructive" ? "Error" : "Info"}</AlertTitle>
          <AlertDescription>{alertMsg}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between mb-4">
        <Input
          type="search"
          placeholder="Search by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-80"
        />
        <Button onClick={() => router.push("/templates/add")}>Add Template</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("title")}
              >
                Title{" "}
                {sortKey === "title" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("description")}
              >
                Description{" "}
                {sortKey === "description" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
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
            ) : filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No templates found.</TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map(t => (
                <TableRow key={t._id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{new Date(t.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(t.updated_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(t._id)}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePreview(t.docx)} disabled={!t.docx}>
                        <Eye className="w-4 h-4 mr-1" /> Preview
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Custom Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Delete Template</AlertTitle>
              <AlertDescription>
                Are you sure you want to delete this template? This action cannot be undone.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}