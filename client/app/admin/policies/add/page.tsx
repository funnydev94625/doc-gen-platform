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
import { ArrowLeft, Save, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"

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

export default function AddPolicyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [policyData, setPolicyData] = useState({
    name: "",
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
    if (!policyData.name.trim()) {
      setError("Policy name is required")
      return false
    }
    if (!policyData.category) {
      setError("Category is required")
      return false
    }
    if (!policyData.content.trim()) {
      setError("Policy content is required")
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
      // Get token from localStorage
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("You must be logged in to add a policy")
        setIsSubmitting(false)
        return
      }
      
      const response = await axios.post(
        "/api/policies", 
        policyData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          }
        }
      )
      
      setSuccess(true)
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/admin/policies")
      }, 1500)
      
    } catch (error: any) {
      console.error("Error adding policy:", error)
      setError(
        error.response?.data?.msg || 
        "Failed to add policy. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/policies">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Policies
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add New Policy</h1>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Policy added successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Policy Details</CardTitle>
            <CardDescription>
              Create a new policy for your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Policy Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Acceptable Use Policy"
                value={policyData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={policyData.category} 
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the policy"
                value={policyData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Policy Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter the full policy content here..."
                value={policyData.content}
                onChange={handleChange}
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can use Markdown formatting for headings, lists, and other formatting.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={policyData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/policies")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Policy"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}