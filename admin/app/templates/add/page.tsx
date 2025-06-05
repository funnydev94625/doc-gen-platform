"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileText, Save, Layers } from "lucide-react"
import { ErrorDisplay } from "@/components/ui/error-display"
import api from "@/lib/api"

// Types
interface TemplateData {
  title: string
  description: string
  status: string
}

export default function AddTemplatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [templateData, setTemplateData] = useState<TemplateData>({
    title: "",
    description: "",
    status: "Draft"
  })
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTemplateData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!templateData.title.trim() || !templateData.description.trim() || !file) {
      setError("All fields are required")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", templateData.title)
      formData.append("description", templateData.description)
      formData.append("docx", file)

      const { data } = await api.post("/api/admin/template", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setSuccess(true)
      setTimeout(() => router.push(`/templates/edit/${data._id}`), 1500)
    } catch (error: any) {
      setError(error.response?.data?.msg || error.message || "Failed to add template")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2">
      <div className="w-full max-w-2xl">
        <header className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800 flex items-center gap-2">
            <Layers className="h-7 w-7 text-blue-500" />
            Add New Template
          </h1>
        </header>

        {error && (
          <ErrorDisplay 
            message={error}
            type="error"
            className="mb-4"
            onDismiss={() => setError("")}
          />
        )}

        {success && (
          <ErrorDisplay 
            message="Template added successfully! Redirecting..." 
            type="info" 
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-xl border-0 rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl pb-6">
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Template Details
              </CardTitle>
              <CardDescription className="text-blue-100">
                Create a new template for your organization
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold text-blue-700">
                  Template Name
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Acceptable Use Template"
                  value={templateData.title}
                  onChange={handleChange}
                  className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold text-blue-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the template"
                  value={templateData.description}
                  onChange={handleChange}
                  rows={3}
                  className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docx" className="font-semibold text-blue-700">
                  Template File (.docx)
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    readOnly
                    value={file ? file.name : ""}
                    placeholder="No file selected"
                    className="flex-1 rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBrowseClick}
                    className="px-4"
                  >
                    ...
                  </Button>
                  <input
                    type="file"
                    accept=".docx"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
                {fileUrl && (
                  <div className="text-xs text-blue-500 mt-1 break-all">
                    File URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between bg-blue-50 rounded-b-2xl pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/templates")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Template"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
