"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, FileText, Settings, Eye, Trash } from "lucide-react"

export default function AddTemplate() {
  const router = useRouter()
  const [templateInfo, setTemplateInfo] = useState({
    title: "",
    description: "",
    documentType: "privacy-policy",
    status: "draft"
  })
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // API call to save template would go here
      console.log("Saving template:", templateInfo, content)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect back to templates list
      router.push("/admin/templates")
    } catch (error) {
      console.error("Error saving template:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-sidebar h-full">
        <div className="p-4 border-b">
          <Link href="/admin/templates">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
          </Link>
          <h2 className="text-lg font-semibold">New Template</h2>
        </div>
        <div className="p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#basic-info">
                <FileText className="mr-2 h-4 w-4" />
                Basic Information
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#content">
                <FileText className="mr-2 h-4 w-4" />
                Template Content
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="space-y-2">
            <Button className="w-full" onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Template"}
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/admin/templates">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Template Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info" id="basic-info">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Template Name
                    </Label>
                    <Input 
                      id="title" 
                      className="col-span-3" 
                      placeholder="e.g. Privacy Policy" 
                      value={templateInfo.title}
                      onChange={(e) => setTemplateInfo({...templateInfo, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="document-type" className="text-right">
                      Document Type
                    </Label>
                    <Select 
                      value={templateInfo.documentType}
                      onValueChange={(value) => setTemplateInfo({...templateInfo, documentType: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="privacy-policy">Privacy Policy</SelectItem>
                        <SelectItem value="terms-of-service">Terms of Service</SelectItem>
                        <SelectItem value="cookie-policy">Cookie Policy</SelectItem>
                        <SelectItem value="eula">EULA</SelectItem>
                        <SelectItem value="return-policy">Return Policy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={templateInfo.status}
                      onValueChange={(value) => setTemplateInfo({...templateInfo, status: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      className="col-span-3"
                      placeholder="Brief description of this template"
                      rows={3}
                      value={templateInfo.description}
                      onChange={(e) => setTemplateInfo({...templateInfo, description: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" id="content">
              <Card>
                <CardHeader>
                  <CardTitle>Template Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-content">Content</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        Use <code className="bg-muted p-1 rounded">///variable\\\</code> for text inputs and <code className="bg-muted p-1 rounded">[[[option1|option2|option3]]]</code> for select inputs.
                      </div>
                      <Textarea
                        id="template-content"
                        className="font-mono min-h-[400px]"
                        placeholder="Enter your template content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" id="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Template Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="applicable-laws" className="text-right">
                      Applicable Laws
                    </Label>
                    <Select defaultValue="multiple">
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gdpr">GDPR</SelectItem>
                        <SelectItem value="ccpa">CCPA</SelectItem>
                        <SelectItem value="cpra">CPRA</SelectItem>
                        <SelectItem value="multiple">Multiple Laws</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="variables" className="text-right pt-2">
                      Available Variables
                    </Label>
                    <Textarea
                      id="variables"
                      className="col-span-3"
                      placeholder="company_name, website_url, contact_email"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}