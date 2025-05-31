"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, FileText, Layers } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios, { AxiosInstance } from "axios"

const categories = [
  "General",
  "Access Control",
  "Data Security",
  "Security Operations",
  "Network Security",
  "Physical Security",
  "Compliance",
  "Risk Management",
  "Incident Response",
  "Business Continuity"
]

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default function AddPolicyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [policyData, setPolicyData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    status: "Draft"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPolicyData({
      ...policyData,
      [name]: value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setPolicyData({
      ...policyData,
      [name]: value
    })
  }

  const validateForm = () => {
    if (!policyData.title.trim()) {
      setError("Policy name is required")
      return false
    }
    if (!policyData.category) {
      setError("Category is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("You must be logged in to add a policy")
        setIsSubmitting(false)
        return
      }

      const response = await api.post(
        "/api/admin/template",
        policyData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          }
        }
      )

      setSuccess(true)
      setTimeout(() => {
        router.push(`/policies/edit/${response.data._id}`)
      }, 1500)

    } catch (error: any) {
      setError(
        error.response?.data?.msg ||
        "Failed to add policy. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/policies">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800 flex items-center gap-2">
            <Layers className="h-7 w-7 text-blue-500" />
            Add New Policy
          </h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
            <AlertDescription>Policy added successfully! Redirecting...</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="shadow-xl border-0 rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl pb-6">
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Policy Details
              </CardTitle>
              <CardDescription className="text-blue-100">
                Create a new policy for your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold text-blue-700">Policy Name</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Acceptable Use Policy"
                  value={policyData.title}
                  onChange={handleChange}
                  required
                  className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold text-blue-700">Category</Label>
                <Select
                  value={policyData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold text-blue-700">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the policy"
                  value={policyData.description}
                  onChange={handleChange}
                  rows={3}
                  className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-blue-50 rounded-b-2xl pt-6">
              <Button
                variant="outline"
                type="button"
                className="rounded-lg"
                onClick={() => router.push("/policies")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 transition shadow"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Policy"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
